import { ACB_MEDICATIONS } from "../data/clinicalContent";
import {
  ALGORITHM_VERSION,
  AssessmentInput,
  AbetaRatioStatus,
  BiomarkerAxisCategory,
  BriefIADLAssessment,
  CDTResult,
  CognitiveAxisCategory,
  FourATDeliriumAssessment,
  LabResults,
  LongitudinalDeltaResult,
  PreTestValidityGate,
  PreviousSessionSnapshot,
  Ptau217Status,
  ReversibleAxisCategory,
  RiskOutput,
  SpeechBiomarkerTelemetry,
  VisualMotorTelemetry,
} from "../types/clinical";

/**
 * Validated Clinical Threshold Constants
 */
export const CLINICAL_THRESHOLDS = {
  AD8_CUTOFF: 2,
  MINICOG_PASS_CUTOFF: 3, // Borson: Score < 3 indicates cognitive impairment
  ACB_HIGH_BURDEN_CUTOFF: 3, // ACB Total Score >= 3 indicates high drug-induced cognitive risk

  // Thyroid Reference Ranges
  TSH_NORMAL_LOW: 0.35,
  TSH_NORMAL_HIGH: 4.5,
  TSH_SUBCLINICAL_MAX: 10.0,
  FREE_T4_NORMAL_LOW: 0.8,
  FREE_T4_NORMAL_HIGH: 1.8,

  // Vitamin B12 Reference Ranges
  B12_DEFICIENT: 200,
  B12_BORDERLINE_LOW: 200,
  B12_BORDERLINE_HIGH: 300,

  // Folate Reference Ranges
  FOLATE_DEFICIENT: 3.0,
  FOLATE_BORDERLINE_HIGH: 4.0,

  // Serum Sodium Reference Ranges
  SODIUM_SEVERE_LOW: 130,
  SODIUM_MILD_LOW: 135,
  SODIUM_HIGH: 145,

  // Calcium
  CALCIUM_LOW: 8.5,
  CALCIUM_HIGH: 10.5,

  // Glucose & HbA1c
  GLUCOSE_SEVERE_LOW: 54,
  GLUCOSE_LOW: 70,
  GLUCOSE_SEVERE_HIGH: 300,
  HBA1C_POOR_CONTROL: 9.0,

  // Hemoglobin (Anemia)
  HEMOGLOBIN_SEVERE_ANEMIA: 8.0,
  HEMOGLOBIN_MILD_ANEMIA: 11.0,

  // Renal (Creatinine & eGFR)
  CREATININE_SEVERE: 3.0,
  CREATININE_MODERATE: 2.0,
  EGFR_SEVERE_RENAL: 15,
  EGFR_MODERATE_RENAL: 30,
  EGFR_RENAL_IMPAIRMENT: 60,

  // Hepatic (Transaminases ALT / AST)
  ALT_SEVERE: 250,
  ALT_IMPAIRMENT: 120,
  AST_SEVERE: 250,
  AST_IMPAIRMENT: 120,

  // Amyloid Beta 42/40 Cutoff
  ABETA_42_40_RATIO_CUTOFF: 0.090,

  // Non-literate verbal fluency animal naming
  ANIMAL_NAMING_IMPAIRED: 10,

  // Speech Exploratory Thresholds
  SPEECH_PAUSE_RATIO_EXPLORATORY: 0.45,
  SPEECH_PHONETIC_LATENCY_MS_EXPLORATORY: 2200,
  SPEECH_SEMANTIC_REPETITION_EXPLORATORY: 2,

  // Experimental Visual Motor Thresholds
  TMT_BASE_MS: 45000,
  TMT_LOW_EDU_MS: 12000,
  TMT_AGE_75_MS: 10000,
} as const;

/**
 * Pre-Test Validity Gatekeeper Evaluation
 * Supports 4AT Delirium screening and Non-Literate alternative pathway
 */
export function evaluatePreTestValidity(
  gate?: PreTestValidityGate
): {
  validityPassed: boolean;
  exclusionReasonsTh: string[];
} {
  if (!gate) {
    return {
      validityPassed: true,
      exclusionReasonsTh: [],
    };
  }

  const reasons: string[] = [];

  // Delirium Check (4AT Score >= 4 or clinician flag)
  const isDelirium = gate.deliriumSuspected || (gate.fourAT && gate.fourAT.isDeliriumSuspected);
  if (isDelirium) {
    const scoreText = gate.fourAT ? ` (คะแนน 4AT = ${gate.fourAT.totalScore}/12 >= 4)` : "";
    reasons.push(`สงสัยภาวะเพ้อเฉียบพลัน${scoreText} (Active Delirium) — ต้องประเมินและรักษาสาเหตุเฉียบพลันก่อนทดสอบการรู้คิด`);
  }

  if (gate.severeVisualImpairment) {
    reasons.push("มีอุปสรรคทางสายตารุนแรง (มองไม่เห็นหน้าปัด/ตัวเลขแม้สวมแว่นตา) — แปลผลไม่ได้");
  }
  if (gate.severeHearingImpairment) {
    reasons.push("มีอุปสรรคทางการได้ยินรุนแรง (ไม่ได้ยินคำศัพท์ 3 คำแม้ใช้เครื่องช่วยฟัง) — อาจเกิดผลลบลวง");
  }
  if (gate.acuteSedativeOrIntoxication) {
    reasons.push("ได้รับยานอนหลับ ยากล่อมประสาท หรือสารกดประสาทภายใน 12 ชั่วโมง — ส่งผลให้คิดช้าชั่วคราว");
  }
  if (gate.acuteSeverePainOrMedicalIllness) {
    reasons.push("มีอาการเจ็บปวดรุนแรงหรือเจ็บป่วยทางกายเฉียบพลัน (เช่น ไข้สูง หอบเหนื่อย) — รบกวนสมาธิอย่างรุนแรง");
  }

  const validityPassed = reasons.length === 0;
  return {
    validityPassed,
    exclusionReasonsTh: reasons,
  };
}

/**
 * Mini-Cog Standard Evaluation (Strict Borson et al. Rules & Free Recall Priority)
 * - Recall 0: Impaired (Score 0-2)
 * - Recall 1-2 + Abnormal CDT: Impaired (Score 1-2)
 * - Recall 1-2 + Normal CDT: Standard Pass / Unimpaired (Score 3-4), with clinical watchful note
 * - Recall 3: Pass (Score 3-5)
 */
export function evaluateMiniCog(
  delayedRecallScore: number | null,
  cdtResult: CDTResult | null,
  cuedRecognitionScore?: number | null
): {
  totalScore: number | null;
  isPositive: boolean | null;
  delayedRecallScore: number | null;
  cdtResult: CDTResult | null;
  cuedRecognitionScore?: number | null;
  interpretationTh: string;
} {
  if (delayedRecallScore === null || cdtResult === null) {
    return {
      totalScore: null,
      isPositive: null,
      delayedRecallScore,
      cdtResult,
      cuedRecognitionScore,
      interpretationTh: "แบบประเมิน Mini-Cog ไม่สมบูรณ์ (ขาดผล Delayed Recall หรือ Clock Drawing)",
    };
  }

  const clampedRecall = Math.max(0, Math.min(3, Math.round(delayedRecallScore)));
  const cdtPoints = cdtResult === "NORMAL" ? 2 : 0;
  const totalScore = clampedRecall + cdtPoints;

  // Borson et al. validated diagnostic logic:
  // Score < 3 indicates screen-positive for cognitive impairment concern
  const isPositive = totalScore < CLINICAL_THRESHOLDS.MINICOG_PASS_CUTOFF;

  let interpretationTh = "";
  if (clampedRecall === 0) {
    interpretationTh = `ความจำระยะสั้นบกพร่องชัดเจน (Free Recall = 0/3 คำ, คะแนนรวม ${totalScore}/5) เข้าเกณฑ์ผลบวก (Screen-Positive)`;
  } else if (clampedRecall < 3 && cdtResult === "ABNORMAL") {
    interpretationTh = `จำคำศัพท์ได้บางส่วน (${clampedRecall}/3) ร่วมกับวาดนาฬิกาผิดปกติ (คะแนนรวม ${totalScore}/5 < 3) เข้าเกณฑ์ผลบวก (Screen-Positive)`;
  } else if (clampedRecall < 3 && cdtResult === "NORMAL") {
    interpretationTh = `จำคำศัพท์ได้บางส่วน (${clampedRecall}/3) แต่วาดนาฬิกาถูกต้อง (คะแนนรวม ${totalScore}/5 >= 3) ตามเกณฑ์มาตรฐาน Mini-Cog ถือว่าผ่านเกณฑ์เบื้องต้น (Screen-Negative) แต่แนะนำเฝ้าระวังความจำ`;
  } else if (clampedRecall === 3 && cdtResult === "ABNORMAL") {
    interpretationTh = "ความจำคำศัพท์สมบูรณ์ (3/3) แต่วาดนาฬิกาผิดปกติ (คะแนนรวม 3/5) บ่งชี้ความบกพร่องด้าน Visuospatial / Executive Function";
  } else {
    interpretationTh = "ผลการประเมิน Mini-Cog อยู่ในเกณฑ์ปกติสมบูรณ์ (5/5 คะแนน, Screen-Negative)";
  }

  if (cuedRecognitionScore !== undefined && cuedRecognitionScore !== null) {
    if (cuedRecognitionScore > clampedRecall) {
      interpretationTh += ` [ข้อมูลเสริม: ทำ Recognition ได้ ${cuedRecognitionScore}/3 คำ ดีกว่า Free Recall บ่งชี้ปัญหา Retrieval Deficit มากกว่า Storage Deficit]`;
    }
  }

  return {
    totalScore,
    isPositive,
    delayedRecallScore: clampedRecall,
    cdtResult,
    cuedRecognitionScore,
    interpretationTh,
  };
}

