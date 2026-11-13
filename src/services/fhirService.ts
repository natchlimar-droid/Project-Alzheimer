import type {
  AssessmentInput,
  LabResults,
  RiskOutput,
} from "../types/clinical.ts";
import {
  FHIR_LOCAL_CODE_SYSTEM,
  LOINC_DATA_MAPPING,
  SAMD_DISCLAIMER_TH,
} from "../data/clinicalContent.ts";
import { normalizeLabResults } from "../engine/riskStratification.ts";

export const PROJECT_FHIR_BASE_URL =
  "https://natchlimar-droid.github.io/Project-Alzheimer/fhir";

/**
 * Standard LOINC & Local FHIR CodeSystem Identifiers
 * Verified against loinc.org — zero LOINC Part (LP*) codes in Observation.code
 */
export const CLINICAL_LOINC_CODES = {
  PHQ2_DEPRESSED_MOOD: "44255-8", // Feeling down, depressed, or hopeless
  PHQ2_ANHEDONIA: "44250-9", // Little interest or pleasure in doing things
  PHQ2_SUMMARY_PANEL: LOINC_DATA_MAPPING.scoreDepression2Q.loincCode, // 55758-7 (Closest match for 2Q)
  AD8_TOTAL_SCORE: LOINC_DATA_MAPPING.scoreAd8.loincCode, // 71722-3 (Total score [AD8])
  MINICOG_TOTAL_SCORE: LOINC_DATA_MAPPING.scoreMiniCogTotal.loincCode, // 72233-0 (Total score [Mini-Cog])
  BRIEF_IADL_PANEL: LOINC_DATA_MAPPING.scoreBriefIadl.loincCode, // 83180-0 (Closest match)
  TRAIL_MAKING_PROTOCOL: LOINC_DATA_MAPPING.scoreTrailMaking.loincCode, // 62778-6 (Closest match)
  DELAYED_RECALL_LOCAL: "minicog-delayed-recall-3word",
  CLOCK_DRAWING_LOCAL: "minicog-clock-drawing-1110",
  FOUR_AT_DELIRIUM_LOCAL: LOINC_DATA_MAPPING.scoreFourAtDelirium.loincCode, // delirium-4at-total
  ANIMAL_NAMING_LOCAL: LOINC_DATA_MAPPING.scoreAnimalNaming.loincCode, // semantic-fluency-animals-60s
  ACB_SCORE_LOCAL: LOINC_DATA_MAPPING.scoreAcbBurden.loincCode, // acb-total-score
  SPEECH_BIOMARKER_LOCAL: LOINC_DATA_MAPPING.scoreSpeechBiomarker.loincCode, // speech-PauseToWord-ratio
  TSH: LOINC_DATA_MAPPING.tsh_uIU_mL.loincCode, // 3016-3
  FREE_T4: LOINC_DATA_MAPPING.free_t4_ng_dL.loincCode, // 3024-7
  VITAMIN_B12: LOINC_DATA_MAPPING.vitamin_b12_pg_mL.loincCode, // 2132-9
  SODIUM: LOINC_DATA_MAPPING.sodium_mEq_L.loincCode, // 2951-2
  HBA1C: LOINC_DATA_MAPPING.hba1c_percent.loincCode, // 4548-4
  LDL: LOINC_DATA_MAPPING.ldl_mg_dL.loincCode, // 2089-1
  HDL: LOINC_DATA_MAPPING.hdl_mg_dL.loincCode, // 2085-9
  EGFR: LOINC_DATA_MAPPING.egfr_mL_min.loincCode, // 98979-8 (legacy 62238-1)
  CREATININE: LOINC_DATA_MAPPING.creatinine_mg_dL.loincCode, // 2160-0
  APOE_GENOTYPE: LOINC_DATA_MAPPING.apoe_genotype.loincCode, // 42315-2 (legacy 41762-6)
  PLASMA_PTAU217: LOINC_DATA_MAPPING.plasma_ptau217_pg_mL.loincCode, // 104663-0 (legacy 104352-0)
  ABETA_42_40_RATIO: LOINC_DATA_MAPPING.abeta_42_40_ratio.loincCode, // 106941-8 (legacy 94660-8)
  CALCIUM: LOINC_DATA_MAPPING.calcium_mg_dL.loincCode, // 17861-6
  FASTING_GLUCOSE: LOINC_DATA_MAPPING.fasting_glucose_mg_dL.loincCode, // 1558-6 (legacy 2345-7)
  HEMOGLOBIN: LOINC_DATA_MAPPING.hemoglobin_g_dL.loincCode, // 718-7
  ALT: LOINC_DATA_MAPPING.alt_u_L.loincCode, // 1742-6
  AST: LOINC_DATA_MAPPING.ast_u_L.loincCode, // 1920-8
  SERUM_FOLATE: LOINC_DATA_MAPPING.serum_folate_ng_mL.loincCode, // 2284-8
} as const;

