/**
 * Multimodal Cognitive Screening & Biomarker-Informed Triage System
 * Core Clinical Data Interfaces, Pre-Test Validity Gatekeeper (with 4AT & Non-Literate Path),
 * Multi-Axis Stratification, Reversible Metabolic Encephalopathy Screen,
 * Independent Analyte Biomarker Rules, LOINC & Clinical Governance Types.
 */

export const ALGORITHM_VERSION = "2.4.1-clinical-multiaxis-hardened";

export type APOEGenotype =
  | "e2/e2"
  | "e2/e3"
  | "e2/e4"
  | "e3/e3"
  | "e3/e4"
  | "e4/e4"
  | "UNKNOWN";

export type Ptau217Status = "POSITIVE" | "BORDERLINE" | "NEGATIVE" | "UNASSESSED";
export type AbetaRatioStatus = "ABNORMAL_AMYLOID_POSITIVE" | "NORMAL_AMYLOID_NEGATIVE" | "UNASSESSED";

export type CDTResult = "NORMAL" | "ABNORMAL";

/**
 * 4AT Brief Delirium Assessment Tool (Validated 0-12 Score)
 * 1. Alertness: 0 = Normal, 0 = Mild sleepiness < 10s, 4 = Clearly abnormal (hyper/hypoactive)
 * 2. AMT4 (Age, Date of Birth, Place, Current Year): 0 = 0 errors, 1 = 1 error, 2 = 2+ errors / untestable
 * 3. Attention (Months of year backwards from Dec): 0 = 7+ months correctly, 1 = starts but < 7, 2 = untestable
 * 4. Acute change or fluctuating course: 0 = No, 4 = Yes
 * Score >= 4 indicates delirium suspected.
 */
export interface FourATDeliriumAssessment {
  alertnessScore: 0 | 4;
  amt4Score: 0 | 1 | 2;
  attentionScore: 0 | 1 | 2;
  acuteFluctuationScore: 0 | 4;
  totalScore: number;
  isDeliriumSuspected: boolean;
}

/**
 * Pre-Test Validity Gatekeeper (ด่านตรวจความพร้อมและความสมบูรณ์ก่อนทดสอบ)
 * Identifies delirium (via 4AT), sensory, acute medication, or literacy barriers
 */
export interface PreTestValidityGate {
  deliriumSuspected: boolean; // Screened via 4AT or CAM
  fourAT?: FourATDeliriumAssessment;
  severeVisualImpairment: boolean; // Inability to see canvas/numbers
  severeHearingImpairment: boolean; // Inability to hear verbal stimuli
  acuteSedativeOrIntoxication: boolean; // Acute sedative/hypnotic within 12h
  acuteSeverePainOrMedicalIllness: boolean; // Acute severe illness/distress
  isNonLiteratePathway: boolean; // Alternative non-literate assessment path (Animal naming + AD8)
  validityPassed: boolean;
  exclusionReasonsTh: string[];
}

/**
 * Multi-Axis Parallel Reporting Categories
 * Prevents single-category masking (e.g. Reversible cause masking Alzheimer's)
 */
export type CognitiveAxisCategory =
  | "COGNITIVE_NORMAL"
  | "COGNITIVE_SCREEN_POSITIVE_MCI_SUSPECTED"
  | "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA"
  | "COGNITIVE_SCREEN_POSITIVE_NEEDS_IADL_WORKUP"
  | "INCOMPLETE_DATA";

export type ReversibleAxisCategory =
  | "METABOLIC_NORMAL"
  | "HIGH_ACB_BURDEN"
  | "OVERT_HYPOTHYROIDISM"
  | "SUBCLINICAL_THYROID_WATCH"
  | "SUBCLINICAL_HYPERTHYROIDISM_WATCH"
  | "CENTRAL_HYPOTHYROIDISM_SUSPECTED"
  | "HYPERTHYROIDISM_THYROTOXICOSIS"
  | "VITAMIN_B12_DEFICIENCY"
  | "BORDERLINE_B12_WATCH"
  | "FOLATE_DEFICIENCY"
  | "BORDERLINE_FOLATE_WATCH"
  | "SEVERE_HYPOGLYCEMIA"
  | "HYPOGLYCEMIA_RISK"
  | "SEVERE_HYPERGLYCEMIA"
  | "POOR_GLYCEMIC_CONTROL"
  | "SEVERE_HYPONATREMIA"
  | "MILD_HYPONATREMIA_WATCH"
  | "HYPERNATREMIA"
  | "HYPERCALCEMIA"
  | "HYPOCALCEMIA"
  | "SEVERE_ANEMIA"
  | "ANEMIA_WATCH"
  | "SEVERE_RENAL_FAILURE_UREMIC_RISK"
  | "RENAL_IMPAIRMENT"
  | "SEVERE_HEPATIC_DYSFUNCTION"
  | "HEPATIC_IMPAIRMENT_WATCH"
  | "UNASSESSED";