/**
 * Anticholinergic Cognitive Burden Evaluation (Specific Drug API List)
 */
export function evaluateAnticholinergicBurden(
  selectedMedicationIds: string[] = []
): {
  acbTotalScore: number;
  high_acb_risk_flag: boolean;
  selectedMedications: typeof ACB_MEDICATIONS;
  matchedNamesTh: string[];
  interpretationTh: string;
} {
  const matched = ACB_MEDICATIONS.filter((m) =>
    selectedMedicationIds.includes(m.id)
  );
  const acbTotalScore = matched.reduce((sum, m) => sum + m.acbScore, 0);
  const high_acb_risk_flag =
    acbTotalScore >= CLINICAL_THRESHOLDS.ACB_HIGH_BURDEN_CUTOFF;
  const matchedNamesTh = matched.map((m) => `${m.genericName} [ACB=${m.acbScore}]`);

  let interpretationTh = "";
  if (high_acb_risk_flag) {
    interpretationTh = `พบภาระยาต้านโคลิเนอร์จิกสูง (ACB Total Score = ${acbTotalScore} >= 3 จาก: ${matchedNamesTh.join(", ")}) เสี่ยงสูงต่อภาวะสมองตื้อ-ความจำเสื่อมจากยา (Drug-Induced Cognitive Impairment) แพทย์และเภสัชกรควรทบทวนและปรับลดยา (Deprescribing) ก่อนวินิจฉัยโรคสมองเสื่อม`;
  } else if (acbTotalScore > 0) {
    interpretationTh = `พบการใช้ยาที่มีฤทธิ์ Anticholinergic ระดับน้อย-ปานกลาง (ACB Total Score = ${acbTotalScore} จาก: ${matchedNamesTh.join(", ")}) ควรเฝ้าระวังอาการสับสนหรือง่วงซึมในผู้สูงอายุ`;
  } else {
    interpretationTh = "ไม่พบการใช้ยากลุ่มเสี่ยงที่มีฤทธิ์ต้านโคลิเนอร์จิก (ACB Total Score = 0)";
  }

  return {
    acbTotalScore,
    high_acb_risk_flag,
    selectedMedications: matched,
    matchedNamesTh,
    interpretationTh,
  };
}

/**
 * Visual-Motor Task Evaluation (Explicitly Designated as Experimental Research Telemetry)
 */
export function evaluateVisualMotorTaskExperimental(
  timeMs: number | null,
  errors: number | null,
  age: number | null,
  edu: number | null,
  baselineTouchMs?: number | null
): VisualMotorTelemetry {
  if (timeMs === null || errors === null) {
    return {
      isExperimentalMetric: true,
      totalCompletionTimeMs: null,
      calibratedNetTimeMs: null,
      errorCount: null,
      interTapLatencyMs: [],
      baselineTouchLatencyMs: baselineTouchMs ?? null,
      interpretationTh: "แบบทดสอบ Visual-Motor ไม่สมบูรณ์ (ไม่ได้บันทึกเวลาหรือข้อผิดพลาด)",
    };
  }

  let adjustedThresholdMs = CLINICAL_THRESHOLDS.TMT_BASE_MS;
  if ((edu ?? 12) < 6) adjustedThresholdMs += CLINICAL_THRESHOLDS.TMT_LOW_EDU_MS;
  if ((age ?? 70) >= 75) adjustedThresholdMs += CLINICAL_THRESHOLDS.TMT_AGE_75_MS;

  const baseline = baselineTouchMs ?? 0;
  let calibrationAllowanceMs = 0;
  if (baseline > 1500) {
    calibrationAllowanceMs = Math.min(18000, Math.round((baseline - 1500) * 7 * 0.65));
  }
  const calibratedNetTimeMs = Math.max(1000, timeMs - calibrationAllowanceMs);

  const isTimeProlonged = calibratedNetTimeMs > adjustedThresholdMs;
  const isErrorElevated = errors >= 2;

  const seconds = (timeMs / 1000).toFixed(1);
  const cutoffSec = (adjustedThresholdMs / 1000).toFixed(0);

  let interpretationTh = `[เมทริกซ์เชิงสำรวจ / Experimental Marker]: ใช้เวลา ${seconds} วินาที (เกณฑ์ทดลอง ${cutoffSec}s), ผิดพลาด ${errors} ครั้ง`;
  if (isTimeProlonged && isErrorElevated) {
    interpretationTh += " — เข้าเกณฑ์สงสัย Executive Dysfunction เบื้องต้น (แนะนำให้ตรวจยืนยันด้วยแบบทดสอบมาตรฐาน เช่น TMSE / MoCA)";
  } else if (isTimeProlonged) {
    interpretationTh += " — ใช้เวลานานกว่าเกณฑ์ทดลอง (อาจสัมพันธ์กับความเร็วการประมวลผลหรือความไม่คุ้นเคยอุปกรณ์)";
  } else if (isErrorElevated) {
    interpretationTh += " — พบข้อผิดพลาดในการสลับลำดับ";
  } else {
    interpretationTh += " — อยู่ในเกณฑ์ทดลองปกติ";
  }

  return {
    isExperimentalMetric: true,
    totalCompletionTimeMs: timeMs,
    calibratedNetTimeMs,
    errorCount: errors,
    interTapLatencyMs: [],
    baselineTouchLatencyMs: baselineTouchMs ?? null,
    calibrationAllowanceMs,
    adjustedThresholdMs,
    isTimeProlonged,
    isErrorElevated,
    interpretationTh,
  };
}

/**
 * Speech Biomarker Telemetry Evaluation (Exploratory / Research Only)
 */
export function evaluateSpeechBiomarkers(
  speech?: SpeechBiomarkerTelemetry
): SpeechBiomarkerTelemetry | null {
  if (!speech || speech.pauseToSpeechRatio === null || speech.phoneticLatencyMs === null) {
    return null;
  }

  const pauseToSpeechRatio = Number(speech.pauseToSpeechRatio.toFixed(2));
  const phoneticLatencyMs = Math.round(speech.phoneticLatencyMs);
  const semanticRepetitionCount = speech.semanticRepetitionCount ? Math.round(speech.semanticRepetitionCount) : 0;

  const isPauseElevated = pauseToSpeechRatio > CLINICAL_THRESHOLDS.SPEECH_PAUSE_RATIO_EXPLORATORY;
  const isLatencyProlonged = phoneticLatencyMs > CLINICAL_THRESHOLDS.SPEECH_PHONETIC_LATENCY_MS_EXPLORATORY;
  const isRepetitionElevated = semanticRepetitionCount >= CLINICAL_THRESHOLDS.SPEECH_SEMANTIC_REPETITION_EXPLORATORY;

  const findings: string[] = [];
  if (isPauseElevated) findings.push(`Pause Ratio สูง (${pauseToSpeechRatio} > 0.45)`);
  if (isLatencyProlonged) findings.push(`Phonetic Latency หน่วงนาน (${phoneticLatencyMs} ms > 2200 ms)`);
  if (isRepetitionElevated) findings.push(`Semantic Repetition ซ้ำ (${semanticRepetitionCount} ครั้ง)`);

  const interpretationTh = findings.length > 0
    ? `[เมทริกซ์เสียงเชิงสำรวจ]: ตรวจพบลักษณะเสียงที่อาจสัมพันธ์กับ Word-Finding Difficulty (${findings.join(", ")}) — ข้อมูลสำหรับงานวิจัยเท่านั้น`
    : `[เมทริกซ์เสียงเชิงสำรวจ]: ปกติ (Pause Ratio ${pauseToSpeechRatio}, Latency ${phoneticLatencyMs} ms)`;

  return {
    isExploratoryOnly: true,
    consentRecord: speech.consentRecord,
    pauseToSpeechRatio,
    phoneticLatencyMs,
    semanticRepetitionCount,
    spokenTranscriptRedacted: "[REDACTED_VOICE_TRANSCRIPT]",
    isPauseElevated,
    isLatencyProlonged,
    isRepetitionElevated,
    interpretationTh,
  };
}

