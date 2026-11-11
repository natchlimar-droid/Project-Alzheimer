/**
 * Multimodal Cognitive Screening & Biomarker-Informed Triage System
 * Standalone Automated Test Runner (Node.js Execution)
 * Runs without DOM / window dependencies and prints structured test output to console.
 */

// --- 1. Clinical Thresholds ---
const CLINICAL_THRESHOLDS = {
  AD8_CUTOFF: 2,
  MINICOG_PASS_CUTOFF: 3,
  ACB_HIGH_BURDEN_CUTOFF: 3,
  TSH_NORMAL_LOW: 0.35,
  TSH_NORMAL_HIGH: 4.5,
  TSH_SUBCLINICAL_MAX: 10.0,
  FREE_T4_NORMAL_LOW: 0.8,
  B12_DEFICIENT: 200,
  B12_BORDERLINE_HIGH: 300,
  FOLATE_DEFICIENT: 3.0,
  FOLATE_BORDERLINE_HIGH: 4.0,
  SODIUM_SEVERE_LOW: 130,
  SODIUM_MILD_LOW: 135,
  SODIUM_HIGH: 145,
  CALCIUM_LOW: 8.5,
  CALCIUM_HIGH: 10.5,
  GLUCOSE_SEVERE_LOW: 54,
  GLUCOSE_LOW: 70,
  GLUCOSE_SEVERE_HIGH: 300,
  HEMOGLOBIN_SEVERE_ANEMIA: 8.0,
  HEMOGLOBIN_MILD_ANEMIA: 11.0,
  CREATININE_SEVERE: 3.0,
  CREATININE_MODERATE: 2.0,
  EGFR_SEVERE_RENAL: 15,
  EGFR_MODERATE_RENAL: 30,
  EGFR_RENAL_IMPAIRMENT: 60,
  ALT_SEVERE: 250,
  ALT_IMPAIRMENT: 120,
  AST_SEVERE: 250,
  AST_IMPAIRMENT: 120,
  ABETA_42_40_RATIO_CUTOFF: 0.090,
  ANIMAL_NAMING_IMPAIRED: 10,
};

// --- 2. ACB Drug Database ---
const ACB_MEDICATIONS = [
  { id: "MED_CPM", genericName: "Chlorpheniramine", acbScore: 3 },
  { id: "MED_DIMENHYDRINATE", genericName: "Dimenhydrinate", acbScore: 3 },
  { id: "MED_DIPHENHYDRAMINE", genericName: "Diphenhydramine", acbScore: 3 },
  { id: "MED_PROMETHAZINE", genericName: "Promethazine", acbScore: 3 },
  { id: "MED_TRIHEXYPHENIDYL", genericName: "Trihexyphenidyl", acbScore: 3 },
  { id: "MED_AMITRIPTYLINE", genericName: "Amitriptyline", acbScore: 3 },
  { id: "MED_NORTRIPTYLINE", genericName: "Nortriptyline", acbScore: 3 },
  { id: "MED_OXYBUTYNIN", genericName: "Oxybutynin", acbScore: 3 },
  { id: "MED_LORAZEPAM", genericName: "Lorazepam", acbScore: 1 },
  { id: "MED_DIAZEPAM", genericName: "Diazepam", acbScore: 1 },
  { id: "MED_ALPRAZOLAM", genericName: "Alprazolam", acbScore: 1 },
  { id: "MED_QUETIAPINE", genericName: "Quetiapine", acbScore: 1 },
  { id: "MED_CETIRIZINE", genericName: "Cetirizine", acbScore: 1 },
];

function evaluateAnticholinergicBurden(medIds = []) {
  const matched = ACB_MEDICATIONS.filter((m) => medIds.includes(m.id));
  const acbTotalScore = matched.reduce((sum, m) => sum + m.acbScore, 0);
  const high_acb_risk_flag = acbTotalScore >= CLINICAL_THRESHOLDS.ACB_HIGH_BURDEN_CUTOFF;
  return { acbTotalScore, high_acb_risk_flag, matched };
}

function evaluateMiniCog(delayedRecallScore, cdtResult, cuedScore) {
  if (delayedRecallScore === null || cdtResult === null) {
    return { totalScore: null, isPositive: null };
  }
  const clamped = Math.max(0, Math.min(3, Math.round(delayedRecallScore)));
  const cdtPts = cdtResult === "NORMAL" ? 2 : 0;
  const total = clamped + cdtPts;
  const isPositive = total < CLINICAL_THRESHOLDS.MINICOG_PASS_CUTOFF;
  return { totalScore: total, isPositive, clampedRecall: clamped };
}