export type BiomarkerAxisCategory =
  | "AD_BIOMARKER_POSITIVE"
  | "AD_BIOMARKER_INTERMEDIATE"
  | "AD_BIOMARKER_NEGATIVE"
  | "NOT_INDICATED_ASYMPTOMATIC"
  | "UNASSESSED";

export type AffectiveAxisCategory =
  | "PSEUDODEMENTIA_RISK_2Q_POSITIVE"
  | "2Q_NEGATIVE"
  | "UNASSESSED";

export type LoincMappingType = "EXACT_LOINC" | "CLOSEST_MATCH" | "LOCAL_CODESYSTEM";

export interface LoincCodeDefinition {
  fieldKey: keyof LabResults | string;
  loincCode: string;
  loincName: string;
  labelTh: string;
  unit: string;
  referenceRange: string;
  mappingType: LoincMappingType;
  codeSystem: string;
  legacyAliasCodes?: string[];
  category:
  | "REVERSIBLE_METABOLIC"
  | "VASCULAR_METABOLIC"
  | "ROUTINE_GERIATRIC"
  | "ALZHEIMER_GENETIC"
  | "CLINICAL_SCORE";
}

export interface LabResults {
  // 1. Reversible Metabolic Causes
  tsh_uIU_mL?: number | null; // LOINC: 3016-3
  free_t4_ng_dL?: number | null; // LOINC: 3024-7
  vitamin_b12_pg_mL?: number | null; // LOINC: 2132-9
  serum_folate_ng_mL?: number | null; // LOINC: 2284-8
  folate_ng_mL?: number | null; // Alias for serum_folate_ng_mL
  sodium_mEq_L?: number | null; // LOINC: 2951-2
  calcium_mg_dL?: number | null; // LOINC: 17861-6

  // 2. Vascular, Renal, Hepatic & Hematologic Geriatric Causes
  fasting_glucose_mg_dL?: number | null; // LOINC: 1558-6
  hba1c_percent?: number | null; // LOINC: 4548-4
  hemoglobin_g_dL?: number | null; // LOINC: 718-7
  creatinine_mg_dL?: number | null; // LOINC: 2160-0
  serum_creatinine_mg_dL?: number | null; // Alias for creatinine_mg_dL
  egfr_mL_min?: number | null; // LOINC: 98979-8 (legacy 62238-1)
  alt_u_L?: number | null; // LOINC: 1742-6
  alt_U_L?: number | null; // Alias for alt_u_L
  ast_u_L?: number | null; // LOINC: 1920-8
  ast_U_L?: number | null; // Alias for ast_u_L
  ldl_mg_dL?: number | null; // LOINC: 2089-1
  hdl_mg_dL?: number | null; // LOINC: 2085-9

  // 3. Genetic & Disease-Specific Biomarkers (Intended for Symptomatic Evaluation)
  apoe_genotype?: APOEGenotype; // LOINC: 42315-2 (legacy 41762-6)
  plasma_ptau217_pg_mL?: number | null; // LOINC: 104663-0 (legacy 104352-0)
  ptau217_status?: Ptau217Status;
  abeta_42_40_ratio?: number | null; // LOINC: 106941-8 (legacy 94660-8)
  abeta_ratio_status?: AbetaRatioStatus;
  plasma_assay_manufacturer?: string; // e.g., "ALZpath", "Fujirebio Lumipulse", "C2N PrecivityAD"
  ptau_positive_cutoff?: number;
  ptau_intermediate_cutoff?: number;
  abeta_positive_cutoff?: number; // default < 0.090 indicates amyloid positivity
}

/**
 * 4-Item Brief Thai Instrumental Activities of Daily Living (IADL)
 * Used to differentiate MCI (intact IADL: 0 impaired) from Dementia (impaired IADL: >= 1)
 */
export interface BriefIADLAssessment {
  managingFinancesImpaired: boolean; // การจัดการเงิน/ทอนเงิน/ธนาคาร
  takingMedicationsImpaired: boolean; // การกินยาประจำด้วยตนเองตรงเวลา
  usingPhoneOrTransportImpaired: boolean; // การใช้โทรศัพท์หรือเดินทางไปที่คุ้นเคย
  handlingHouseholdTasksImpaired: boolean; // การทำงานบ้านหรือเตรียมอาหารง่ายๆ
  totalImpairedCount: number; // 0 - 4
  isFunctionalDeclinePresent: boolean; // totalImpairedCount >= 1
}