export interface FhirBundleExportOptions {
  patientId?: string;
  patientName?: string;
  encounterId?: string;
  timestampIso?: string;
}

/**
 * Generates an HL7 FHIR R4 Collection Bundle representing the complete
 * Multimodal Cognitive Screening & Biomarker-Informed Triage encounter.
 */
export function buildFhirR4Bundle(
  input: AssessmentInput,
  output: RiskOutput,
  options: FhirBundleExportOptions = {}
): Record<string, unknown> {
  const timestamp = options.timestampIso ?? input.assessedAtIso ?? new Date().toISOString();
  const patientId = options.patientId ?? "patient-cog-screen-001";
  const patientName = options.patientName ?? "ผู้รับการประเมินคัดกรองสมอง";

  const entries: Array<Record<string, unknown>> = [];

  // 1. Patient Resource
  entries.push({
    fullUrl: `urn:uuid:${patientId}`,
    resource: {
      resourceType: "Patient",
      id: patientId,
      name: [{ text: patientName }],
      extension: [
        {
          url: `${PROJECT_FHIR_BASE_URL}/StructureDefinition/years-of-education`,
          valueInteger: input.yearsOfEducation,
        },
        {
          url: `${PROJECT_FHIR_BASE_URL}/StructureDefinition/age-years`,
          valueInteger: input.age,
        },
      ],
    },
  });

  // 2. 2Q Depression Gatekeeper Observation (LOINC 55758-7)
  const isDepressionPositive = output.axes?.affectiveAxis === "PSEUDODEMENTIA_RISK_2Q_POSITIVE";
  entries.push({
    fullUrl: "urn:uuid:obs-2q-depression-gatekeeper",
    resource: {
      resourceType: "Observation",
      id: "obs-2q-depression-gatekeeper",
      status: "final",
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: CLINICAL_LOINC_CODES.PHQ2_SUMMARY_PANEL,
            display: "2Q Depression Screening Gatekeeper (Pseudodementia Screen)",
          },
        ],
      },
      subject: { reference: `urn:uuid:${patientId}` },
      effectiveDateTime: timestamp,
      valueBoolean: isDepressionPositive,
      component: [
        {
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: CLINICAL_LOINC_CODES.PHQ2_DEPRESSED_MOOD,
                display: "Feeling down, depressed, or hopeless in last 2 weeks",
              },
            ],
          },
          valueBoolean: input.depression2Q?.q1_depressed_mood ?? false,
        },
        {
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: CLINICAL_LOINC_CODES.PHQ2_ANHEDONIA,
                display: "Little interest or pleasure in doing things in last 2 weeks",
              },
            ],
          },
          valueBoolean: input.depression2Q?.q2_anhedonia ?? false,
        },
      ],
    },
  });

  // 3. Cognitive & Geriatric Clinical Instrument Observations
  if (input.ad8Score !== null && input.ad8Score !== undefined) {
    entries.push(
      createNumericObservation(
        "obs-ad8-score",
        patientId,
        timestamp,
        CLINICAL_LOINC_CODES.AD8_TOTAL_SCORE,
        "Total score [AD8]",
        input.ad8Score,
        "{score}",
        "http://loinc.org"
      )
    );
  }

  if (input.delayedRecallScore !== null && input.delayedRecallScore !== undefined) {
    entries.push(
      createNumericObservation(
        "obs-minicog-recall",
        patientId,
        timestamp,
        CLINICAL_LOINC_CODES.DELAYED_RECALL_LOCAL,
        "Mini-Cog Delayed 3-Word Free Recall Score",
        input.delayedRecallScore,
        "{score}",
        FHIR_LOCAL_CODE_SYSTEM
      )
    );
  }

  if (input.cdtResult !== null && input.cdtResult !== undefined) {
    entries.push({
      fullUrl: "urn:uuid:obs-cdt-result",
      resource: {
        resourceType: "Observation",
        id: "obs-cdt-result",
        status: "final",
        code: {
          coding: [
            {
              system: FHIR_LOCAL_CODE_SYSTEM,
              code: CLINICAL_LOINC_CODES.CLOCK_DRAWING_LOCAL,
              display: "Clock Drawing Test (11:10) Result",
            },
          ],
        },
        subject: { reference: `urn:uuid:${patientId}` },
        effectiveDateTime: timestamp,
        valueString: input.cdtResult,
        component: input.cdtTelemetry
          ? [
            {
              code: { text: "strokeCount" },
              valueInteger: input.cdtTelemetry.strokeCount,
            },
            {
              code: { text: "totalDurationMs" },
              valueInteger: input.cdtTelemetry.totalDurationMs,
            },
          ]
          : [],
      },
    });
  }

  if (
    input.delayedRecallScore !== null &&
    input.delayedRecallScore !== undefined &&
    input.cdtResult !== null &&
    input.cdtResult !== undefined
  ) {
    const miniCogTotal =
      Math.max(0, Math.min(3, Math.round(input.delayedRecallScore))) +
      (input.cdtResult === "NORMAL" ? 2 : 0);
    entries.push(
      createNumericObservation(
        "obs-minicog-total",
        patientId,
        timestamp,
        CLINICAL_LOINC_CODES.MINICOG_TOTAL_SCORE,
        "Total score [Mini-Cog]",
        miniCogTotal,
        "{score}",
        "http://loinc.org"
      )
    );
  }

  if (input.briefIADL) {
    entries.push(
      createNumericObservation(
        "obs-brief-iadl",
        patientId,
        timestamp,
        CLINICAL_LOINC_CODES.BRIEF_IADL_PANEL,
        "Self-care activities - functional ability panel (Brief 4-Item Thai IADL Impaired Count)",
        input.briefIADL.totalImpairedCount,
        "{score}",
        "http://loinc.org"
      )
    );
  }

  if (input.fourAT) {
    entries.push(
      createNumericObservation(
        "obs-four-at-delirium",
        patientId,
        timestamp,
        CLINICAL_LOINC_CODES.FOUR_AT_DELIRIUM_LOCAL,
        "4AT Rapid Clinical Test for Delirium Total Score",
        input.fourAT.totalScore,
        "{score}",
        FHIR_LOCAL_CODE_SYSTEM
      )
    );
  }

  if (input.animalNamingCount !== null && input.animalNamingCount !== undefined) {
    entries.push(
      createNumericObservation(
        "obs-animal-naming-60s",
        patientId,
        timestamp,
        CLINICAL_LOINC_CODES.ANIMAL_NAMING_LOCAL,
        "Category Verbal Fluency - Animals Named in 60 Seconds",
        input.animalNamingCount,
        "{count}/min",
        FHIR_LOCAL_CODE_SYSTEM
      )
    );
  }

  if (typeof input.anticholinergicBurden?.acbTotalScore === "number") {
    entries.push(
      createNumericObservation(
        "obs-acb-burden",
        patientId,
        timestamp,
        CLINICAL_LOINC_CODES.ACB_SCORE_LOCAL,
        "Anticholinergic Cognitive Burden (ACB) Total Score",
        input.anticholinergicBurden.acbTotalScore,
        "{score}",
        FHIR_LOCAL_CODE_SYSTEM
      )
    );
  }

  if (typeof input.speechBiomarkers?.pauseToSpeechRatio === "number") {
    entries.push(
      createNumericObservation(
        "obs-speech-biomarker",
        patientId,
        timestamp,
        CLINICAL_LOINC_CODES.SPEECH_BIOMARKER_LOCAL,
        "Acoustic Speech Biomarker - Pause-to-Speech Ratio",
        input.speechBiomarkers.pauseToSpeechRatio,
        "{ratio}",
        FHIR_LOCAL_CODE_SYSTEM
      )
    );
  }

  if (input.visualMotorTimeMs !== null && input.visualMotorTimeMs !== undefined) {
    entries.push({
      fullUrl: "urn:uuid:obs-visual-motor-trail",
      resource: {
        resourceType: "Observation",
        id: "obs-visual-motor-trail",
        status: "final",
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: CLINICAL_LOINC_CODES.TRAIL_MAKING_PROTOCOL,
              display: "PhenX - trail making test protocol (Thai 8-Node Alternating Trail)",
            },
          ],
        },
        subject: { reference: `urn:uuid:${patientId}` },
        effectiveDateTime: timestamp,
        valueQuantity: {
          value: input.visualMotorTimeMs,
          unit: "ms",
          system: "http://unitsofmeasure.org",
          code: "ms",
        },
        component: [
          {
            code: { text: "errorCount" },
            valueInteger: input.visualMotorErrors ?? 0,
          },
          {
            code: { text: "baselineTouchLatencyMs" },
            valueInteger: input.baselineTouchLatencyMs ?? 0,
          },
          {
            code: { text: "calibratedNetTimeMs" },
            valueInteger: output.experimentalTelemetry?.visualMotor?.calibratedNetTimeMs ?? input.visualMotorTimeMs,
          },
        ],
      },
    });
  }

  // 4. Laboratory Biomarker Observations Mapped to LOINC Codes
  const labs = normalizeLabResults(input.labs);
  const numericLabFields: Array<keyof LabResults> = [
    "tsh_uIU_mL",
    "free_t4_ng_dL",
    "vitamin_b12_pg_mL",
    "serum_folate_ng_mL",
    "sodium_mEq_L",
    "calcium_mg_dL",
    "fasting_glucose_mg_dL",
    "hba1c_percent",
    "ldl_mg_dL",
    "hdl_mg_dL",
    "egfr_mL_min",
    "creatinine_mg_dL",
    "hemoglobin_g_dL",
    "alt_u_L",
    "ast_u_L",
    "plasma_ptau217_pg_mL",
    "abeta_42_40_ratio",
  ];

  for (const field of numericLabFields) {
    const val = labs[field];
    const meta = Object.values(LOINC_DATA_MAPPING).find((m) => m.fieldKey === field);
    if (typeof val === "number" && meta) {
      entries.push(
        createNumericObservation(
          `obs-lab-${field}`,
          patientId,
          timestamp,
          meta.loincCode,
          meta.loincName,
          val,
          meta.unit,
          meta.codeSystem
        )
      );
    }
  }

  if (labs.apoe_genotype && labs.apoe_genotype !== "UNKNOWN") {
    const apoeMeta = LOINC_DATA_MAPPING.labApoe;
    entries.push({
      fullUrl: "urn:uuid:obs-lab-apoe",
      resource: {
        resourceType: "Observation",
        id: "obs-lab-apoe",
        status: "final",
        code: {
          coding: [
            {
              system: apoeMeta.codeSystem,
              code: apoeMeta.loincCode,
              display: apoeMeta.loincName,
            },
          ],
        },
        subject: { reference: `urn:uuid:${patientId}` },
        effectiveDateTime: timestamp,
        valueString: labs.apoe_genotype,
      },
    });
  }

  // 5. RiskAssessment Resource with Parallel Multi-Axes & Screening Composite Index
  const riskOutcomeText = output.axes
    ? `Algorithmic Axis 1: ${output.axes.algorithmicCognitiveAxis} | Final Axis 1: ${output.axes.cognitiveAxis} | Axis 2 (Reversible): ${output.axes.reversibleAxis.join(", ")} | Axis 3 (Biomarker): ${output.axes.biomarkerAxis} | Axis 4 (Affective): ${output.axes.affectiveAxis}`
    : "Unstratified Assessment";

  const riskAssessmentResource: Record<string, unknown> = {
    resourceType: "RiskAssessment",
    id: "risk-assessment-cognitive-triage",
    status: "final",
    subject: { reference: `urn:uuid:${patientId}` },
    occurrenceDateTime: timestamp,
    prediction: [
      {
        outcome: {
          text: riskOutcomeText,
        },
        // We export screeningCompositeIndex as an internal integer score, strictly avoiding probabilityDecimal
        extension: [
          {
            url: `${PROJECT_FHIR_BASE_URL}/StructureDefinition/screening-composite-index`,
            valueInteger: output.screeningCompositeIndex ?? 0,
          },
          {
            url: `${PROJECT_FHIR_BASE_URL}/StructureDefinition/algorithm-version`,
            valueString: output.algorithmVersion,
          },
        ],
        rationale: output.primaryRecommendationTh || "Complete assessment recommended",
      },
    ],
    mitigation: output.primaryRecommendationTh || "",
    note: [
      ...output.clinicalFlags.map((f) => ({ text: f })),
      { text: `Biomarker Advisory: ${output.biomarkerDetails?.confirmatoryAdvisoryTh || ""}` },
      { text: `SaMD Disclaimer: ${SAMD_DISCLAIMER_TH}` },
    ],
  };

  if (output.clinicianSignOff?.isConfirmed && output.clinicianSignOff.physicianLicenseNumber) {
    riskAssessmentResource.performer = {
      identifier: {
        system: "https://medcouncil.or.th/physician-license",
        value: output.clinicianSignOff.physicianLicenseNumber,
      },
      display: `Confirmed by licensed clinician ${output.clinicianSignOff.clinicianName || ""} (${output.clinicianSignOff.physicianLicenseNumber}) at ${output.clinicianSignOff.confirmedAtIso}`,
    };
  }

  if (output.longitudinalDelta?.previous_session_id) {
    riskAssessmentResource.basis = [
      {
        identifier: {
          system: "urn:ietf:rfc:3986",
          value: output.longitudinalDelta.previous_session_id,
        },
        display: `Previous Cognitive Screening Session (${output.longitudinalDelta.previous_session_id})`,
      },
    ];
  }

  if (output.longitudinalDelta) {
    riskAssessmentResource.extension = [
      {
        url: `${PROJECT_FHIR_BASE_URL}/StructureDefinition/longitudinal-delta-decline`,
        extension: [
          {
            url: "previous_session_id",
            valueString: output.longitudinalDelta.previous_session_id,
          },
          {
            url: "daysElapsed",
            valueInteger: output.longitudinalDelta.daysElapsed,
          },
          {
            url: "deltaCompositeIndex",
            valueInteger: output.longitudinalDelta.deltaCompositeIndex ?? 0,
          },
          {
            url: "annualizedRateCalculated",
            valueBoolean: output.longitudinalDelta.annualizedRateCalculated,
          },
          {
            url: "trajectoryStatus",
            valueString: output.longitudinalDelta.trajectoryStatus,
          },
          {
            url: "acutePrecipitousDeclineFlag",
            valueBoolean: output.longitudinalDelta.acutePrecipitousDeclineFlag,
          },
        ],
      },
    ];
  }

  entries.push({
    fullUrl: "urn:uuid:risk-assessment-cognitive-triage",
    resource: riskAssessmentResource,
  });

  return {
    resourceType: "Bundle",
    id: `bundle-cognitive-screening-${Date.now()}`,
    type: "collection",
    timestamp,
    entry: entries,
  };
}