/**
 * Reversible / Metabolic Axis Evaluation
 * Evaluates Thyroid (Overt, Subclinical, Central, Thyrotoxicosis), B12, Folate,
 * Glucose (Hypoglycemia, Hyperglycemia), Sodium, Calcium, Anemia, Renal & Hepatic dysfunction.
 */
export function evaluateReversibleAxis(
  labs: LabResults = {},
  acbTotalScore: number = 0
): {
  categories: ReversibleAxisCategory[];
  flags: string[];
} {
  const categories: ReversibleAxisCategory[] = [];
  const flags: string[] = [];

  // Anticholinergic Drug Burden
  if (acbTotalScore >= CLINICAL_THRESHOLDS.ACB_HIGH_BURDEN_CUTOFF) {
    categories.push("HIGH_ACB_BURDEN");
    flags.push(`[HIGH ACB BURDEN] ภาระยาต้านโคลิเนอร์จิกสูง (ACB Score = ${acbTotalScore}) เสี่ยงต่อสมองตื้อจากยา แนะนำ Deprescribing`);
  }

  // Check if ANY lab was entered
  const hasAnyLab =
    labs.tsh_uIU_mL !== undefined ||
    labs.free_t4_ng_dL !== undefined ||
    labs.vitamin_b12_pg_mL !== undefined ||
    labs.serum_folate_ng_mL !== undefined ||
    labs.sodium_mEq_L !== undefined ||
    labs.calcium_mg_dL !== undefined ||
    labs.fasting_glucose_mg_dL !== undefined ||
    labs.hba1c_percent !== undefined ||
    labs.hemoglobin_g_dL !== undefined ||
    labs.creatinine_mg_dL !== undefined ||
    labs.egfr_mL_min !== undefined ||
    labs.alt_u_L !== undefined ||
    labs.ast_u_L !== undefined ||
    labs.ldl_mg_dL !== undefined;

  if (!hasAnyLab) {
    if (categories.length === 0) categories.push("UNASSESSED");
    return { categories, flags };
  }

  // 1. Fasting Glucose (Hypoglycemia & Severe Hyperglycemia)
  const glu = labs.fasting_glucose_mg_dL;
  if (glu !== undefined && glu !== null) {
    if (glu < CLINICAL_THRESHOLDS.GLUCOSE_SEVERE_LOW) {
      categories.push("SEVERE_HYPOGLYCEMIA");
      flags.push(`[SEVERE HYPOGLYCEMIA] น้ำตาลในเลือดต่ำรุนแรง (${glu} mg/dL < 54) ภาวะฉุกเฉินทำให้เซลล์สมองขาดพลังงาน เกิดอาการสับสน เพ้อ และหมดสติ ต้องให้กลูโคสด่วน`);
    } else if (glu < CLINICAL_THRESHOLDS.GLUCOSE_LOW) {
      categories.push("HYPOGLYCEMIA_RISK");
      flags.push(`[HYPOGLYCEMIA RISK] น้ำตาลในเลือดต่ำ (${glu} mg/dL < 70) อาจทำให้มีอาการมึนงง สับสน ความจำถดถอย`);
    } else if (glu >= CLINICAL_THRESHOLDS.GLUCOSE_SEVERE_HIGH) {
      categories.push("SEVERE_HYPERGLYCEMIA");
      flags.push(`[SEVERE HYPERGLYCEMIA] น้ำตาลในเลือดสูงรุนแรง (${glu} mg/dL >= 300) เสี่ยงต่อภาวะ Hyperosmolar Hyperglycemic State (HHS) ทำให้สับสนซึม`);
    }
  }

  // 2. Hemoglobin (Severe Anemia vs Watch)
  const hb = labs.hemoglobin_g_dL;
  if (hb !== undefined && hb !== null) {
    if (hb < CLINICAL_THRESHOLDS.HEMOGLOBIN_SEVERE_ANEMIA) {
      categories.push("SEVERE_ANEMIA");
      flags.push(`[SEVERE ANEMIA] ภาวะซีดรุนแรง (Hemoglobin = ${hb} g/dL < 8.0) สมองขาดออกซิเจน ทำให้ง่วงซึม ความจำและสมาธิลดลงชัดเจน ต้องตรวจหาสาเหตุเลือดออกหรือขาดสารอาหาร`);
    } else if (hb < CLINICAL_THRESHOLDS.HEMOGLOBIN_MILD_ANEMIA) {
      categories.push("ANEMIA_WATCH");
      flags.push(`[ANEMIA WATCH] ภาวะซีดระดับเล็กน้อยถึงปานกลาง (Hemoglobin = ${hb} g/dL; ช่วง 8.0-10.9) อาจส่งผลให้เหนื่อยง่ายและคิดช้าลง`);
    }
  }

  // 3. Renal Impairment & Uremic Encephalopathy Risk
  const cr = labs.creatinine_mg_dL;
  const egfr = labs.egfr_mL_min;
  if (cr !== undefined && cr !== null) {
    if (cr >= CLINICAL_THRESHOLDS.CREATININE_SEVERE || (egfr !== undefined && egfr !== null && egfr < CLINICAL_THRESHOLDS.EGFR_SEVERE_RENAL)) {
      categories.push("SEVERE_RENAL_FAILURE_UREMIC_RISK");
      flags.push(`[SEVERE RENAL FAILURE] ไตวายรุนแรง (Creatinine = ${cr} mg/dL, eGFR = ${egfr ?? "ไม่ได้คำนวณ"}) เสี่ยงต่อภาวะของเสียคั่งในสมอง (Uremic Encephalopathy) ทำให้สับสน เพ้อ และความจำเสื่อม`);
    } else if (cr >= CLINICAL_THRESHOLDS.CREATININE_MODERATE || (egfr !== undefined && egfr !== null && egfr < CLINICAL_THRESHOLDS.EGFR_MODERATE_RENAL)) {
      categories.push("RENAL_IMPAIRMENT");
      flags.push(`[RENAL IMPAIRMENT] ไตบกพร่องปานกลาง (Creatinine = ${cr} mg/dL, eGFR = ${egfr ?? "ไม่ได้คำนวณ"}) ต้องปรับขนาดยาและระวังของเสียสะสม`);
    }
  }

  // 4. Serum Folate Deficiency
  const fol = labs.serum_folate_ng_mL;
  if (fol !== undefined && fol !== null) {
    if (fol < CLINICAL_THRESHOLDS.FOLATE_DEFICIENT) {
      categories.push("FOLATE_DEFICIENCY");
      flags.push(`[FOLATE DEFICIENCY] ภาวะขาดกรดโฟลิก (${fol} ng/mL < 3.0) เป็นสาเหตุของความจำเสื่อมและโลหิตจางที่รักษาหายได้ แนะนำเสริม Folic Acid`);
    } else if (fol <= CLINICAL_THRESHOLDS.FOLATE_BORDERLINE_HIGH) {
      categories.push("BORDERLINE_FOLATE_WATCH");
      flags.push(`[BORDERLINE FOLATE] ระดับกรดโฟลิกก้ำกึ่งต่ำ (${fol} ng/mL; ช่วง 3.0-4.0) แนะนำติดตามและรับประทานผักใบเขียว`);
    }
  }

  // 5. Hepatic Dysfunction (ALT / AST)
  const alt = labs.alt_u_L;
  const ast = labs.ast_u_L;
  const maxTransaminase = Math.max(alt ?? 0, ast ?? 0);
  if (maxTransaminase > 0) {
    if (maxTransaminase >= CLINICAL_THRESHOLDS.ALT_SEVERE) {
      categories.push("SEVERE_HEPATIC_DYSFUNCTION");
      flags.push(`[SEVERE HEPATIC DYSFUNCTION] ตับอักเสบรุนแรง (ALT = ${alt ?? "-"}, AST = ${ast ?? "-"} U/L >= 250) เสี่ยงต่อภาวะตับวายและ Hepatic Encephalopathy ทำให้สับสนซึม`);
    } else if (maxTransaminase >= CLINICAL_THRESHOLDS.ALT_IMPAIRMENT) {
      categories.push("HEPATIC_IMPAIRMENT_WATCH");
      flags.push(`[HEPATIC IMPAIRMENT WATCH] ตับอักเสบปานกลาง (ALT = ${alt ?? "-"}, AST = ${ast ?? "-"} U/L > 120) ควรตรวจหาสาเหตุ`);
    }
  }

  // 6. Thyroid Evaluation (Overt, Subclinical, Central, Thyrotoxicosis)
  const tsh = labs.tsh_uIU_mL;
  const ft4 = labs.free_t4_ng_dL;
  if (tsh !== undefined && tsh !== null) {
    const isFt4Low = ft4 !== undefined && ft4 !== null && ft4 < CLINICAL_THRESHOLDS.FREE_T4_NORMAL_LOW;

    // Central Hypothyroidism: Low FT4 with normal or low TSH
    if (isFt4Low && tsh <= CLINICAL_THRESHOLDS.TSH_NORMAL_HIGH && tsh >= 0.1) {
      categories.push("CENTRAL_HYPOTHYROIDISM_SUSPECTED");
      flags.push(`[CENTRAL HYPOTHYROIDISM SUSPECTED] FT4 ต่ำ (${ft4} ng/dL < 0.8) ร่วมกับ TSH ปกติ/ต่ำ (${tsh} uIU/mL) สงสัยภาวะพร่องฮอร์โมนไทรอยด์จากต่อมใต้สมอง (Central/Secondary Hypothyroidism) แนะนำส่งตรวจต่อมไร้ท่อและ MRI Pituitary`);
    } else if (tsh > CLINICAL_THRESHOLDS.TSH_SUBCLINICAL_MAX || (tsh > CLINICAL_THRESHOLDS.TSH_NORMAL_HIGH && isFt4Low)) {
      categories.push("OVERT_HYPOTHYROIDISM");
      flags.push(`[OVERT HYPOTHYROIDISM] ภาวะฮอร์โมนไทรอยด์ต่ำชัดเจน (TSH = ${tsh} uIU/mL, FT4 = ${ft4 ?? "ไม่ได้ตรวจ"}) เป็นสาเหตุของความจำถดถอยที่รักษาได้`);
    } else if (tsh > CLINICAL_THRESHOLDS.TSH_NORMAL_HIGH) {
      categories.push("SUBCLINICAL_THYROID_WATCH");
      flags.push(`[SUBCLINICAL THYROID WATCH] TSH สูงระดับก้ำกึ่ง (${tsh} uIU/mL; ช่วง 4.5–10) โดย FT4 ปกติ แนะนำตรวจติดตามซ้ำใน 2–3 เดือนก่อนเริ่มยาไทรอยด์`);
    } else if (tsh < CLINICAL_THRESHOLDS.TSH_NORMAL_LOW) {
      categories.push("HYPERTHYROIDISM_THYROTOXICOSIS");
      flags.push(`[THYROTOXICOSIS / HYPERTHYROIDISM] TSH ต่ำผิดปกติ (${tsh} uIU/mL < 0.35) บ่งชี้ภาวะไทรอยด์เป็นพิษ อาจทำให้ใจสั่น วิตกกังวล และสับสนในผู้สูงอายุ (Apathetic Thyrotoxicosis)`);
    }
  }

  // 7. Vitamin B12
  const b12 = labs.vitamin_b12_pg_mL;
  if (b12 !== undefined && b12 !== null) {
    if (b12 < CLINICAL_THRESHOLDS.B12_DEFICIENT) {
      categories.push("VITAMIN_B12_DEFICIENCY");
      flags.push(`[B12 DEFICIENCY] ภาวะขาดวิตามินบี 12 (${b12} pg/mL < 200) สาเหตุของสมองเสื่อมที่รักษาให้ดีขึ้นได้ แนะนำให้วิตามินบี 12 เสริม`);
    } else if (b12 < CLINICAL_THRESHOLDS.B12_BORDERLINE_HIGH) {
      categories.push("BORDERLINE_B12_WATCH");
      flags.push(`[BORDERLINE B12 WATCH] ระดับ Vitamin B12 ก้ำกึ่งต่ำ (${b12} pg/mL; ช่วง 200–300) แนะนำตรวจ MMA หรือ Homocysteine เพิ่มเติม`);
    }
  }

  // 8. Sodium: Mild vs Severe
  const na = labs.sodium_mEq_L;
  if (na !== undefined && na !== null) {
    if (na < CLINICAL_THRESHOLDS.SODIUM_SEVERE_LOW) {
      categories.push("SEVERE_HYPONATREMIA");
      flags.push(`[SEVERE HYPONATREMIA] ภาวะเกลือแร่โซเดียมต่ำรุนแรง (${na} mEq/L < 130) เสี่ยงต่ออาการสับสน เพ้อ และชัก ต้องแก้ไขทางการแพทย์ทันที`);
    } else if (na < CLINICAL_THRESHOLDS.SODIUM_MILD_LOW) {
      categories.push("MILD_HYPONATREMIA_WATCH");
      flags.push(`[MILD HYPONATREMIA] โซเดียมต่ำระดับเล็กน้อย (${na} mEq/L; ช่วง 130–134) แนะนำทบทวนยาขับปัสสาวะและตรวจติดตาม`);
    } else if (na > CLINICAL_THRESHOLDS.SODIUM_HIGH) {
      categories.push("HYPERNATREMIA");
      flags.push(`[HYPERNATREMIA] โซเดียมสูง (${na} mEq/L > 145) สัมพันธ์กับภาวะขาดน้ำในผู้สูงอายุ`);
    }
  }

  // 9. Calcium
  const ca = labs.calcium_mg_dL;
  if (ca !== undefined && ca !== null) {
    if (ca > CLINICAL_THRESHOLDS.CALCIUM_HIGH) {
      categories.push("HYPERCALCEMIA");
      flags.push(`[HYPERCALCEMIA] แคลเซียมในเลือดสูง (${ca} mg/dL > 10.5) อาจทำให้เกิดอาการสับสน ซึม ซึมเศร้า หรือความจำถดถอย`);
    } else if (ca < CLINICAL_THRESHOLDS.CALCIUM_LOW) {
      categories.push("HYPOCALCEMIA");
      flags.push(`[HYPOCALCEMIA] แคลเซียมต่ำ (${ca} mg/dL < 8.5) อาจทำให้กล้ามเนื้อเกร็งกระตุก`);
    }
  }

  // 10. Poor Glycemic Control
  const a1c = labs.hba1c_percent;
  if (a1c !== undefined && a1c !== null && a1c >= CLINICAL_THRESHOLDS.HBA1C_POOR_CONTROL) {
    categories.push("POOR_GLYCEMIC_CONTROL");
    flags.push(`[POOR GLYCEMIC CONTROL] ควบคุมเบาหวานได้ไม่ดี (HbA1c = ${a1c}% >= 9.0) เพิ่มความเสี่ยงต่อโรคหลอดเลือดสมองและสมองเสื่อมจากหลอดเลือด`);
  }

  if (categories.length === 0) {
    categories.push("METABOLIC_NORMAL");
  }

  return { categories, flags };
}