export interface Depression2QScreening {
  q1_depressed_mood: boolean | null;
  q2_anhedonia: boolean | null;
  depression_risk_flag: boolean;
}

/**
 * Verified Specific Medication in Anticholinergic Cognitive Burden Scale
 */
export interface ACBMedicationItem {
  id: string;
  genericName: string;
  tradeNamesTh: string;
  categoryTh: string;
  acbScore: 1 | 2 | 3;
  clinicalNoteTh: string;
}

export interface AnticholinergicBurdenAssessment {
  selectedMedicationIds: string[];
  acbTotalScore: number;
  high_acb_risk_flag: boolean;
  selectedMedications: ACBMedicationItem[];
  interpretationTh: string;
}

/**
 * Informed Consent & Governance for Speech Telemetry (Designed with PDPA principles)
 */
export interface SpeechConsentRecord {
  consentGranted: boolean;
  timestampIso: string | null;
  patientPseudonymToken: string | null;
  consentWithdrawn: boolean;
  withdrawnTimestampIso?: string | null;
}

/**
 * Speech Biomarker Telemetry (Exploratory / Research Only)
 * Transcript is kept separate or redacted in exports to protect privacy.
 */
export interface SpeechBiomarkerTelemetry {
  isExploratoryOnly: true;
  consentRecord: SpeechConsentRecord;
  pauseToSpeechRatio: number | null;
  phoneticLatencyMs: number | null;
  semanticRepetitionCount: number | null;
  spokenTranscriptRedacted?: string; // Redacted to prevent identifiable voice recordings
  isPauseElevated?: boolean;
  isLatencyProlonged?: boolean;
  isRepetitionElevated?: boolean;
  interpretationTh?: string;
}

export interface DeviceCalibrationTelemetry {
  practiceCompleted: boolean;
  practiceTapTimestampsMs: number[];
  practiceInterTapLatenciesMs: number[];
  baselineTouchLatencyMs: number;
  calibrationAllowanceMs: number;
}

export interface ClockDrawingTelemetry {
  imageDataUrl?: string;
  svgDataUrl?: string;
  strokeCount: number;
  totalDurationMs: number;
  hesitationIntervalsMs: number[];
  motorTremorDetected?: boolean;
  tremorRmsJitterPx?: number;
  tremorDirectionReversalRate?: number;
}

/**
 * Visual-Motor Task is clearly designated as Experimental Research Telemetry
 */
export interface VisualMotorTelemetry {
  isExperimentalMetric: true;
  totalCompletionTimeMs: number | null;
  calibratedNetTimeMs?: number | null;
  errorCount: number | null;
  interTapLatencyMs: number[];
  baselineTouchLatencyMs: number | null;
  calibrationAllowanceMs?: number | null;
  adjustedThresholdMs?: number;
  isTimeProlonged?: boolean;
  isErrorElevated?: boolean;
  interpretationTh: string;
}

export interface PreviousSessionSnapshot {
  session_id: string;
  assessedAtIso: string;
  ad8Score: number | null;
  delayedRecallScore: number | null;
  cdtResult: CDTResult | null;
  screeningCompositeIndex?: number;
  cognitiveAxis?: CognitiveAxisCategory;
}

export interface LongitudinalDeltaResult {
  previous_session_id: string;
  daysElapsed: number;
  deltaAd8Score: number | null;
  deltaDelayedRecallScore: number | null;
  deltaCompositeIndex: number | null;
  annualizedRateCalculated: boolean;
  annualizedRateNoteTh: string;
  trajectoryStatus:
  | "RAPID_DECLINE"
  | "PROGRESSIVE_DECLINE"
  | "STABLE"
  | "IMPROVED"
  | "INSUFFICIENT_INTERVAL"
  | "ACUTE_PRECIPITOUS_DECLINE";
  acutePrecipitousDeclineFlag: boolean;
  summaryTh: string;
}

export type AuditActionType =
  | "READ_LAB_BIOMARKERS"
  | "IMPORT_FHIR_BUNDLE"
  | "EXPORT_CLINICAL_JSON"
  | "EXPORT_FHIR_BUNDLE"
  | "PRINT_PDF_REPORT"
  | "VIEW_PII_MAPPING"
  | "SAVE_LONGITUDINAL_SESSION"
  | "OVERRIDE_CLINICAL_TRIAGE"
  | "CONFIRM_PHYSICIAN_SIGN_OFF"
  | "REVOKE_SPEECH_CONSENT";

