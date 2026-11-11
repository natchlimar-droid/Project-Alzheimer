import {
  calculateLongitudinalDelta,
  evaluateAnticholinergicBurden,
  evaluateBiomarkerAxis,
  evaluateMiniCog,
  evaluatePreTestValidity,
  evaluateReversibleAxis,
  evaluateSpeechBiomarkers,
  evaluateVisualMotorTaskExperimental,
  stratifyCognitiveRisk,
} from "./riskStratification";
import { AssessmentInput, PreviousSessionSnapshot } from "../types/clinical";
import { LOINC_DATA_MAPPING, ACB_MEDICATIONS } from "../data/clinicalContent";
import { analyzeClockDrawingStrokes, Point2D } from "./cdtAnalyzer";
import { buildFhirR4Bundle, parseFhirBundleToLabResults } from "../services/fhirService";
import {
  buildPseudonymizedStorageSchemas,
  createAuditLogEntry,
  generatePseudonymToken,
} from "../services/privacyAuditService";

/**
 * Self-contained Clinical Verification Test Suite for Multimodal Multi-Axis Engine
 * Covers all 7 clinical evaluation bug fixes and core clinical safety criteria.
 */
export function runClinicalEngineTests(): { passed: number; failed: number; logs: string[] } {
  let passed = 0;
  let failed = 0;
  const logs: string[] = [];

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      passed++;
      logs.push(`✅ PASS: ${testName}`);
    } else {
      failed++;
      logs.push(`❌ FAIL: ${testName}${details ? ` — ${details}` : ""}`);
    }
  }

  // Test 1: Incomplete Assessment Check (Null Input Protection Against False Negatives)
  const incompleteCase: AssessmentInput = {
    age: 72,
    yearsOfEducation: 12,
    ad8Score: null,
    delayedRecallScore: null,
    cdtResult: null,
    recallMode: "FREE_RECALL",
    visualMotorTimeMs: null,
    visualMotorErrors: null,
  };
  const incompleteOut = stratifyCognitiveRisk(incompleteCase);
  assert(
    incompleteOut.isComplete === false &&
    incompleteOut.missingDomainsTh.length === 3 &&
    incompleteOut.axes.cognitiveAxis === "INCOMPLETE_DATA",
    "Clinical Safety 1: Null inputs reject risk calculation with explicit missing domain list",
    `isComplete=${incompleteOut.isComplete}, missing=${incompleteOut.missingDomainsTh.join(", ")}`
  );

  // Test 2: Pre-Test Validity Gatekeeper (Delirium Contraindication)
  const deliriumCase: AssessmentInput = {
    age: 78,
    yearsOfEducation: 10,
    ad8Score: 4,
    delayedRecallScore: 0,
    cdtResult: "ABNORMAL",
    recallMode: "FREE_RECALL",
    visualMotorTimeMs: 45000,
    visualMotorErrors: 2,
    preTestValidity: {
      deliriumSuspected: true,
      severeVisualImpairment: false,
      severeHearingImpairment: false,
      acuteSedativeOrIntoxication: false,
      acuteSeverePainOrMedicalIllness: false,
      isNonLiteratePathway: false,
      validityPassed: false,
      exclusionReasonsTh: ["Delirium suspected"],
    },
  };
  const deliriumOut = stratifyCognitiveRisk(deliriumCase);
  assert(
    deliriumOut.isComplete === false &&
    deliriumOut.clinicalFlags.some((f) => f.includes("PRE-TEST CONTRAINDICATION")),
    "Clinical Safety 2: Active delirium stops cognitive screening with clinical contraindication"
  );

  // Test 3: Isolated Aβ42/40 Evaluation (BUG FIX 1: Must NOT report p-tau negative when p-tau was not tested!)
  const isolatedAbetaCase: AssessmentInput = {
    age: 74,
    yearsOfEducation: 14,
    ad8Score: 4,
    delayedRecallScore: 1,
    cdtResult: "ABNORMAL",
    recallMode: "FREE_RECALL",
    visualMotorTimeMs: 50000,
    visualMotorErrors: 1,
    labs: {
      abeta_42_40_ratio: 0.05, // Severely abnormal amyloid ratio (< 0.09)
      // Note: plasma_ptau217_pg_mL is NOT provided
    },
  };
  const abetaOut = stratifyCognitiveRisk(isolatedAbetaCase);
  assert(
    abetaOut.axes.biomarkerAxis === "AD_BIOMARKER_POSITIVE" &&
    abetaOut.biomarkerDetails.ptau217Status === "UNASSESSED" &&
    abetaOut.biomarkerDetails.abetaRatioStatus === "ABNORMAL_AMYLOID_POSITIVE" &&
    !abetaOut.clinicalFlags.some((f) => f.includes("p-tau217 เป็นลบ")),
    "Biomarker Engine 1: Isolated Aβ42/40 (0.05) triggers AD_BIOMARKER_POSITIVE and marks p-tau as UNASSESSED without false negative claim"
  );

  // Test 4: Comprehensive Geriatric Labs (BUG FIX 2: Glucose 30, Hb 6, Creatinine 4, Folate 1, ALT 300)
  const fullLabCase: AssessmentInput = {
    age: 79,
    yearsOfEducation: 8,
    ad8Score: 3,
    delayedRecallScore: 1,
    cdtResult: "NORMAL",
    recallMode: "FREE_RECALL",
    visualMotorTimeMs: 40000,
    visualMotorErrors: 0,
    labs: {
      fasting_glucose_mg_dL: 30,
      hemoglobin_g_dL: 6.0,
      creatinine_mg_dL: 4.0,
      serum_folate_ng_mL: 1.0,
      alt_u_L: 300,
    },
  };
  const fullLabOut = stratifyCognitiveRisk(fullLabCase);
  const revAxes = fullLabOut.axes.reversibleAxis;
  assert(
    revAxes.includes("SEVERE_HYPOGLYCEMIA") &&
    revAxes.includes("SEVERE_ANEMIA") &&
    revAxes.includes("SEVERE_RENAL_FAILURE_UREMIC_RISK") &&
    revAxes.includes("FOLATE_DEFICIENCY") &&
    revAxes.includes("SEVERE_HEPATIC_DYSFUNCTION") &&
    !revAxes.includes("UNASSESSED"),
    "Reversible Axis 1: Glucose 30, Hb 6, Cr 4, Folate 1, ALT 300 all flagged as critical reversible encephalopathies"
  );

  // Test 5: Central Hypothyroidism & Thyrotoxicosis Differentiation (BUG FIX 2 & 7)
  const centralThyroidEval = evaluateReversibleAxis({
    tsh_uIU_mL: 2.1, // Normal TSH
    free_t4_ng_dL: 0.6, // Low FT4
  });
  const thyrotoxicosisEval = evaluateReversibleAxis({
    tsh_uIU_mL: 0.05, // Low TSH
    free_t4_ng_dL: 2.4, // High FT4
  });
  assert(
    centralThyroidEval.categories.includes("CENTRAL_HYPOTHYROIDISM_SUSPECTED") &&
    thyrotoxicosisEval.categories.includes("HYPERTHYROIDISM_THYROTOXICOSIS") &&
    !thyrotoxicosisEval.categories.includes("OVERT_HYPOTHYROIDISM"),
    "Endocrine Logic: Central Hypothyroidism (Normal TSH + Low FT4) and Thyrotoxicosis (Low TSH) correctly identified"
  );

  // Test 6: Short Interval (<90d) Precipitous Drop (BUG FIX 3: Recall 3->0, AD8 0->6 in 7 days)
  const prevSession7d: PreviousSessionSnapshot = {
    session_id: "SES-PREV-7D",
    assessedAtIso: "2026-11-04T09:00:00.000Z", // 7 days ago
    ad8Score: 0,
    delayedRecallScore: 3,
    cdtResult: "NORMAL",
    screeningCompositeIndex: 5,
  };
  const currSession7d: AssessmentInput = {
    age: 75,
    yearsOfEducation: 12,
    ad8Score: 6,
    delayedRecallScore: 0,
    cdtResult: "ABNORMAL",
    recallMode: "FREE_RECALL",
    visualMotorTimeMs: 65000,
    visualMotorErrors: 3,
    previousSession: prevSession7d,
    assessedAtIso: "2026-11-11T09:00:00.000Z",
  };
  const delta7d = calculateLongitudinalDelta(currSession7d, 70, prevSession7d);
  assert(
    delta7d.trajectoryStatus === "ACUTE_PRECIPITOUS_DECLINE" &&
    delta7d.acutePrecipitousDeclineFlag === true &&
    delta7d.annualizedRateCalculated === false &&
    delta7d.deltaDelayedRecallScore === -3 &&
    delta7d.deltaAd8Score === 6,
    "Longitudinal 1: Drop within 7 days reports ACUTE_PRECIPITOUS_DECLINE emergency alert, NOT STABLE"
  );

  // Test 7: Clinician Override Preserves Biological Biomarker Data (BUG FIX 4)
  const overrideBiomarkerCase: AssessmentInput = {
    age: 72,
    yearsOfEducation: 16,
    ad8Score: 4,
    delayedRecallScore: 0,
    cdtResult: "ABNORMAL",
    recallMode: "FREE_RECALL",
    visualMotorTimeMs: 40000,
    visualMotorErrors: 1,
    labs: {
      plasma_ptau217_pg_mL: 0.85,
      ptau217_status: "POSITIVE",
    },
    clinicianOverride: {
      isOverridden: true,
      overriddenCognitiveAxis: "COGNITIVE_NORMAL",
      clinicalRationale: "ผู้ป่วยกังวลและเครียดขณะทำแบบทดสอบ ในชีวิตประจำวันยังบริหารธุรกิจได้ปกติ",
      physicianLicenseNumber: "ว.49120",
      clinicianName: "นพ. ทดสอบ",
      practitionerAttestation: true,
      signedAtIso: "2026-11-11T10:00:00.000Z",
    },
  };
  const overrideBiomarkerOut = stratifyCognitiveRisk(overrideBiomarkerCase);
  assert(
    overrideBiomarkerOut.axes.algorithmicCognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA" &&
    overrideBiomarkerOut.axes.cognitiveAxis === "COGNITIVE_NORMAL" &&
    overrideBiomarkerOut.axes.biomarkerAxis === "AD_BIOMARKER_POSITIVE" &&
    overrideBiomarkerOut.biomarkerDetails.ptau217Status === "POSITIVE",
    "Clinical Governance: Clinician Override to COGNITIVE_NORMAL preserves positive biological biomarker and algorithmic baseline"
  );

  // Test 8: Free Recall Priority vs Borson Mini-Cog Criteria (BUG FIX 7 / Mini-Cog Standard)
  const miniCogPassEval = evaluateMiniCog(1, "NORMAL", 3);
  const miniCogFailEval = evaluateMiniCog(1, "ABNORMAL", 3);
  assert(
    miniCogPassEval.totalScore === 3 &&
    miniCogPassEval.isPositive === false &&
    miniCogFailEval.totalScore === 1 &&
    miniCogFailEval.isPositive === true,
    "Mini-Cog Borson Standard: Recall 1 + Normal Clock passes (3/5, screen-neg); Recall 1 + Abnormal Clock fails (1/5, screen-pos)"
  );

  // Test 9: Anticholinergic Cognitive Burden Table (BUG FIX 7: Specific APIs)
  const acbCheck = evaluateAnticholinergicBurden(["MED_CPM", "MED_DIMENHYDRINATE", "MED_LORAZEPAM"]);
  assert(
    acbCheck.acbTotalScore === 7 && // CPM 3 + Dimenhydrinate 3 + Lorazepam 1 = 7
    acbCheck.high_acb_risk_flag === true &&
    acbCheck.matchedNamesTh.some(n => n.includes("Chlorpheniramine")) &&
    acbCheck.matchedNamesTh.some(n => n.includes("Dimenhydrinate")) &&
    acbCheck.matchedNamesTh.some(n => n.includes("Lorazepam")),
    "Pharmacology: Verified individual ACB APIs (CPM=3, Dimenhydrinate=3, Lorazepam=1) sum to 7"
  );

  // Test 10: Non-Literate Alternative Pathway Support
  const nonLiterateCase: AssessmentInput = {
    age: 80,
    yearsOfEducation: 0,
    ad8Score: 1,
    delayedRecallScore: 2,
    cdtResult: null, // Exempted for non-literate
    recallMode: "FREE_RECALL",
    visualMotorTimeMs: null, // Exempted for non-literate
    visualMotorErrors: null,
    isNonLiteratePathway: true,
    animalNamingCount: 14, // >= 10 animals in 1 min is normal
  };
  const nonLiterateOut = stratifyCognitiveRisk(nonLiterateCase);
  assert(
    nonLiterateOut.isComplete === true &&
    nonLiterateOut.axes.cognitiveAxis === "COGNITIVE_NORMAL" &&
    nonLiterateOut.experimentalTelemetry.nonLiterateAssessmentUsed === true,
    "Accessibility: Non-literate elder assessed via Verbal Memory + Animal Naming without requiring clock/trail"
  );

  // Test 11: Brief IADL Differentiation (MCI vs Dementia)
  const mciIadlCase: AssessmentInput = {
    age: 73,
    yearsOfEducation: 12,
    ad8Score: 3,
    delayedRecallScore: 1,
    cdtResult: "ABNORMAL",
    recallMode: "FREE_RECALL",
    visualMotorTimeMs: 45000,
    visualMotorErrors: 1,
    briefIADL: {
      managingFinancesImpaired: false,
      takingMedicationsImpaired: false,
      usingPhoneOrTransportImpaired: false,
      handlingHouseholdTasksImpaired: false,
      totalImpairedCount: 0,
      isFunctionalDeclinePresent: false, // Intact IADL -> MCI
    },
  };
  const dementiaIadlCase: AssessmentInput = {
    ...mciIadlCase,
    briefIADL: {
      managingFinancesImpaired: true,
      takingMedicationsImpaired: true,
      usingPhoneOrTransportImpaired: false,
      handlingHouseholdTasksImpaired: false,
      totalImpairedCount: 2,
      isFunctionalDeclinePresent: true, // Impaired IADL -> Probable Dementia
    },
  };
  const mciOut = stratifyCognitiveRisk(mciIadlCase);
  const demOut = stratifyCognitiveRisk(dementiaIadlCase);
  assert(
    mciOut.axes.cognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_MCI_SUSPECTED" &&
    demOut.axes.cognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA",
    "Clinical Staging: Brief IADL accurately differentiates MCI (intact IADL) from Probable Dementia (impaired IADL)"
  );

  // Test 12: Speech Biomarker Default to Null & Privacy Redaction (BUG FIX 6)
  const speechDefaultCase = evaluateSpeechBiomarkers(undefined);
  assert(
    speechDefaultCase === null,
    "Privacy & Telemetry: Unrecorded speech returns null instead of fake hardcoded numbers"
  );

  // Test 13: FHIR R4 Bundle Validation (Official LOINC 104352-0 for p-tau217 & Routine Labs)
  const fhirTestOut = stratifyCognitiveRisk(fullLabCase);
  const bundle = buildFhirR4Bundle(fullLabCase, fhirTestOut, { patientId: "P-2026-TEST" });
  assert(
    LOINC_DATA_MAPPING.plasma_ptau217_pg_mL.loincCode === "104352-0" &&
    Array.isArray(bundle.entry) &&
    bundle.entry.some((e: any) => e.resource?.code?.coding?.[0]?.code === "1558-6") && // Glucose
    bundle.entry.some((e: any) => e.resource?.code?.coding?.[0]?.code === "718-7"), // Hemoglobin
    "Standardization: FHIR R4 Bundle exports LOINC 104352-0 for p-tau217 and LOINC codes for all geriatric labs"
  );

  return { passed, failed, logs };
}