/**
 * Alzheimer's Specific Biomarker Axis Evaluation
 * Evaluates Plasma p-tau217 AND Aβ42/40 independently!
 * Guided by Alzheimer's Association: Blood biomarkers are indicated for symptomatic individuals.
 * Positive triage biomarker MUST be confirmed with Amyloid-PET or CSF before DMT initiation.
 */
export function evaluateBiomarkerAxis(
  labs: LabResults = {},
  algorithmicCognitiveAxis: CognitiveAxisCategory
): {
  category: BiomarkerAxisCategory;
  ptau217Status: Ptau217Status;
  abetaRatioStatus: AbetaRatioStatus;
  flags: string[];
  confirmatoryAdvisoryTh: string;
} {
  const flags: string[] = [];

  const ptauVal = labs.plasma_ptau217_pg_mL;
  const ptauStatus = labs.ptau217_status;
  const abetaVal = labs.abeta_42_40_ratio;
  const abetaStatus = labs.abeta_ratio_status;
  const egfr = labs.egfr_mL_min;

  const hasPtau = ptauVal !== undefined && ptauVal !== null || ptauStatus !== undefined;
  const hasAbeta = abetaVal !== undefined && abetaVal !== null || abetaStatus !== undefined;

  if (!hasPtau && !hasAbeta) {
    return {
      category: "UNASSESSED",
      ptau217Status: "UNASSESSED",
      abetaRatioStatus: "UNASSESSED",
      flags: [],
      confirmatoryAdvisoryTh: "ยังไม่ได้ตรวจตัวชี้วัดชีวภาพเฉพาะโรคอัลไซเมอร์",
    };
  }

  // 1. Evaluate p-tau217 independently
  const posCutoff = labs.ptau_positive_cutoff ?? 0.40;
  const interCutoff = labs.ptau_intermediate_cutoff ?? 0.25;

  let resolvedPtau: Ptau217Status = "UNASSESSED";
  if (ptauStatus) {
    resolvedPtau = ptauStatus;
  } else if (ptauVal !== undefined && ptauVal !== null) {
    if (ptauVal >= posCutoff) resolvedPtau = "POSITIVE";
    else if (ptauVal >= interCutoff) resolvedPtau = "BORDERLINE";
    else resolvedPtau = "NEGATIVE";
  }

  // 2. Evaluate Amyloid Beta 42/40 independently (Ratio < 0.090 indicates amyloid positivity)
  const abetaCutoff = labs.abeta_positive_cutoff ?? CLINICAL_THRESHOLDS.ABETA_42_40_RATIO_CUTOFF;
  let resolvedAbeta: AbetaRatioStatus = "UNASSESSED";
  if (abetaStatus) {
    resolvedAbeta = abetaStatus;
  } else if (abetaVal !== undefined && abetaVal !== null) {
    if (abetaVal < abetaCutoff) resolvedAbeta = "ABNORMAL_AMYLOID_POSITIVE";
    else resolvedAbeta = "NORMAL_AMYLOID_NEGATIVE";
  }

  // Detail findings per analyte
  if (resolvedPtau === "POSITIVE") {
    flags.push(`[PLASMA P-TAU217 POSITIVE] ค่า p-tau217 เป็นบวก (${ptauVal ?? "Positive"}) สนับสนุนพยาธิสภาพของโรคอัลไซเมอร์`);
  } else if (resolvedPtau === "BORDERLINE") {
    flags.push(`[PLASMA P-TAU217 INTERMEDIATE] ค่า p-tau217 ก้ำกึ่ง (${ptauVal ?? "Borderline"}) แนะนำตรวจยืนยันเพิ่มเติม`);
  } else if (resolvedPtau === "NEGATIVE") {
    flags.push(`[PLASMA P-TAU217 NEGATIVE] ค่า p-tau217 เป็นลบ (${ptauVal ?? "Negative"}) มี Negative Predictive Value สูงในการคัดแยกโรคอัลไซเมอร์`);
  } else {
    flags.push("[PLASMA P-TAU217] ไม่ได้ตรวจ (Unassessed)");
  }

  if (resolvedAbeta === "ABNORMAL_AMYLOID_POSITIVE") {
    flags.push(`[AMYLOID BETA 42/40 RATIO POSITIVE] อัตราส่วน Aβ42/40 ต่ำผิดปกติ (${abetaVal} < ${abetaCutoff}) บ่งชี้การสะสมของ Amyloid Plaque ในสมอง`);
  } else if (resolvedAbeta === "NORMAL_AMYLOID_NEGATIVE") {
    flags.push(`[AMYLOID BETA 42/40 RATIO NEGATIVE] อัตราส่วน Aβ42/40 ปกติ (${abetaVal} >= ${abetaCutoff})`);
  }

  // Renal Confounder Warning (eGFR < 60 may cause false-positive p-tau elevation)
  if (egfr !== undefined && egfr !== null && egfr < CLINICAL_THRESHOLDS.EGFR_RENAL_IMPAIRMENT) {
    flags.push(`[RENAL CONFOUNDER WARNING] ผู้ป่วยมี eGFR = ${egfr} mL/min/1.73m² (< 60) ภาวะไตบกพร่องอาจส่งผลให้การขับ p-tau ในเลือดลดลงและเกิดผลบวกลวงได้`);
  }

  const confirmatoryAdvisoryTh =
    "ตามแนวทางสมาคมโรคอัลไซเมอร์ (Alzheimer's Association): การตรวจตัวชี้วัดในเลือด (Blood Biomarkers) ในระดับคัดกรองเบื้องต้น หากได้ผลบวก ต้องได้รับการตรวจยืนยันด้วย Amyloid-PET หรือ CSF Biomarkers ก่อนพิจารณาเริ่มยาต้านแอมีลอยด์ (Anti-Amyloid DMTs) และผลลบช่วยคัดแยกสาเหตุจากโรคอัลไซเมอร์ได้สูง";

  // Guideline Gate: If cognitive performance is completely normal on objective screening
  if (algorithmicCognitiveAxis === "COGNITIVE_NORMAL") {
    flags.push("[BIOMARKER USAGE ADVISORY] ตามแนวทางสากล: ตัวชี้วัดในเลือดไม่แนะนำให้ใช้คัดกรองเดี่ยวในผู้ที่ไม่มีอาการบกพร่องทางการรู้คิด (Asymptomatic Individuals)");
    return {
      category: "NOT_INDICATED_ASYMPTOMATIC",
      ptau217Status: resolvedPtau,
      abetaRatioStatus: resolvedAbeta,
      flags,
      confirmatoryAdvisoryTh,
    };
  }

  // Overall Biomarker Axis Category Resolution
  let category: BiomarkerAxisCategory = "UNASSESSED";
  if (resolvedPtau === "POSITIVE" || resolvedAbeta === "ABNORMAL_AMYLOID_POSITIVE") {
    category = "AD_BIOMARKER_POSITIVE";
  } else if (resolvedPtau === "BORDERLINE") {
    category = "AD_BIOMARKER_INTERMEDIATE";
  } else if (resolvedPtau === "NEGATIVE" || resolvedAbeta === "NORMAL_AMYLOID_NEGATIVE") {
    category = "AD_BIOMARKER_NEGATIVE";
  }

  return {
    category,
    ptau217Status: resolvedPtau,
    abetaRatioStatus: resolvedAbeta,
    flags,
    confirmatoryAdvisoryTh,
  };
}