function evaluateReversibleAxis(labs = {}, acbScore = 0) {
  const categories = [];
  const flags = [];

  if (acbScore >= CLINICAL_THRESHOLDS.ACB_HIGH_BURDEN_CUTOFF) {
    categories.push("HIGH_ACB_BURDEN");
  }

  const hasAnyLab =
    labs.tsh_uIU_mL !== undefined ||
    labs.free_t4_ng_dL !== undefined ||
    labs.vitamin_b12_pg_mL !== undefined ||
    labs.serum_folate_ng_mL !== undefined ||
    labs.sodium_mEq_L !== undefined ||
    labs.calcium_mg_dL !== undefined ||
    labs.fasting_glucose_mg_dL !== undefined ||
    labs.hemoglobin_g_dL !== undefined ||
    labs.creatinine_mg_dL !== undefined ||
    labs.alt_u_L !== undefined ||
    labs.ast_u_L !== undefined;

  if (!hasAnyLab) {
    if (categories.length === 0) categories.push("UNASSESSED");
    return { categories, flags };
  }

  // Glucose
  if (labs.fasting_glucose_mg_dL !== undefined && labs.fasting_glucose_mg_dL !== null) {
    if (labs.fasting_glucose_mg_dL < CLINICAL_THRESHOLDS.GLUCOSE_SEVERE_LOW) {
      categories.push("SEVERE_HYPOGLYCEMIA");
    } else if (labs.fasting_glucose_mg_dL < CLINICAL_THRESHOLDS.GLUCOSE_LOW) {
      categories.push("HYPOGLYCEMIA_RISK");
    } else if (labs.fasting_glucose_mg_dL >= CLINICAL_THRESHOLDS.GLUCOSE_SEVERE_HIGH) {
      categories.push("SEVERE_HYPERGLYCEMIA");
    }
  }

  // Hemoglobin
  if (labs.hemoglobin_g_dL !== undefined && labs.hemoglobin_g_dL !== null) {
    if (labs.hemoglobin_g_dL < CLINICAL_THRESHOLDS.HEMOGLOBIN_SEVERE_ANEMIA) {
      categories.push("SEVERE_ANEMIA");
    } else if (labs.hemoglobin_g_dL < CLINICAL_THRESHOLDS.HEMOGLOBIN_MILD_ANEMIA) {
      categories.push("ANEMIA_WATCH");
    }
  }

  // Creatinine
  if (labs.creatinine_mg_dL !== undefined && labs.creatinine_mg_dL !== null) {
    if (labs.creatinine_mg_dL >= CLINICAL_THRESHOLDS.CREATININE_SEVERE) {
      categories.push("SEVERE_RENAL_FAILURE_UREMIC_RISK");
    } else if (labs.creatinine_mg_dL >= CLINICAL_THRESHOLDS.CREATININE_MODERATE) {
      categories.push("RENAL_IMPAIRMENT");
    }
  }

  // Folate
  if (labs.serum_folate_ng_mL !== undefined && labs.serum_folate_ng_mL !== null) {
    if (labs.serum_folate_ng_mL < CLINICAL_THRESHOLDS.FOLATE_DEFICIENT) {
      categories.push("FOLATE_DEFICIENCY");
    } else if (labs.serum_folate_ng_mL <= CLINICAL_THRESHOLDS.FOLATE_BORDERLINE_HIGH) {
      categories.push("BORDERLINE_FOLATE_WATCH");
    }
  }

  // Hepatic
  const maxHepatic = Math.max(labs.alt_u_L ?? 0, labs.ast_u_L ?? 0);
  if (maxHepatic > 0) {
    if (maxHepatic >= CLINICAL_THRESHOLDS.ALT_SEVERE) {
      categories.push("SEVERE_HEPATIC_DYSFUNCTION");
    } else if (maxHepatic >= CLINICAL_THRESHOLDS.ALT_IMPAIRMENT) {
      categories.push("HEPATIC_IMPAIRMENT_WATCH");
    }
  }

  // Thyroid
  const tsh = labs.tsh_uIU_mL;
  const ft4 = labs.free_t4_ng_dL;
  if (tsh !== undefined && tsh !== null) {
    const isFt4Low = ft4 !== undefined && ft4 !== null && ft4 < CLINICAL_THRESHOLDS.FREE_T4_NORMAL_LOW;
    if (isFt4Low && tsh <= CLINICAL_THRESHOLDS.TSH_NORMAL_HIGH && tsh >= 0.1) {
      categories.push("CENTRAL_HYPOTHYROIDISM_SUSPECTED");
    } else if (tsh > CLINICAL_THRESHOLDS.TSH_SUBCLINICAL_MAX || (tsh > CLINICAL_THRESHOLDS.TSH_NORMAL_HIGH && isFt4Low)) {
      categories.push("OVERT_HYPOTHYROIDISM");
    } else if (tsh > CLINICAL_THRESHOLDS.TSH_NORMAL_HIGH) {
      categories.push("SUBCLINICAL_THYROID_WATCH");
    } else if (tsh < CLINICAL_THRESHOLDS.TSH_NORMAL_LOW) {
      categories.push("HYPERTHYROIDISM_THYROTOXICOSIS");
    }
  }

  // B12
  if (labs.vitamin_b12_pg_mL !== undefined && labs.vitamin_b12_pg_mL !== null) {
    if (labs.vitamin_b12_pg_mL < CLINICAL_THRESHOLDS.B12_DEFICIENT) {
      categories.push("VITAMIN_B12_DEFICIENCY");
    } else if (labs.vitamin_b12_pg_mL < CLINICAL_THRESHOLDS.B12_BORDERLINE_HIGH) {
      categories.push("BORDERLINE_B12_WATCH");
    }
  }

  // Sodium
  if (labs.sodium_mEq_L !== undefined && labs.sodium_mEq_L !== null) {
    if (labs.sodium_mEq_L < CLINICAL_THRESHOLDS.SODIUM_SEVERE_LOW) {
      categories.push("SEVERE_HYPONATREMIA");
    } else if (labs.sodium_mEq_L < CLINICAL_THRESHOLDS.SODIUM_MILD_LOW) {
      categories.push("MILD_HYPONATREMIA_WATCH");
    } else if (labs.sodium_mEq_L > CLINICAL_THRESHOLDS.SODIUM_HIGH) {
      categories.push("HYPERNATREMIA");
    }
  }

  if (categories.length === 0) categories.push("METABOLIC_NORMAL");
  return { categories, flags };
}