function createNumericObservation(
  id: string,
  patientId: string,
  timestamp: string,
  loincCode: string,
  display: string,
  value: number,
  unit: string,
  codeSystem: string = "http://loinc.org"
): Record<string, unknown> {
  return {
    fullUrl: `urn:uuid:${id}`,
    resource: {
      resourceType: "Observation",
      id,
      status: "final",
      code: {
        coding: [
          {
            system: codeSystem,
            code: loincCode,
            display,
          },
        ],
      },
      subject: { reference: `urn:uuid:${patientId}` },
      effectiveDateTime: timestamp,
      valueQuantity: {
        value,
        unit,
        system: "http://unitsofmeasure.org",
        code: unit,
      },
    },
  };
}

export function exportFhirJsonString(
  input: AssessmentInput,
  output: RiskOutput,
  options: FhirBundleExportOptions = {}
): string {
  return JSON.stringify(buildFhirR4Bundle(input, output, options), null, 2);
}

/**
 * Parses an HL7 FHIR R4 Bundle containing LOINC-coded Observation resources into LabResults.
 * Supports both audited official LOINC codes and legacy aliases for backward-compatible ingestion.
 */
export function parseFhirBundleToLabResults(
  bundle: Record<string, any>
): LabResults {
  const labs: LabResults = {};
  if (!bundle || !Array.isArray(bundle.entry)) return labs;

  for (const item of bundle.entry) {
    const res = item?.resource;
    if (!res || res.resourceType !== "Observation") continue;

    const coding = res.code?.coding?.[0]?.code;
    const valNum = res.valueQuantity?.value;
    const valStr = res.valueString;

    switch (coding) {
      case CLINICAL_LOINC_CODES.TSH:
        if (typeof valNum === "number") labs.tsh_uIU_mL = valNum;
        break;
      case CLINICAL_LOINC_CODES.FREE_T4:
        if (typeof valNum === "number") labs.free_t4_ng_dL = valNum;
        break;
      case CLINICAL_LOINC_CODES.VITAMIN_B12:
        if (typeof valNum === "number") labs.vitamin_b12_pg_mL = valNum;
        break;
      case CLINICAL_LOINC_CODES.SERUM_FOLATE:
        if (typeof valNum === "number") labs.serum_folate_ng_mL = valNum;
        break;
      case CLINICAL_LOINC_CODES.SODIUM:
        if (typeof valNum === "number") labs.sodium_mEq_L = valNum;
        break;
      case CLINICAL_LOINC_CODES.CALCIUM:
        if (typeof valNum === "number") labs.calcium_mg_dL = valNum;
        break;
      case CLINICAL_LOINC_CODES.FASTING_GLUCOSE:
      case "2345-7":
        if (typeof valNum === "number") labs.fasting_glucose_mg_dL = valNum;
        break;
      case CLINICAL_LOINC_CODES.HBA1C:
        if (typeof valNum === "number") labs.hba1c_percent = valNum;
        break;
      case CLINICAL_LOINC_CODES.HEMOGLOBIN:
        if (typeof valNum === "number") labs.hemoglobin_g_dL = valNum;
        break;
      case CLINICAL_LOINC_CODES.CREATININE:
        if (typeof valNum === "number") labs.creatinine_mg_dL = valNum;
        break;
      case CLINICAL_LOINC_CODES.EGFR:
      case "62238-1":
        if (typeof valNum === "number") labs.egfr_mL_min = valNum;
        break;
      case CLINICAL_LOINC_CODES.ALT:
        if (typeof valNum === "number") labs.alt_u_L = valNum;
        break;
      case CLINICAL_LOINC_CODES.AST:
        if (typeof valNum === "number") labs.ast_u_L = valNum;
        break;
      case CLINICAL_LOINC_CODES.LDL:
        if (typeof valNum === "number") labs.ldl_mg_dL = valNum;
        break;
      case CLINICAL_LOINC_CODES.HDL:
        if (typeof valNum === "number") labs.hdl_mg_dL = valNum;
        break;
      case CLINICAL_LOINC_CODES.PLASMA_PTAU217:
      case "104352-0":
        if (typeof valNum === "number") labs.plasma_ptau217_pg_mL = valNum;
        break;
      case CLINICAL_LOINC_CODES.ABETA_42_40_RATIO:
      case "94660-8":
        if (typeof valNum === "number") labs.abeta_42_40_ratio = valNum;
        break;
      case CLINICAL_LOINC_CODES.APOE_GENOTYPE:
      case "41762-6":
        if (typeof valStr === "string") {
          labs.apoe_genotype = valStr as LabResults["apoe_genotype"];
        }
        break;
    }
  }

  return labs;
}