/**
 * Longitudinal Delta Calculation
 * Requires >= 90 days for annualized calculation to avoid wild short-interval spikes.
 * Detects Acute Precipitous Decline (< 90 days with severe drops) as emergency alerts!
 */
export function calculateLongitudinalDelta(
  input: AssessmentInput,
  currentCompositeIndex: number,
  prev: PreviousSessionSnapshot
): LongitudinalDeltaResult {
  const prevMs = Date.parse(prev.assessedAtIso);
  const currMs = Date.parse(input.assessedAtIso || new Date().toISOString());
  const daysElapsed = !isNaN(prevMs) && !isNaN(currMs) && currMs > prevMs
    ? Math.max(1, Math.round((currMs - prevMs) / 86400000))
    : 180;

  const deltaAd8Score = input.ad8Score !== null && prev.ad8Score !== null
    ? input.ad8Score - prev.ad8Score
    : null;
  const deltaDelayedRecallScore = input.delayedRecallScore !== null && prev.delayedRecallScore !== null
    ? input.delayedRecallScore - prev.delayedRecallScore
    : null;
  const deltaCompositeIndex = prev.screeningCompositeIndex !== undefined
    ? currentCompositeIndex - prev.screeningCompositeIndex
    : null;

  const annualizedRateCalculated = daysElapsed >= 90;
  let annualizedRateNoteTh = "";
  let trajectoryStatus: LongitudinalDeltaResult["trajectoryStatus"] = "STABLE";
  let acutePrecipitousDeclineFlag = false;

  const isSevereRecallDrop = (deltaDelayedRecallScore ?? 0) <= -2;
  const isSevereAd8Worsen = (deltaAd8Score ?? 0) >= 3;
  const isCompositeSpike = (deltaCompositeIndex ?? 0) >= 20;

  if (!annualizedRateCalculated) {
    // Short interval (< 90 days): Check for acute emergency decline
    if ((isSevereRecallDrop && isSevereAd8Worsen) || isCompositeSpike || (isSevereRecallDrop && (deltaAd8Score ?? 0) >= 2)) {
      trajectoryStatus = "ACUTE_PRECIPITOUS_DECLINE";
      acutePrecipitousDeclineFlag = true;
      annualizedRateNoteTh = `[คำเตือนฉุกเฉิน]: พบการทรุดลงอย่างรวดเร็วผิดปกติภายใน ${daysElapsed} วัน (< 90 วัน) บ่งชี้ภาวะเพ้อเฉียบพลัน (Delirium), โรคหลอดเลือดสมอง (Stroke) หรือสมองอักเสบ ไม่ใช่วิสัยของสมองเสื่อมตามธรรมชาติ`;
    } else {
      trajectoryStatus = "INSUFFICIENT_INTERVAL";
      annualizedRateNoteTh = `ระยะเวลาห่างเพียง ${daysElapsed} วัน (< 90 วัน) สั้นเกินกว่าจะประเมินแนวโน้มระยะยาวได้อย่างน่าเชื่อถือ (แสดงเฉพาะค่าความต่างจริง)`;
    }
  } else {
    // Standard longitudinal evaluation (>= 90 days)
    if ((isSevereRecallDrop && isSevereAd8Worsen) || isCompositeSpike) {
      trajectoryStatus = "RAPID_DECLINE";
    } else if (isSevereRecallDrop || isSevereAd8Worsen || (deltaCompositeIndex ?? 0) >= 10) {
      trajectoryStatus = "PROGRESSIVE_DECLINE";
    } else if ((deltaDelayedRecallScore ?? 0) >= 1 && (deltaCompositeIndex ?? 0) <= -8) {
      trajectoryStatus = "IMPROVED";
    } else {
      trajectoryStatus = "STABLE";
    }
  }

  const sign = (n: number | null) => (n === null ? "-" : n > 0 ? `+${n}` : `${n}`);
  const summaryTh = `เทียบกับ ${prev.session_id} (${daysElapsed} วัน): ΔAD8 ${sign(deltaAd8Score)}, ΔRecall ${sign(deltaDelayedRecallScore)} คำ, ΔIndex ${sign(deltaCompositeIndex)} จุด → สถานะ: ${trajectoryStatus} ${annualizedRateNoteTh ? "(" + annualizedRateNoteTh + ")" : ""}`;

  return {
    previous_session_id: prev.session_id,
    daysElapsed,
    deltaAd8Score,
    deltaDelayedRecallScore,
    deltaCompositeIndex,
    annualizedRateCalculated,
    annualizedRateNoteTh,
    trajectoryStatus,
    acutePrecipitousDeclineFlag,
    summaryTh,
  };
}