function evaluateBiomarkerAxis(labs = {}, algorithmicCognitiveAxis) {
  const ptauVal = labs.plasma_ptau217_pg_mL;
  const ptauStatus = labs.ptau217_status;
  const abetaVal = labs.abeta_42_40_ratio;
  const abetaStatus = labs.abeta_ratio_status;

  const hasPtau = (ptauVal !== undefined && ptauVal !== null) || ptauStatus !== undefined;
  const hasAbeta = (abetaVal !== undefined && abetaVal !== null) || abetaStatus !== undefined;

  if (!hasPtau && !hasAbeta) {
    return {
      category: "UNASSESSED",
      ptau217Status: "UNASSESSED",
      abetaRatioStatus: "UNASSESSED",
      flags: [],
    };
  }

  let resolvedPtau = "UNASSESSED";
  if (ptauStatus) resolvedPtau = ptauStatus;
  else if (ptauVal !== undefined && ptauVal !== null) {
    if (ptauVal >= 0.40) resolvedPtau = "POSITIVE";
    else if (ptauVal >= 0.25) resolvedPtau = "BORDERLINE";
    else resolvedPtau = "NEGATIVE";
  }

  let resolvedAbeta = "UNASSESSED";
  if (abetaStatus) resolvedAbeta = abetaStatus;
  else if (abetaVal !== undefined && abetaVal !== null) {
    if (abetaVal < 0.090) resolvedAbeta = "ABNORMAL_AMYLOID_POSITIVE";
    else resolvedAbeta = "NORMAL_AMYLOID_NEGATIVE";
  }

  if (algorithmicCognitiveAxis === "COGNITIVE_NORMAL") {
    return {
      category: "NOT_INDICATED_ASYMPTOMATIC",
      ptau217Status: resolvedPtau,
      abetaRatioStatus: resolvedAbeta,
      flags: ["NOT_INDICATED_ASYMPTOMATIC"],
    };
  }

  let category = "UNASSESSED";
  if (resolvedPtau === "POSITIVE" || resolvedAbeta === "ABNORMAL_AMYLOID_POSITIVE") {
    category = "AD_BIOMARKER_POSITIVE";
  } else if (resolvedPtau === "BORDERLINE") {
    category = "AD_BIOMARKER_INTERMEDIATE";
  } else if (resolvedPtau === "NEGATIVE" || resolvedAbeta === "NORMAL_AMYLOID_NEGATIVE") {
    category = "AD_BIOMARKER_NEGATIVE";
  }

  return { category, ptau217Status: resolvedPtau, abetaRatioStatus: resolvedAbeta, flags: [] };
}

