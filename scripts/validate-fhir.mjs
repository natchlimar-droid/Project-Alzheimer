import assert from "node:assert/strict";
import {
  LOINC_DATA_MAPPING,
  FHIR_LOCAL_CODE_SYSTEM,
  stratifyCognitiveRisk,
  evaluateBriefIADL,
  calculate4ATDelirium,
  buildFhirR4Bundle,
  parseFhirBundleToLabResults,
  validateFhirR4Bundle,
} from "../dist/clinical-engine.mjs";

function runFhirAudit() {
  console.log("===============================================================================");
  console.log(" 🏥 HL7 FHIR R4 & LOINC TERMINOLOGY VALIDATION REPORT");
  console.log("===============================================================================");

  // 1. Validate LOINC_DATA_MAPPING catalog invariants (all lookup keys + unique parameters)
  const mappingEntries = Object.entries(LOINC_DATA_MAPPING);
  const uniqueParams = new Map();
  let partCodeCount = 0;
  let exactCount = 0;
  let closestCount = 0;
  let localCount = 0;

  for (const [key, def] of mappingEntries) {
    assert.ok(def.loincCode, `LOINC_DATA_MAPPING.${key} missing loincCode`);
    assert.ok(def.mappingType, `LOINC_DATA_MAPPING.${key} missing mappingType`);
    assert.ok(def.codeSystem, `LOINC_DATA_MAPPING.${key} missing codeSystem`);

    if (/^LP\d+-\d+$/i.test(def.loincCode)) {
      partCodeCount++;
      throw new Error(`Invalid LOINC Part code '${def.loincCode}' found in LOINC_DATA_MAPPING.${key}`);
    }

    const uniqueKey = `${def.loincCode}|${def.codeSystem}`;
    const isNew = !uniqueParams.has(uniqueKey);
    if (isNew) uniqueParams.set(uniqueKey, def);

    if (def.mappingType === "EXACT_LOINC") {
      if (isNew) exactCount++;
      assert.equal(def.codeSystem, "http://loinc.org", `${key} should use http://loinc.org`);
    } else if (def.mappingType === "CLOSEST_MATCH") {
      if (isNew) closestCount++;
      assert.equal(def.codeSystem, "http://loinc.org", `${key} should use http://loinc.org`);
    } else if (def.mappingType === "LOCAL_CODESYSTEM") {
      if (isNew) localCount++;
      assert.equal(def.codeSystem, FHIR_LOCAL_CODE_SYSTEM, `${key} should use local CodeSystem`);
    }
  }

  // 2. Construct comprehensive clinical encounter covering ALL 4 axes + non-literate + ACB + 4AT + Speech
  const sampleInput = {
    age: 74,
    yearsOfEducation: 6,
    ad8Score: 4,
    ad8UnsureCount: 0,
    delayedRecallScore: 1,
    cdtResult: "ABNORMAL",
    recallMode: "FREE_RECALL",
    briefIADL: evaluateBriefIADL(true, false, false, false),
    fourAT: calculate4ATDelirium(0, 0, 0, 0),
    animalNamingCount: 11,
    visualMotorTimeMs: 42000,
    visualMotorErrors: 1,
    baselineTouchLatencyMs: 650,
    anticholinergicBurden: {
      selectedMedicationIds: ["MED_CPM", "MED_LORAZEPAM"],
      acbTotalScore: 4,
    },
    depression2Q: {
      q1_depressed_mood: true,
      q2_anhedonia: false,
      depression_risk_flag: true,
    },
    speechBiomarkers: {
      isExploratoryOnly: true,
      consentRecord: {
        consentGranted: true,
        timestampIso: "2026-11-13T10:00:00.000Z",
        patientPseudonymToken: "PSN-FHIR-AUDIT-01",
        consentWithdrawn: false,
      },
      pauseToSpeechRatio: 0.48,
      phoneticLatencyMs: 2400,
      semanticRepetitionCount: 2,
    },
    labs: {
      tsh_uIU_mL: 2.1,
      free_t4_ng_dL: 0.65,
      vitamin_b12_pg_mL: 165,
      serum_folate_ng_mL: 2.5,
      sodium_mEq_L: 132,
      calcium_mg_dL: 11.2,
      fasting_glucose_mg_dL: 110,
      hba1c_percent: 6.8,
      hemoglobin_g_dL: 11.5,
      creatinine_mg_dL: 1.4,
      egfr_mL_min: 52,
      alt_u_L: 34,
      ast_u_L: 30,
      ldl_mg_dL: 135,
      hdl_mg_dL: 45,
      apoe_genotype: "e3/e4",
      plasma_ptau217_pg_mL: 0.55,
      abeta_42_40_ratio: 0.071,
    },
  };

  const riskOutput = stratifyCognitiveRisk(sampleInput);
  const bundle = buildFhirR4Bundle(sampleInput, riskOutput, {
    patientId: "patient-fhir-audit-001",
    patientName: "กรณีทดสอบมาตรฐาน HL7 FHIR R4",
    timestampIso: "2026-11-13T10:15:00.000Z",
  });

  // 3. Run structural & terminology validator
  const validation = validateFhirR4Bundle(bundle);
  assert.equal(validation.valid, true, `FHIR validation failed: ${validation.errors.join("; ")}`);
  assert.equal(validation.summary.partCodeViolations, 0, "LP* Part codes must be zero");

  // 4. Verify Round-Trip Ingestion preserves lab biomarkers accurately
  const roundTripLabs = parseFhirBundleToLabResults(bundle);
  assert.equal(roundTripLabs.plasma_ptau217_pg_mL, 0.55);
  assert.equal(roundTripLabs.abeta_42_40_ratio, 0.071);
  assert.equal(roundTripLabs.apoe_genotype, "e3/e4");
  assert.equal(roundTripLabs.calcium_mg_dL, 11.2);
  assert.equal(roundTripLabs.egfr_mL_min, 52);
  assert.equal(roundTripLabs.free_t4_ng_dL, 0.65);

  console.log(` ✅ Clinical Parameters Verified       : ${uniqueParams.size} unique (${mappingEntries.length} lookup keys: ${exactCount} Exact, ${closestCount} Closest Match, ${localCount} Local CodeSystem)`);
  console.log(` ✅ LOINC Part (LP*) Violations        : ${partCodeCount} (Bundle violations: ${validation.summary.partCodeViolations})`);
  console.log(` ✅ FHIR R4 Bundle Resource Entries     : ${validation.summary.entryCount} (${validation.summary.observationCount} Observations)`);
  console.log(` ✅ Coding Breakdown                   : ${validation.summary.loincCount} LOINC + ${validation.summary.localCodeCount} Project CodeSystem`);
  console.log(` ✅ Round-Trip Lab Ingestion Parity    : PASSED (p-tau217 104663-0, Aβ42/40 106941-8, APOE 42315-2, Ca, eGFR, FT4)`);
  console.log("===============================================================================");
}

runFhirAudit();
