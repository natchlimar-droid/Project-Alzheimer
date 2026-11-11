import {
  AssessmentInput,
  LabResults,
  RiskOutput,
} from "../types/clinical";
import { LOINC_DATA_MAPPING, SAMD_DISCLAIMER_TH } from "../data/clinicalContent";

/**
 * Standard LOINC Codes for Cognitive Screening, 2Q Gatekeeper & Lab Biomarkers
 */
export const CLINICAL_LOINC_CODES = {
  PHQ2_DEPRESSED_MOOD: "44255-8", // Little interest or pleasure / feeling down
  PHQ2_ANHEDONIA: "44250-9", // Little interest or pleasure in doing things
  PHQ2_SUMMARY_PANEL: "55758-7", // Patient Health Questionnaire 2 item (PHQ-2)
  AD8_TOTAL_SCORE: "71485-7", // AD8 Dementia Screening Interview Total Score
  MINICOG_TOTAL_SCORE: "72172-0", // Mini-Cog Total Score
  DELAYED_RECALL_SCORE: "72170-4", // Mini-Cog Word Recall Score
  CLOCK_DRAWING_SCORE: "72171-2", // Mini-Cog Clock Drawing Score
  TRAIL_MAKING_TIME: "72106-8", // Trail Making Test completion time
  TSH: LOINC_DATA_MAPPING.tsh_uIU_mL.loincCode, // 3016-3
  FREE_T4: LOINC_DATA_MAPPING.free_t4_ng_dL.loincCode, // 3024-7
  VITAMIN_B12: LOINC_DATA_MAPPING.vitamin_b12_pg_mL.loincCode, // 2132-9
  SODIUM: LOINC_DATA_MAPPING.sodium_mEq_L.loincCode, // 2951-2
  HBA1C: LOINC_DATA_MAPPING.hba1c_percent.loincCode, // 4548-4
  LDL: LOINC_DATA_MAPPING.ldl_mg_dL.loincCode, // 2089-1
  HDL: LOINC_DATA_MAPPING.hdl_mg_dL.loincCode, // 2085-9
  EGFR: LOINC_DATA_MAPPING.egfr_mL_min.loincCode, // 62238-1
  CREATININE: LOINC_DATA_MAPPING.creatinine_mg_dL.loincCode, // 2160-0
  APOE_GENOTYPE: LOINC_DATA_MAPPING.apoe_genotype.loincCode, // 41762-6
  PLASMA_PTAU217: LOINC_DATA_MAPPING.plasma_ptau217_pg_mL.loincCode, // 104352-0
  ABETA_42_40_RATIO: LOINC_DATA_MAPPING.abeta_42_40_ratio.loincCode, // 94660-8
  CALCIUM: LOINC_DATA_MAPPING.calcium_mg_dL.loincCode, // 17861-6
  FASTING_GLUCOSE: LOINC_DATA_MAPPING.fasting_glucose_mg_dL.loincCode, // 1558-6
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
          url: "http://example.org/fhir/StructureDefinition/years-of-education",
          valueInteger: input.yearsOfEducation,
        },
        {
          url: "http://example.org/fhir/StructureDefinition/age-years",
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

  // 3. Cognitive Observations (AD8, Mini-Cog Recall, CDT, Visual-Motor)
  if (input.ad8Score !== null) {
    entries.push(
      createNumericObservation(
        "obs-ad8-score",
        patientId,
        timestamp,
        CLINICAL_LOINC_CODES.AD8_TOTAL_SCORE,
        "AD8 Informant Dementia Screening Total Score",
        input.ad8Score,
        "{score}"
      )
    );
  }

  if (input.delayedRecallScore !== null) {
    entries.push(
      createNumericObservation(
        "obs-minicog-recall",
        patientId,
        timestamp,
        CLINICAL_LOINC_CODES.DELAYED_RECALL_SCORE,
        "Mini-Cog Delayed 3-Word Recall Score",
        input.delayedRecallScore,
        "{score}"
      )
    );
  }

  if (input.cdtResult !== null) {
    entries.push({
      fullUrl: "urn:uuid:obs-cdt-result",
      resource: {
        resourceType: "Observation",
        id: "obs-cdt-result",
        status: "final",
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: CLINICAL_LOINC_CODES.CLOCK_DRAWING_SCORE,
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

  if (input.visualMotorTimeMs !== null) {
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
              code: CLINICAL_LOINC_CODES.TRAIL_MAKING_TIME,
              display: "Modified Thai Alternating Trail Making Task (1-ก-2-ข-3-ค-4-ง)",
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
  const labs = input.labs ?? {};
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
    const meta = LOINC_DATA_MAPPING[field as string];
    if (typeof val === "number" && meta) {
      entries.push(
        createNumericObservation(
          `obs-lab-${field}`,
          patientId,
          timestamp,
          meta.loincCode,
          meta.loincName,
          val,
          meta.unit
        )
      );
    }
  }

  if (labs.apoe_genotype && labs.apoe_genotype !== "UNKNOWN") {
    const apoeMeta = LOINC_DATA_MAPPING.apoe_genotype;
    entries.push({
      fullUrl: "urn:uuid:obs-lab-apoe",
      resource: {
        resourceType: "Observation",
        id: "obs-lab-apoe",
        status: "final",
        code: {
          coding: [
            {
              system: "http://loinc.org",
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
            url: "https://med.chula.ac.th/fhir/StructureDefinition/screening-composite-index",
            valueInteger: output.screeningCompositeIndex ?? 0,
          },
          {
            url: "https://med.chula.ac.th/fhir/StructureDefinition/algorithm-version",
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
        url: "https://med.chula.ac.th/fhir/StructureDefinition/longitudinal-delta-decline",
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
  unit: string
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
            system: "http://loinc.org",
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

/**
 * Parses an HL7 FHIR R4 Bundle containing LOINC-coded Observation resources into LabResults.
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
        if (typeof valNum === "number") labs.plasma_ptau217_pg_mL = valNum;
        break;
      case CLINICAL_LOINC_CODES.ABETA_42_40_RATIO:
        if (typeof valNum === "number") labs.abeta_42_40_ratio = valNum;
        break;
      case CLINICAL_LOINC_CODES.APOE_GENOTYPE:
        if (typeof valStr === "string") {
          labs.apoe_genotype = valStr as LabResults["apoe_genotype"];
        }
        break;
    }
  }

  return labs;
}