function calculateLongitudinalDelta(input, currentCompositeIndex, prev) {
  const prevMs = Date.parse(prev.assessedAtIso);
  const currMs = Date.parse(input.assessedAtIso || new Date().toISOString());
  const daysElapsed = Math.max(1, Math.round((currMs - prevMs) / 86400000));

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
  let trajectoryStatus = "STABLE";
  let acutePrecipitousDeclineFlag = false;

  const isSevereRecallDrop = (deltaDelayedRecallScore ?? 0) <= -2;
  const isSevereAd8Worsen = (deltaAd8Score ?? 0) >= 3;
  const isCompositeSpike = (deltaCompositeIndex ?? 0) >= 20;

  if (!annualizedRateCalculated) {
    if ((isSevereRecallDrop && isSevereAd8Worsen) || isCompositeSpike || (isSevereRecallDrop && (deltaAd8Score ?? 0) >= 2)) {
      trajectoryStatus = "ACUTE_PRECIPITOUS_DECLINE";
      acutePrecipitousDeclineFlag = true;
    } else {
      trajectoryStatus = "INSUFFICIENT_INTERVAL";
    }
  } else {
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

  return {
    daysElapsed,
    deltaAd8Score,
    deltaDelayedRecallScore,
    deltaCompositeIndex,
    annualizedRateCalculated,
    trajectoryStatus,
    acutePrecipitousDeclineFlag,
  };
}

function stratifyCognitiveRisk(input) {
  // Pre-test validity
  if (input.preTestValidity && !input.preTestValidity.validityPassed) {
    return {
      isComplete: false,
      missingDomainsTh: input.preTestValidity.exclusionReasonsTh,
      axes: { cognitiveAxis: "INCOMPLETE_DATA", reversibleAxis: ["UNASSESSED"], biomarkerAxis: "UNASSESSED" },
    };
  }

  // Null input protection
  const isNonLiterate = !!(input.isNonLiteratePathway || input.preTestValidity?.isNonLiteratePathway);
  const missing = [];
  if (input.ad8Score === null) missing.push("AD8");
  if (input.delayedRecallScore === null) missing.push("Delayed Recall");
  if (!isNonLiterate && input.cdtResult === null) missing.push("Clock Drawing");
  if (isNonLiterate && (input.animalNamingCount === null || input.animalNamingCount === undefined)) missing.push("Animal Naming");

  if (missing.length > 0) {
    return {
      isComplete: false,
      missingDomainsTh: missing,
      axes: { cognitiveAxis: "INCOMPLETE_DATA", reversibleAxis: ["UNASSESSED"], biomarkerAxis: "UNASSESSED" },
    };
  }

  const ad8Score = input.ad8Score;
  const isAd8Pos = ad8Score >= CLINICAL_THRESHOLDS.AD8_CUTOFF;
  let isCognitiveScreenPositive = false;

  if (!isNonLiterate) {
    const mini = evaluateMiniCog(input.delayedRecallScore, input.cdtResult);
    isCognitiveScreenPositive = mini.isPositive || isAd8Pos;
  } else {
    isCognitiveScreenPositive = (input.animalNamingCount < 10) || (input.delayedRecallScore < 2) || isAd8Pos;
  }

  let algorithmicCognitiveAxis = "COGNITIVE_NORMAL";
  const isIadlImpaired = input.briefIADL?.isFunctionalDeclinePresent ?? false;
  const isIadlAssessed = input.briefIADL !== undefined;

  if (isCognitiveScreenPositive) {
    if (isIadlAssessed && isIadlImpaired) {
      algorithmicCognitiveAxis = "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA";
    } else if (isIadlAssessed && !isIadlImpaired) {
      algorithmicCognitiveAxis = "COGNITIVE_SCREEN_POSITIVE_MCI_SUSPECTED";
    } else {
      algorithmicCognitiveAxis = (input.delayedRecallScore === 0 && isAd8Pos)
        ? "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA"
        : "COGNITIVE_SCREEN_POSITIVE_NEEDS_IADL_WORKUP";
    }
  }

  let effectiveCognitiveAxis = algorithmicCognitiveAxis;
  if (input.clinicianOverride?.isOverridden && input.clinicianOverride.overriddenCognitiveAxis) {
    effectiveCognitiveAxis = input.clinicianOverride.overriddenCognitiveAxis;
  }

  const acb = evaluateAnticholinergicBurden(input.anticholinergicBurden?.selectedMedicationIds);
  const rev = evaluateReversibleAxis(input.labs || {}, acb.acbTotalScore);
  const bio = evaluateBiomarkerAxis(input.labs || {}, algorithmicCognitiveAxis);

  return {
    isComplete: true,
    axes: {
      algorithmicCognitiveAxis,
      cognitiveAxis: effectiveCognitiveAxis,
      reversibleAxis: rev.categories,
      biomarkerAxis: bio.category,
    },
    biomarkerDetails: {
      ptau217Status: bio.ptau217Status,
      abetaRatioStatus: bio.abetaRatioStatus,
    },
  };
}

// --- 3. Test Runner Suite ---
console.log("===============================================================================");
console.log(" 🧪 RUNNING CLINICAL VERIFICATION TEST SUITE (Node.js Environment)");
console.log("===============================================================================");

let passed = 0;
let failed = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    passed++;
    console.log(` ✅ PASS: ${testName}`);
  } else {
    failed++;
    console.error(` ❌ FAIL: ${testName} ${details ? `(${details})` : ""}`);
  }
}