/**
 * Main Stratification Engine
 * Evaluates Pre-Test Validity, handles Nulls to avoid False Negatives,
 * outputs Multi-Axis Parallel Categories, preserves Raw Biological Telemetry,
 * and handles Non-Literate pathway & Clinician License validation.
 */
export function stratifyCognitiveRisk(input: AssessmentInput): RiskOutput {
  const missingDomainsTh: string[] = [];
  const clinicalFlags: string[] = [];
  const actionChecklistTh: string[] = [];

  // 1. Pre-Test Validity Gate Check
  const validity = evaluatePreTestValidity(input.preTestValidity);
  if (!validity.validityPassed) {
    return {
      algorithmVersion: ALGORITHM_VERSION,
      isComplete: false,
      missingDomainsTh: validity.exclusionReasonsTh,
      screeningCompositeIndex: 0,
      axes: {
        algorithmicCognitiveAxis: "INCOMPLETE_DATA",
        cognitiveAxis: "INCOMPLETE_DATA",
        reversibleAxis: ["UNASSESSED"],
        biomarkerAxis: "UNASSESSED",
        affectiveAxis: "UNASSESSED",
      },
      biomarkerDetails: {
        ptau217Status: "UNASSESSED",
        abetaRatioStatus: "UNASSESSED",
        plasmaAssayName: input.labs?.plasma_assay_manufacturer || "Standard Assay",
        confirmatoryAdvisoryTh: "ไม่สามารถแปลผลได้เนื่องจากมีข้อห้ามก่อนการทดสอบ",
      },
      clinicalFlags: validity.exclusionReasonsTh.map(r => `[PRE-TEST CONTRAINDICATION] ${r}`),
      primaryRecommendationTh: "ไม่สามารถประเมินผลได้ เนื่องจากผู้ป่วยมีข้อห้ามหรืออุปสรรคก่อนการทดสอบ (เช่น ภาวะเพ้อเฉียบพลัน ปัญหาการมองเห็น/ได้ยิน หรือได้รับยากล่อมประสาท)",
      actionChecklistTh: [
        "หยุดการทดสอบทางคลินิกชั่วคราว",
        "ส่งต่อแพทย์เพื่อตรวจวินิจฉัยและรักษาสาเหตุเฉียบพลัน (Delirium, การติดเชื้อ, อาการปวด)",
        "นัดประเมินใหม่อีกครั้งเมื่อผู้ป่วยมีระดับความรู้สึกตัวปกติและอาการทางกายคงที่",
      ],
      experimentalTelemetry: {
        visualMotor: evaluateVisualMotorTaskExperimental(null, null, null, null),
        speechMci: null,
        motorTremorIsolated: false,
        nonLiterateAssessmentUsed: false,
      },
    };
  }

  // 2. Incomplete Assessment Check (Prevent False Negatives from Null/Unanswered Modules)
  const isNonLiterate = !!(input.isNonLiteratePathway || input.preTestValidity?.isNonLiteratePathway);

  if (input.ad8Score === null) missingDomainsTh.push("แบบประเมินญาติ AD8 (ยังไม่ได้ตอบ)");
  if (input.delayedRecallScore === null) missingDomainsTh.push("Mini-Cog Delayed Recall (ยังไม่ได้ทดสอบ)");

  if (!isNonLiterate) {
    if (input.cdtResult === null) missingDomainsTh.push("Clock Drawing Test 11:10 (ยังไม่ได้วาด)");
  } else {
    // Non-literate pathway checks animal naming verbal fluency
    if (input.animalNamingCount === null || input.animalNamingCount === undefined) {
      missingDomainsTh.push("การทดสอบบอกชื่อสัตว์ 1 นาที (Verbal Fluency)");
    }
  }

  if (missingDomainsTh.length > 0) {
    return {
      algorithmVersion: ALGORITHM_VERSION,
      isComplete: false,
      missingDomainsTh,
      screeningCompositeIndex: 0,
      axes: {
        algorithmicCognitiveAxis: "INCOMPLETE_DATA",
        cognitiveAxis: "INCOMPLETE_DATA",
        reversibleAxis: ["UNASSESSED"],
        biomarkerAxis: "UNASSESSED",
        affectiveAxis: "UNASSESSED",
      },
      biomarkerDetails: {
        ptau217Status: "UNASSESSED",
        abetaRatioStatus: "UNASSESSED",
        plasmaAssayName: input.labs?.plasma_assay_manufacturer || "Standard Assay",
        confirmatoryAdvisoryTh: "ข้อมูลการประเมินไม่สมบูรณ์",
      },
      clinicalFlags: [
        `[INCOMPLETE DATA] ข้อมูลการประเมินไม่ครบถ้วน: ขาด ${missingDomainsTh.join(", ")}`,
        "ระบบจะไม่คำนวณระดับความเสี่ยงเพื่อความปลอดภัยของผู้ป่วยและป้องกันผลลบลวง (False Negative)",
      ],
      primaryRecommendationTh: `ข้อมูลการประเมินยังไม่สมบูรณ์ (ขาด: ${missingDomainsTh.join(", ")}) กรุณาทำแบบทดสอบให้ครบถ้วนก่อนออกผลคัดกรอง`,
      actionChecklistTh: ["กลับไปทำแบบทดสอบในโมดูลที่ยังค้างอยู่ให้ครบถ้วน"],
      experimentalTelemetry: {
        visualMotor: evaluateVisualMotorTaskExperimental(null, null, null, null),
        speechMci: null,
        motorTremorIsolated: false,
        nonLiterateAssessmentUsed: isNonLiterate,
      },
    };
  }

  // 3. Mini-Cog & Informant AD8 Evaluation
  const ad8Score = Math.max(0, Math.min(8, input.ad8Score!));
  const isAd8Positive = ad8Score >= CLINICAL_THRESHOLDS.AD8_CUTOFF;

  let isCognitiveScreenPositive = false;
  let miniCogTotal = 0;

  if (!isNonLiterate) {
    const miniCog = evaluateMiniCog(input.delayedRecallScore, input.cdtResult, input.cuedRecognitionScore);
    miniCogTotal = miniCog.totalScore ?? 0;
    isCognitiveScreenPositive = miniCog.isPositive || isAd8Positive;
  } else {
    // Non-literate pathway: Verbal Recall < 2 or Animal Naming < 10 or AD8 >= 2
    const animalCount = input.animalNamingCount ?? 0;
    const isAnimalNamingImpaired = animalCount < CLINICAL_THRESHOLDS.ANIMAL_NAMING_IMPAIRED;
    const isRecallImpaired = input.delayedRecallScore! < 2;
    isCognitiveScreenPositive = isRecallImpaired || isAnimalNamingImpaired || isAd8Positive;
    clinicalFlags.push(`[NON-LITERATE PATHWAY USED] ใช้เกณฑ์การประเมินผู้ไม่รู้หนังสือ (บอกชื่อสัตว์ ${animalCount} ชนิดใน 1 นาที, จำคำ ${input.delayedRecallScore}/3, AD8 ${ad8Score}/8)`);
  }

  // 4. Axis 1: Objective Algorithmic Cognitive Performance Tier
  // Uses Brief IADL if available to differentiate MCI (IADL intact) vs Dementia (IADL impaired)
  let algorithmicCognitiveAxis: CognitiveAxisCategory = "COGNITIVE_NORMAL";

  const isIadlImpaired = input.briefIADL?.isFunctionalDeclinePresent ?? false;
  const isIadlAssessed = input.briefIADL !== undefined;

  if (isCognitiveScreenPositive) {
    if (isIadlAssessed && isIadlImpaired) {
      algorithmicCognitiveAxis = "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA";
      clinicalFlags.push(`[Cognitive Impairment Screen-Positive: Probable Dementia] การรู้คิดบกพร่องร่วมกับกิจวัตรประจำวัน (IADL) บกพร่อง ${input.briefIADL?.totalImpairedCount}/4 กิจกรรม`);
      actionChecklistTh.push("ส่งพบแพทย์ระบบประสาทเพื่อประเมินทางประสาทจิตวิทยาละเอียด (TMSE หรือ Thai MoCA)");
    } else if (isIadlAssessed && !isIadlImpaired) {
      algorithmicCognitiveAxis = "COGNITIVE_SCREEN_POSITIVE_MCI_SUSPECTED";
      clinicalFlags.push("[Cognitive Impairment Screen-Positive: MCI Suspected] การรู้คิดบกพร่องแต่กิจวัตรประจำวันยังคงทำได้ด้วยตนเอง (IADL ปกติ)");
      actionChecklistTh.push("นัดตรวจติดตามสมรรถภาพสมองซ้ำภายใน 3–6 เดือน พร้อมตรวจคัดกรองปัจจัยหลอดเลือด");
    } else {
      // IADL unassessed
      if (input.delayedRecallScore === 0 && isAd8Positive) {
        algorithmicCognitiveAxis = "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA";
      } else {
        algorithmicCognitiveAxis = "COGNITIVE_SCREEN_POSITIVE_NEEDS_IADL_WORKUP";
      }
      clinicalFlags.push(`[Cognitive Screen-Positive] พบความผิดปกติเบื้องต้น (Recall ${input.delayedRecallScore}/3, AD8 ${ad8Score}/8) แนะนำประเมิน IADL เพิ่มเติม`);
      actionChecklistTh.push("ประเมินความสามารถในการทำกิจวัตรประจำวัน (IADL) เพื่อแยก MCI จากภาวะสมองเสื่อม");
    }
  } else {
    algorithmicCognitiveAxis = "COGNITIVE_NORMAL";
    clinicalFlags.push("[Cognitive Performance Normal] ผลการทดสอบการรู้คิดและแบบสอบถามญาติอยู่ในเกณฑ์ปกติ");
    actionChecklistTh.push("ส่งเสริมสุขภาพสมอง (MIND Diet, ออกกำลังกาย) และนัดคัดกรองซ้ำประจำปี");
  }

  // 5. Clinician Override (Unaltered algorithmic tier is ALWAYS retained!)
  let effectiveCognitiveAxis = algorithmicCognitiveAxis;
  if (input.clinicianOverride?.isOverridden && input.clinicianOverride.overriddenCognitiveAxis) {
    effectiveCognitiveAxis = input.clinicianOverride.overriddenCognitiveAxis;
    clinicalFlags.push(
      `[CLINICIAN OVERRIDE] แพทย์ผู้ตรวจ (${input.clinicianOverride.clinicianName || "แพทย์"}) เลขที่ใบอนุญาต ${input.clinicianOverride.physicianLicenseNumber} ได้ปรับผลสรุปการรู้คิดจาก ${algorithmicCognitiveAxis} เป็น ${effectiveCognitiveAxis} (เหตุผลทางคลินิก: ${input.clinicianOverride.clinicalRationale || "ดุลยพินิจของแพทย์"})`
    );
  }

  // 6. Axis 2: Reversible & Drug-Induced Axis
  const acbEval = evaluateAnticholinergicBurden(input.anticholinergicBurden?.selectedMedicationIds);
  const reversibleEval = evaluateReversibleAxis(input.labs || {}, acbEval.acbTotalScore);
  clinicalFlags.push(...reversibleEval.flags);
  if (reversibleEval.categories.includes("HIGH_ACB_BURDEN")) {
    actionChecklistTh.push("ส่งปรึกษาเภสัชกรคลินิกเพื่อทำ Medication Reconciliation และวางแผน Deprescribing ยากลุ่มเสี่ยง");
  }
  if (reversibleEval.categories.some(c =>
    c === "OVERT_HYPOTHYROIDISM" ||
    c === "CENTRAL_HYPOTHYROIDISM_SUSPECTED" ||
    c === "VITAMIN_B12_DEFICIENCY" ||
    c === "FOLATE_DEFICIENCY" ||
    c === "SEVERE_HYPOGLYCEMIA" ||
    c === "SEVERE_ANEMIA" ||
    c === "SEVERE_RENAL_FAILURE_UREMIC_RISK" ||
    c === "SEVERE_HEPATIC_DYSFUNCTION" ||
    c === "SEVERE_HYPONATREMIA"
  )) {
    actionChecklistTh.push("ส่งพบอายุรแพทย์เพื่อรักษาแก้ไขความผิดปกติของผลเลือด (สาเหตุที่รักษาหายได้) เป็นลำดับแรก");
  }

  // 7. Axis 3: Alzheimer's Specific Biomarker Axis
  // IMPORTANT: Evaluated against algorithmicCognitiveAxis so that clinician override does NOT erase biological data!
  const biomarkerEval = evaluateBiomarkerAxis(input.labs || {}, algorithmicCognitiveAxis);
  clinicalFlags.push(...biomarkerEval.flags);
  if (biomarkerEval.category === "AD_BIOMARKER_POSITIVE") {
    actionChecklistTh.push("ผลตรวจ Biomarker บ่งชี้พยาธิสภาพอัลไซเมอร์: พิจารณาส่ง Brain MRI และตรวจยืนยันด้วย Amyloid-PET หรือ CSF ก่อนเริ่มยา DMT");
  }

  // 8. Axis 4: Affective / Depressive Confounder Axis
  let affectiveAxis: AffectiveAxisCategory = "UNASSESSED";
  if (input.depression2Q) {
    const q1 = !!input.depression2Q.q1_depressed_mood;
    const q2 = !!input.depression2Q.q2_anhedonia;
    if (q1 || q2) {
      affectiveAxis = "PSEUDODEMENTIA_RISK_2Q_POSITIVE";
      clinicalFlags.unshift("[PSEUDODEMENTIA WARNING] ผลคัดกรอง 2Q เป็นบวก (เสี่ยงภาวะซึมเศร้า) แพทย์ควรประเมินด้วย TGDS-15 หรือ 9Q เพื่อแยกภาวะสมองเสื่อมเทียม");
      actionChecklistTh.unshift("ทำแบบประเมินภาวะซึมเศร้าในผู้สูงอายุไทย (TGDS-15 หรือ 9Q) ก่อนสรุปผลการวินิจฉัยสมองเสื่อม");
    } else {
      affectiveAxis = "2Q_NEGATIVE";
    }
  }

  // 9. Composite Screening Index (0–100 heuristic ranking index, NOT a probability)
  let compositeScore = 0;
  if (effectiveCognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA") compositeScore += 45;
  else if (effectiveCognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_MCI_SUSPECTED" || effectiveCognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_NEEDS_IADL_WORKUP") compositeScore += 25;

  if (ad8Score >= 2) compositeScore += Math.min(20, ad8Score * 2.5);
  if (input.delayedRecallScore === 0) compositeScore += 20;
  else if (input.delayedRecallScore === 1) compositeScore += 12;

  if (biomarkerEval.category === "AD_BIOMARKER_POSITIVE") compositeScore += 15;
  else if (biomarkerEval.category === "AD_BIOMARKER_INTERMEDIATE") compositeScore += 8;

  const screeningCompositeIndex = Math.min(100, Math.round(compositeScore));

  // 10. Experimental Telemetry (Separated from Primary Risk)
  const experimentalVm = evaluateVisualMotorTaskExperimental(
    input.visualMotorTimeMs,
    input.visualMotorErrors,
    input.age,
    input.yearsOfEducation,
    input.baselineTouchLatencyMs
  );
  const speechEval = evaluateSpeechBiomarkers(input.speechBiomarkers);
  const motorTremorIsolated = !!(input.cdtTelemetry?.motorTremorDetected);
  if (motorTremorIsolated) {
    clinicalFlags.push("[MOTOR TREMOR ISOLATED] ตรวจพบการสั่นของมือ (Motor Tremor) ระบบได้กรองความสั่นออกจากเกณฑ์การรู้คิดแล้ว");
  }

  // 11. Longitudinal Delta (if previous session provided)
  let longitudinalDelta: LongitudinalDeltaResult | undefined;
  if (input.previousSession) {
    longitudinalDelta = calculateLongitudinalDelta(input, screeningCompositeIndex, input.previousSession);
    clinicalFlags.push(`[LONGITUDINAL TRACKING] ${longitudinalDelta.summaryTh}`);
    if (longitudinalDelta.acutePrecipitousDeclineFlag) {
      clinicalFlags.unshift(`[CRITICAL ALERT] ${longitudinalDelta.annualizedRateNoteTh}`);
      actionChecklistTh.unshift("พบการทรุดลงอย่างรวดเร็วผิดปกติภายในเวลาสั้น (< 90 วัน) ส่งตัวพบแพทย์ด่วนเพื่อตรวจหาสาเหตุเฉียบพลัน (Stroke, Delirium, Infection)");
    } else if (longitudinalDelta.trajectoryStatus === "RAPID_DECLINE") {
      actionChecklistTh.unshift("พบอัตราการถดถอยอย่างรวดเร็ว (Rapid Decline) แนะนำส่งพบแพทย์ระบบประสาทเพื่อตรวจประเมินด่วน");
    }
  }

  // Primary Recommendation Synthesis
  let primaryRecommendationTh = "";
  if (longitudinalDelta?.acutePrecipitousDeclineFlag) {
    primaryRecommendationTh = "พบการถดถอยของการรู้คิดอย่างฮวบฮาบผิดปกติในระยะเวลาสั้น ต้องส่งพบแพทย์ด่วนเพื่อตรวจแยกภาวะฉุกเฉินทางสมอง (เช่น Acute Stroke, Delirium หรือ Encephalopathy)";
  } else if (reversibleEval.categories.some(c =>
    c === "HIGH_ACB_BURDEN" ||
    c === "OVERT_HYPOTHYROIDISM" ||
    c === "CENTRAL_HYPOTHYROIDISM_SUSPECTED" ||
    c === "VITAMIN_B12_DEFICIENCY" ||
    c === "FOLATE_DEFICIENCY" ||
    c === "SEVERE_HYPOGLYCEMIA" ||
    c === "SEVERE_ANEMIA" ||
    c === "SEVERE_RENAL_FAILURE_UREMIC_RISK" ||
    c === "SEVERE_HEPATIC_DYSFUNCTION" ||
    c === "SEVERE_HYPONATREMIA"
  )) {
    primaryRecommendationTh = "ตรวจพบสาเหตุทางกายที่รักษาแก้ไขได้หรือภาระยาต้านโคลิเนอร์จิกสูง แนะนำให้รักษาภาวะเมตาบอลิกและทบทวนปรับลดยาเป็นลำดับแรก แล้วประเมินการรู้คิดซ้ำ";
  } else if (biomarkerEval.category === "AD_BIOMARKER_POSITIVE" && effectiveCognitiveAxis !== "COGNITIVE_NORMAL") {
    primaryRecommendationTh = "ผลตรวจการรู้คิดบกพร่องร่วมกับผลบวกของตัวชี้วัดโรคอัลไซเมอร์ แนะนำส่งต่อแพทย์ระบบประสาทหรือคลินิกความจำเพื่อตรวจยืนยันด้วย Amyloid-PET หรือ CSF";
  } else if (effectiveCognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA") {
    primaryRecommendationTh = "ความเสี่ยงสูงต่อภาวะสมองเสื่อม แนะนำส่งปรึกษาแพทย์ระบบประสาทเพื่อตรวจประเมินประสาทจิตวิทยาเต็มรูปแบบ (TMSE/MoCA)";
  } else if (effectiveCognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_MCI_SUSPECTED" || effectiveCognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_NEEDS_IADL_WORKUP") {
    primaryRecommendationTh = "ความเสี่ยงปานกลาง (สงสัยภาวะการรู้คิดบกพร่องเล็กน้อย) แนะนำควบคุมปัจจัยเสี่ยงหลอดเลือด ฝึกบริหารสมอง และตรวจติดตามใน 3–6 เดือน";
  } else {
    primaryRecommendationTh = "สมรรถภาพการรู้คิดอยู่ในเกณฑ์ปกติ ส่งเสริมสุขภาพสมองและคัดกรองซ้ำประจำปี";
  }

  if (affectiveAxis === "PSEUDODEMENTIA_RISK_2Q_POSITIVE") {
    primaryRecommendationTh += " [สำคัญ: ผลคัดกรองซึมเศร้าเป็นบวก — ต้องประเมินแยกภาวะ Pseudodementia ด้วย TGDS-15 หรือ 9Q]";
  }

  return {
    algorithmVersion: ALGORITHM_VERSION,
    isComplete: true,
    missingDomainsTh: [],
    screeningCompositeIndex,
    axes: {
      algorithmicCognitiveAxis,
      cognitiveAxis: effectiveCognitiveAxis,
      reversibleAxis: reversibleEval.categories,
      biomarkerAxis: biomarkerEval.category,
      affectiveAxis,
    },
    biomarkerDetails: {
      ptau217Status: biomarkerEval.ptau217Status,
      abetaRatioStatus: biomarkerEval.abetaRatioStatus,
      plasmaAssayName: input.labs?.plasma_assay_manufacturer || "Standard Assay",
      confirmatoryAdvisoryTh: biomarkerEval.confirmatoryAdvisoryTh,
    },
    clinicalFlags,
    primaryRecommendationTh,
    actionChecklistTh: Array.from(new Set(actionChecklistTh)),
    experimentalTelemetry: {
      visualMotor: experimentalVm,
      speechMci: speechEval,
      motorTremorIsolated,
      nonLiterateAssessmentUsed: isNonLiterate,
    },
    longitudinalDelta,
    clinicianSignOff: input.clinicianOverride?.signedAtIso
      ? {
        isConfirmed: true,
        physicianLicenseNumber: input.clinicianOverride.physicianLicenseNumber,
        clinicianName: input.clinicianOverride.clinicianName,
        attestationConfirmed: input.clinicianOverride.practitionerAttestation,
        confirmedAtIso: input.clinicianOverride.signedAtIso,
      }
      : undefined,
  };
}