export interface PIIIdentityRecord {
  pseudonymToken: string;
  fullName: string;
  nationalIdMasked: string;
  phoneMasked: string;
  createdAtIso: string;
}

export interface AuditLogEntry {
  logId: string;
  timestampIso: string;
  actorRole: string;
  actionType: AuditActionType;
  pseudonymToken: string;
  resourceSummary: string;
  previousHash: string;
  integrityHash: string;
}

/**
 * Clinician Decision Record & License Attestation
 */
export interface ClinicianOverrideRecord {
  isOverridden: boolean;
  overriddenCognitiveAxis?: CognitiveAxisCategory;
  clinicalRationale?: string;
  physicianLicenseNumber: string; // Validated Thai Medical Council format: "ว.XXXXX"
  clinicianName: string; // Real clinician name entered at runtime
  practitionerAttestation: boolean; // Confirmed legal practitioner attestation
  signedAtIso?: string;
}

/**
 * Clinical Assessment Input
 * Note: Core fields default to null to avoid false-negative defaults!
 */
export interface AssessmentInput {
  age: number | null;
  yearsOfEducation: number | null;
  ad8Score: number | null; // 0 - 8 (or null if skipped)
  ad8UnsureCount?: number | null; // Count of AD8 items marked UNSURE/skipped
  delayedRecallScore: number | null; // 0 - 3 (from Free Recall!)
  cdtResult: CDTResult | null; // NORMAL | ABNORMAL (or null if skipped)
  recallMode: "FREE_RECALL" | "RECOGNITION";
  cuedRecognitionScore?: number | null; // Auxiliary exploratory data only

  // Pre-test validity gate & Non-literate pathway
  preTestValidity?: PreTestValidityGate;
  fourAT?: FourATDeliriumAssessment;
  isNonLiteratePathway?: boolean;
  animalNamingCount?: number | null; // Non-literate verbal fluency (<9 if 0 yrs edu; <10 if 1-6+ yrs)
  briefIADL?: BriefIADLAssessment; // Functional assessment for MCI vs Dementia

  // Experimental Visual-Motor metric
  visualMotorTimeMs: number | null;
  visualMotorErrors: number | null;
  baselineTouchLatencyMs?: number | null;

  // Labs
  labs?: LabResults;

  // Gatekeepers & Modifiers
  depression2Q?: Depression2QScreening;
  anticholinergicBurden?: {
    selectedMedicationIds: string[];
    acbTotalScore?: number;
  };
  speechBiomarkers?: SpeechBiomarkerTelemetry;
  cdtTelemetry?: ClockDrawingTelemetry;

  // Longitudinal
  previous_session_id?: string;
  previousSession?: PreviousSessionSnapshot;
  assessedAtIso?: string;

  // Privacy & Governance
  pseudonymToken?: string;
  clinicianOverride?: ClinicianOverrideRecord;
}

/**
 * Multi-Axis Parallel Risk & Clinical Stratification Output
 */
export interface RiskOutput {
  algorithmVersion: string;
  pseudonymToken?: string;
  isComplete: boolean;
  missingDomainsTh: string[];

  // Composite Screening Index (0–100 heuristic ranking, NOT an empirical probability!)
  screeningCompositeIndex: number;

  // 4 Parallel Clinical Axes
  axes: {
    algorithmicCognitiveAxis: CognitiveAxisCategory; // Unaltered raw algorithmic performance
    cognitiveAxis: CognitiveAxisCategory; // Current effective tier (includes clinician override if applied)
    reversibleAxis: ReversibleAxisCategory[];
    biomarkerAxis: BiomarkerAxisCategory;
    affectiveAxis: AffectiveAxisCategory;
  };

  // Biomarker Specific Details
  biomarkerDetails: {
    ptau217Status: Ptau217Status;
    abetaRatioStatus: AbetaRatioStatus;
    plasmaAssayName: string;
    confirmatoryAdvisoryTh: string;
  };

  // Detailed Findings & Recommendations
  clinicalFlags: string[];
  primaryRecommendationTh: string;
  actionChecklistTh: string[];

  // Experimental Telemetry (clearly separated)
  experimentalTelemetry: {
    visualMotor: VisualMotorTelemetry;
    speechMci: SpeechBiomarkerTelemetry | null;
    motorTremorIsolated: boolean;
    nonLiterateAssessmentUsed: boolean;
  };

  longitudinalDelta?: LongitudinalDeltaResult;
  clinicianSignOff?: {
    isConfirmed: boolean;
    physicianLicenseNumber: string;
    clinicianName: string;
    attestationConfirmed: boolean;
    confirmedAtIso?: string;
  };
}