// Test 1: Null Input Rejection
const t1 = stratifyCognitiveRisk({ age: 72, ad8Score: null, delayedRecallScore: null, cdtResult: null });
assert(t1.isComplete === false && t1.missingDomainsTh.length === 3, "Test 1: Null Input Protection Against False Negatives");

// Test 2: Isolated Aβ42/40 Evaluation (BUG FIX 1)
const t2 = stratifyCognitiveRisk({
  age: 74,
  ad8Score: 4,
  delayedRecallScore: 1,
  cdtResult: "ABNORMAL",
  labs: { abeta_42_40_ratio: 0.05 }, // Isolated abnormal amyloid, p-tau is unassessed
});
assert(
  t2.axes.biomarkerAxis === "AD_BIOMARKER_POSITIVE" &&
  t2.biomarkerDetails.ptau217Status === "UNASSESSED" &&
  t2.biomarkerDetails.abetaRatioStatus === "ABNORMAL_AMYLOID_POSITIVE",
  "Test 2: Isolated Aβ42/40 (0.05) triggers AD_BIOMARKER_POSITIVE with p-tau as UNASSESSED"
);

// Test 3: Comprehensive Geriatric Labs (BUG FIX 2: Glucose 30, Hb 6, Cr 4, Folate 1, ALT 300)
const t3 = stratifyCognitiveRisk({
  age: 79,
  ad8Score: 3,
  delayedRecallScore: 1,
  cdtResult: "NORMAL",
  labs: {
    fasting_glucose_mg_dL: 30,
    hemoglobin_g_dL: 6.0,
    creatinine_mg_dL: 4.0,
    serum_folate_ng_mL: 1.0,
    alt_u_L: 300,
  },
});
const r3 = t3.axes.reversibleAxis;
assert(
  r3.includes("SEVERE_HYPOGLYCEMIA") &&
  r3.includes("SEVERE_ANEMIA") &&
  r3.includes("SEVERE_RENAL_FAILURE_UREMIC_RISK") &&
  r3.includes("FOLATE_DEFICIENCY") &&
  r3.includes("SEVERE_HEPATIC_DYSFUNCTION") &&
  !r3.includes("UNASSESSED"),
  "Test 3: Glucose 30, Hb 6, Cr 4, Folate 1, ALT 300 all recognized as critical reversible causes"
);

// Test 4: Central Hypothyroidism & Thyrotoxicosis (BUG FIX 2 & 7)
const t4a = evaluateReversibleAxis({ tsh_uIU_mL: 2.1, free_t4_ng_dL: 0.6 });
const t4b = evaluateReversibleAxis({ tsh_uIU_mL: 0.05, free_t4_ng_dL: 2.4 });
assert(
  t4a.categories.includes("CENTRAL_HYPOTHYROIDISM_SUSPECTED") &&
  t4b.categories.includes("HYPERTHYROIDISM_THYROTOXICOSIS") &&
  !t4b.categories.includes("OVERT_HYPOTHYROIDISM"),
  "Test 4: Central Hypothyroidism (FT4 < 0.8 with normal TSH) and Thyrotoxicosis correctly classified"
);