/**
 * Validates an HL7 FHIR R4 Collection Bundle against structural invariants and terminology rules:
 * - Bundle.resourceType === "Bundle" and Bundle.type === "collection"
 * - Every entry has valid urn:uuid fullUrl and matching resource.id
 * - Internal references resolve cleanly within the Bundle
 * - Observations have status, coding (system/code/display), and ZERO LOINC Part (LP*) codes
 * - valueQuantity sets UCUM system and unit
 * - RiskAssessment strictly avoids probabilityDecimal
 */
export function validateFhirR4Bundle(bundle: Record<string, any>): {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    entryCount: number;
    observationCount: number;
    loincCount: number;
    localCodeCount: number;
    partCodeViolations: number;
  };
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  let observationCount = 0;
  let loincCount = 0;
  let localCodeCount = 0;
  let partCodeViolations = 0;

  if (!bundle || bundle.resourceType !== "Bundle") {
    errors.push("Root resourceType must be 'Bundle'.");
  }
  if (bundle?.type !== "collection") {
    errors.push("Bundle.type must be 'collection'.");
  }
  if (!Array.isArray(bundle?.entry) || bundle.entry.length === 0) {
    errors.push("Bundle.entry must be a non-empty array.");
    return {
      valid: false,
      errors,
      warnings,
      summary: { entryCount: 0, observationCount, loincCount, localCodeCount, partCodeViolations },
    };
  }

  const fullUrlSet = new Set<string>();
  for (const item of bundle.entry) {
    if (typeof item?.fullUrl !== "string" || !item.fullUrl.startsWith("urn:uuid:")) {
      errors.push(`Entry missing valid urn:uuid fullUrl: ${JSON.stringify(item?.resource?.id)}`);
    } else {
      fullUrlSet.add(item.fullUrl);
    }
    const res = item?.resource;
    if (!res || typeof res.resourceType !== "string") {
      errors.push(`Entry ${item?.fullUrl ?? "unknown"} missing resource.resourceType.`);
      continue;
    }
    if (res.id && item.fullUrl !== `urn:uuid:${res.id}`) {
      warnings.push(`Entry fullUrl (${item.fullUrl}) does not match resource.id (${res.id}).`);
    }
  }

  for (const item of bundle.entry) {
    const res = item?.resource;
    if (!res) continue;

    if (res.subject?.reference && !fullUrlSet.has(res.subject.reference)) {
      errors.push(`Resource ${res.id} has unresolved subject.reference: ${res.subject.reference}`);
    }

    if (res.resourceType === "Observation") {
      observationCount++;
      if (!res.status) errors.push(`Observation ${res.id} missing status.`);
      const codings = res.code?.coding;
      if (!Array.isArray(codings) || codings.length === 0) {
        errors.push(`Observation ${res.id} missing code.coding.`);
      } else {
        for (const c of codings) {
          if (!c.system || !c.code || !c.display) {
            errors.push(`Observation ${res.id} coding incomplete (requires system, code, display).`);
          }
          if (typeof c.code === "string" && /^LP\d+-\d+$/i.test(c.code)) {
            partCodeViolations++;
            errors.push(`Observation ${res.id} uses LOINC Part code '${c.code}' in Observation.code (invalid in FHIR R4).`);
          }
          if (c.system === "http://loinc.org") loincCount++;
          else if (c.system === FHIR_LOCAL_CODE_SYSTEM) localCodeCount++;
        }
      }
      if (res.valueQuantity) {
        if (typeof res.valueQuantity.value !== "number") {
          errors.push(`Observation ${res.id} valueQuantity.value is not a number.`);
        }
        if (res.valueQuantity.system !== "http://unitsofmeasure.org" || !res.valueQuantity.code) {
          errors.push(`Observation ${res.id} valueQuantity must include UCUM system and code.`);
        }
      }
    }

    if (res.resourceType === "RiskAssessment") {
      if (Array.isArray(res.prediction)) {
        for (const pred of res.prediction) {
          if ("probabilityDecimal" in pred) {
            errors.push("RiskAssessment.prediction must NOT export probabilityDecimal for heuristic index.");
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      entryCount: bundle.entry.length,
      observationCount,
      loincCount,
      localCodeCount,
      partCodeViolations,
    },
  };
}