// Test 5: Short Interval Precipitous Decline (BUG FIX 3: Recall 3->0, AD8 0->6 in 7 days)
const t5Prev = { session_id: "S1", assessedAtIso: "2026-11-04T00:00:00Z", ad8Score: 0, delayedRecallScore: 3, screeningCompositeIndex: 10 };
const t5Curr = { assessedAtIso: "2026-11-11T00:00:00Z", ad8Score: 6, delayedRecallScore: 0 };
const t5Delta = calculateLongitudinalDelta(t5Curr, 75, t5Prev);
assert(
  t5Delta.trajectoryStatus === "ACUTE_PRECIPITOUS_DECLINE" &&
  t5Delta.acutePrecipitousDeclineFlag === true &&
  t5Delta.annualizedRateCalculated === false,
  "Test 5: Drop within 7 days flags ACUTE_PRECIPITOUS_DECLINE emergency alert, NOT STABLE"
);

// Test 6: Clinician Override Preserves Biological Biomarker Data (BUG FIX 4)
const t6 = stratifyCognitiveRisk({
  age: 72,
  ad8Score: 4,
  delayedRecallScore: 0,
  cdtResult: "ABNORMAL",
  labs: { plasma_ptau217_pg_mL: 0.85, ptau217_status: "POSITIVE" },
  clinicianOverride: {
    isOverridden: true,
    overriddenCognitiveAxis: "COGNITIVE_NORMAL",
    clinicalRationale: "Sleep deprivation",
    physicianLicenseNumber: "ว.49120",
  },
});
assert(
  t6.axes.algorithmicCognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA" &&
  t6.axes.cognitiveAxis === "COGNITIVE_NORMAL" &&
  t6.axes.biomarkerAxis === "AD_BIOMARKER_POSITIVE" &&
  t6.biomarkerDetails.ptau217Status === "POSITIVE",
  "Test 6: Clinician override to COGNITIVE_NORMAL preserves positive biological biomarker and algorithmic tier"
);

// Test 7: Mini-Cog Borson Standard (BUG FIX 7)
const t7a = evaluateMiniCog(1, "NORMAL");
const t7b = evaluateMiniCog(1, "ABNORMAL");
assert(
  t7a.totalScore === 3 && t7a.isPositive === false &&
  t7b.totalScore === 1 && t7b.isPositive === true,
  "Test 7: Borson Mini-Cog Criteria: Recall 1 + Normal Clock passes (3/5), Recall 1 + Abnormal Clock fails (1/5)"
);

// Test 8: Specific ACB Drug APIs (BUG FIX 7: CPM + Dimenhydrinate + Lorazepam = 7)
const t8 = evaluateAnticholinergicBurden(["MED_CPM", "MED_DIMENHYDRINATE", "MED_LORAZEPAM"]);
assert(
  t8.acbTotalScore === 7 && t8.high_acb_risk_flag === true,
  "Test 8: Pharmacological ACB verification (CPM 3 + Dimenhydrinate 3 + Lorazepam 1 = 7)"
);

// Test 9: Non-Literate Alternative Pathway
const t9 = stratifyCognitiveRisk({
  age: 80,
  ad8Score: 1,
  delayedRecallScore: 2,
  cdtResult: null,
  isNonLiteratePathway: true,
  animalNamingCount: 15,
});
assert(
  t9.isComplete === true && t9.axes.cognitiveAxis === "COGNITIVE_NORMAL",
  "Test 9: Non-literate senior evaluated via Verbal Memory + Animal Naming without requiring clock drawing"
);

// Test 10: Brief IADL Functional Differentiation (MCI vs Dementia)
const t10Mci = stratifyCognitiveRisk({
  age: 75,
  ad8Score: 3,
  delayedRecallScore: 1,
  cdtResult: "ABNORMAL",
  briefIADL: { isFunctionalDeclinePresent: false, totalImpairedCount: 0 },
});
const t10Dem = stratifyCognitiveRisk({
  age: 75,
  ad8Score: 3,
  delayedRecallScore: 1,
  cdtResult: "ABNORMAL",
  briefIADL: { isFunctionalDeclinePresent: true, totalImpairedCount: 2 },
});
assert(
  t10Mci.axes.cognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_MCI_SUSPECTED" &&
  t10Dem.axes.cognitiveAxis === "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA",
  "Test 10: Brief IADL accurately differentiates MCI (IADL intact) from Probable Dementia (IADL impaired)"
);

console.log("===============================================================================");
console.log(` 📊 SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
console.log("===============================================================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log(" 🎉 ALL CLINICAL TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
}

