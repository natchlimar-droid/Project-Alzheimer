/**
 * Clinical Verification & Regression Test Suite (Node.js native `node:test`)
 * Run with: `node --test test-runner.mjs`
 *
 * Imports directly from the authoritative TypeScript clinical engine (`src/index.ts`)
 * AND verifies byte-level/behavioral parity with the browser bundle (`dist/clinical-engine.mjs`).
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import * as SrcEngine from "./src/index.ts";
import * as DistEngine from "./dist/clinical-engine.mjs";
import { runClinicalEngineTests } from "./src/engine/riskStratification.test.ts";

const {
  ALGORITHM_VERSION,
  FHIR_LOCAL_CODE_SYSTEM,
  LOINC_DATA_MAPPING,
  normalizeLabResults,
  getAnimalNamingThreshold,
  evaluateBriefIADL,
  evaluateMiniCog,
  evaluateAnticholinergicBurden,
  evaluateReversibleAxis,
  calculateLongitudinalDelta,
  stratifyCognitiveRisk,
  buildFhirR4Bundle,
  parseFhirBundleToLabResults,
  validateFhirR4Bundle,
} = SrcEngine;

describe("Clinical Engine Bundle Parity", () => {
  it("exports identical public API surface and behavior between src/index.ts and dist/clinical-engine.mjs", () => {
    assert.equal(DistEngine.ALGORITHM_VERSION, ALGORITHM_VERSION);
    assert.deepEqual(
      Object.keys(DistEngine).sort(),
      Object.keys(SrcEngine).sort(),
      "Built bundle exports should match src/index.ts"
    );

    const sample = {
      age: 76,
      ad8Score: 3,
      delayedRecallScore: 1,
      cdtResult: "ABNORMAL",
      briefIADL: evaluateBriefIADL(true, false, false, false),
      labs: { tsh_uIU_mL: 0.05, free_t4_ng_dL: 0.65, calcium_mg_dL: 11.2 },
    };
    assert.deepEqual(
      DistEngine.stratifyCognitiveRisk(sample),
      stratifyCognitiveRisk(sample),
      "dist/clinical-engine.mjs and src/index.ts must return identical RiskOutput"
    );
  });
});

describe("Core Clinical Verification Scenarios (TC-01 to TC-10)", () => {
  it("TC-01: rejects null/incomplete core domains to prevent false negatives", () => {
    const out = stratifyCognitiveRisk({
      age: 72,
      ad8Score: null,
      delayedRecallScore: null,
      cdtResult: null,
    });
    assert.equal(out.isComplete, false);
    assert.equal(out.missingDomainsTh.length, 3);
    assert.ok(out.clinicalFlags.length > 0);
  });

  it("TC-02: isolated Aβ42/40 ratio (0.05) triggers AD_BIOMARKER_POSITIVE while p-tau217 stays UNASSESSED", () => {
    const out = stratifyCognitiveRisk({
      age: 74,
      ad8Score: 4,
      delayedRecallScore: 1,
      cdtResult: "ABNORMAL",
      labs: { abeta_42_40_ratio: 0.05 },
    });
    assert.equal(out.axes.biomarkerAxis, "AD_BIOMARKER_POSITIVE");
    assert.equal(out.biomarkerDetails.ptau217Status, "UNASSESSED");
    assert.equal(out.biomarkerDetails.abetaRatioStatus, "ABNORMAL_AMYLOID_POSITIVE");
  });

  it("TC-03: comprehensive geriatric labs (Glucose 30, Hb 6.0, Cr 4.0, Folate 1.0, ALT 300) flag critical reversible causes", () => {
    const out = stratifyCognitiveRisk({
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
    const rev = out.axes.reversibleAxis;
    assert.ok(rev.includes("SEVERE_HYPOGLYCEMIA"));
    assert.ok(rev.includes("SEVERE_ANEMIA"));
    assert.ok(rev.includes("SEVERE_RENAL_FAILURE_UREMIC_RISK"));
    assert.ok(rev.includes("FOLATE_DEFICIENCY"));
    assert.ok(rev.includes("SEVERE_HEPATIC_DYSFUNCTION"));
    assert.ok(!rev.includes("UNASSESSED"));
  });

  it("TC-04: Central Hypothyroidism (normal TSH + low FT4) vs Thyrotoxicosis (low TSH + high FT4)", () => {
    const t4a = evaluateReversibleAxis({ tsh_uIU_mL: 2.1, free_t4_ng_dL: 0.6 });
    const t4b = evaluateReversibleAxis({ tsh_uIU_mL: 0.05, free_t4_ng_dL: 2.4 });
    assert.ok(t4a.categories.includes("CENTRAL_HYPOTHYROIDISM_SUSPECTED"));
    assert.ok(t4b.categories.includes("HYPERTHYROIDISM_THYROTOXICOSIS"));
    assert.ok(!t4b.categories.includes("OVERT_HYPOTHYROIDISM"));
  });

  it("TC-05: precipitous 7-day decline flags ACUTE_PRECIPITOUS_DECLINE instead of STABLE", () => {
    const prev = {
      session_id: "S1",
      assessedAtIso: "2026-11-04T00:00:00Z",
      ad8Score: 0,
      delayedRecallScore: 3,
      screeningCompositeIndex: 10,
    };
    const curr = {
      assessedAtIso: "2026-11-11T00:00:00Z",
      ad8Score: 6,
      delayedRecallScore: 0,
    };
    const delta = calculateLongitudinalDelta(curr, 75, prev);
    assert.equal(delta.trajectoryStatus, "ACUTE_PRECIPITOUS_DECLINE");
    assert.equal(delta.acutePrecipitousDeclineFlag, true);
    assert.equal(delta.annualizedRateCalculated, false);
  });

  it("TC-06: Clinician Override to COGNITIVE_NORMAL preserves algorithmic tier and AD_BIOMARKER_POSITIVE", () => {
    const out = stratifyCognitiveRisk({
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
    assert.equal(out.axes.algorithmicCognitiveAxis, "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA");
    assert.equal(out.axes.cognitiveAxis, "COGNITIVE_NORMAL");
    assert.equal(out.axes.biomarkerAxis, "AD_BIOMARKER_POSITIVE");
    assert.equal(out.biomarkerDetails.ptau217Status, "POSITIVE");
  });

  it("TC-07: Borson Mini-Cog scoring (Recall 1 + Normal Clock = 3/5 pass; Recall 1 + Abnormal Clock = 1/5 fail)", () => {
    const pass = evaluateMiniCog(1, "NORMAL");
    const fail = evaluateMiniCog(1, "ABNORMAL");
    assert.equal(pass.totalScore, 3);
    assert.equal(pass.isPositive, false);
    assert.equal(fail.totalScore, 1);
    assert.equal(fail.isPositive, true);
  });

  it("TC-08: Pharmacological ACB calculation (CPM 3 + Dimenhydrinate 3 + Lorazepam 1 = 7)", () => {
    const acb = evaluateAnticholinergicBurden(["MED_CPM", "MED_DIMENHYDRINATE", "MED_LORAZEPAM"]);
    assert.equal(acb.acbTotalScore, 7);
    assert.equal(acb.high_acb_risk_flag, true);
  });

  it("TC-09: Non-literate senior pathway evaluates without requiring Clock Drawing", () => {
    const out = stratifyCognitiveRisk({
      age: 80,
      ad8Score: 1,
      delayedRecallScore: 2,
      cdtResult: null,
      isNonLiteratePathway: true,
      animalNamingCount: 15,
    });
    assert.equal(out.isComplete, true);
    assert.equal(out.axes.cognitiveAxis, "COGNITIVE_NORMAL");
  });

  it("TC-10: Brief IADL differentiates MCI (intact IADL) from Probable Dementia (impaired IADL)", () => {
    const mci = stratifyCognitiveRisk({
      age: 75,
      ad8Score: 3,
      delayedRecallScore: 1,
      cdtResult: "ABNORMAL",
      briefIADL: evaluateBriefIADL(false, false, false, false),
    });
    const dem = stratifyCognitiveRisk({
      age: 75,
      ad8Score: 3,
      delayedRecallScore: 1,
      cdtResult: "ABNORMAL",
      briefIADL: evaluateBriefIADL(true, true, false, false),
    });
    assert.equal(mci.axes.cognitiveAxis, "COGNITIVE_SCREEN_POSITIVE_MCI_SUSPECTED");
    assert.equal(dem.axes.cognitiveAxis, "COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA");
  });
});

describe("Internal TypeScript Clinical Engine Test Suite (TC-11 to TC-18)", () => {
  it("passes all 13 built-in assertions in src/engine/riskStratification.test.ts", () => {
    const report = runClinicalEngineTests();
    assert.equal(report.failed, 0, `Engine self-test failures: ${(report.logs || []).join("\n")}`);
    assert.ok(report.passed >= 13);
  });
});

describe("Hardened Clinical & FHIR Regression Suite (TC-19 to TC-29)", () => {
  it("TC-19: Suppressed TSH (<0.1) + Low FT4 (<0.8) classifies CENTRAL_HYPOTHYROIDISM_SUSPECTED, NOT hyperthyroidism", () => {
    const rev = evaluateReversibleAxis({ tsh_uIU_mL: 0.05, free_t4_ng_dL: 0.65 });
    assert.ok(rev.categories.includes("CENTRAL_HYPOTHYROIDISM_SUSPECTED"));
    assert.ok(!rev.categories.includes("HYPERTHYROIDISM_THYROTOXICOSIS"));
    assert.ok(!rev.categories.includes("SUBCLINICAL_HYPERTHYROIDISM_WATCH"));
  });

  it("TC-20: Isolated low TSH (<0.4) with normal/absent FT4 classifies SUBCLINICAL_HYPERTHYROIDISM_WATCH, NOT thyrotoxicosis", () => {
    const revNormalFt4 = evaluateReversibleAxis({ tsh_uIU_mL: 0.08, free_t4_ng_dL: 1.2 });
    const revNoFt4 = evaluateReversibleAxis({ tsh_uIU_mL: 0.08 });
    assert.ok(revNormalFt4.categories.includes("SUBCLINICAL_HYPERTHYROIDISM_WATCH"));
    assert.ok(!revNormalFt4.categories.includes("HYPERTHYROIDISM_THYROTOXICOSIS"));
    assert.ok(revNoFt4.categories.includes("SUBCLINICAL_HYPERTHYROIDISM_WATCH"));
  });

  it("TC-21: Isolated Calcium abnormalities trigger dedicated metabolic flags instead of METABOLIC_NORMAL", () => {
    const mildHigh = evaluateReversibleAxis({ calcium_mg_dL: 11.2 });
    const severeHigh = evaluateReversibleAxis({ calcium_mg_dL: 12.6 });
    const lowCa = evaluateReversibleAxis({ calcium_mg_dL: 7.9 });
    assert.ok(mildHigh.categories.includes("HYPERCALCEMIA"));
    assert.ok(!mildHigh.categories.includes("METABOLIC_NORMAL"));
    assert.ok(severeHigh.categories.includes("HYPERCALCEMIA"));
    assert.ok(lowCa.categories.includes("HYPOCALCEMIA"));
  });

  it("TC-22: Isolated eGFR (<60 or <15) evaluates renal axis even when serum creatinine is omitted", () => {
    const modEgfr = evaluateReversibleAxis({ egfr_mL_min: 48 });
    const sevEgfr = evaluateReversibleAxis({ egfr_mL_min: 12 });
    assert.ok(modEgfr.categories.includes("RENAL_IMPAIRMENT"));
    assert.ok(!modEgfr.categories.includes("METABOLIC_NORMAL"));
    assert.ok(sevEgfr.categories.includes("SEVERE_RENAL_FAILURE_UREMIC_RISK"));
  });

  it("TC-23: Non-literate education-adjusted Animal Naming cutoff (0 yrs <9 vs >=1 yr <10) and partial recall watch", () => {
    assert.equal(getAnimalNamingThreshold(0), 9);
    assert.equal(getAnimalNamingThreshold(4), 10);

    const noEduPass = stratifyCognitiveRisk({
      age: 78,
      yearsOfEducation: 0,
      isNonLiteratePathway: true,
      ad8Score: 0,
      delayedRecallScore: 2,
      cdtResult: null,
      animalNamingCount: 9,
    });
    assert.equal(noEduPass.axes.cognitiveAxis, "COGNITIVE_NORMAL");
    assert.ok(noEduPass.clinicalFlags.some(f => f.includes("[NON-LITERATE PATHWAY WATCH]")));

    const primaryEduFail = stratifyCognitiveRisk({
      age: 78,
      yearsOfEducation: 4,
      isNonLiteratePathway: true,
      ad8Score: 0,
      delayedRecallScore: 2,
      cdtResult: null,
      animalNamingCount: 9,
    });
    assert.equal(primaryEduFail.axes.cognitiveAxis, "COGNITIVE_SCREEN_POSITIVE_NEEDS_IADL_WORKUP");
  });

  it("TC-24: AD8 'Unsure' (NA) protection blocks >=3 unsure answers and warns on 1-2 unsure answers", () => {
    const blocked = stratifyCognitiveRisk({
      age: 75,
      ad8Score: 0,
      ad8UnsureCount: 3,
      delayedRecallScore: 3,
      cdtResult: "NORMAL",
    });
    assert.equal(blocked.isComplete, false);
    assert.ok(blocked.missingDomainsTh.some(m => m.includes("ไม่แน่ใจ")));

    const warned = stratifyCognitiveRisk({
      age: 75,
      ad8Score: 0,
      ad8UnsureCount: 2,
      delayedRecallScore: 3,
      cdtResult: "NORMAL",
    });
    assert.equal(warned.isComplete, true);
    assert.ok(warned.clinicalFlags.some(f => f.includes("[AD8 UNSURE WARNING]")));
  });

  it("TC-25: Lab alias normalization (folate_ng_mL, serum_creatinine_mg_dL, alt_U_L, ast_U_L) matches canonical evaluation", () => {
    const aliased = normalizeLabResults({
      folate_ng_mL: 1.5,
      serum_creatinine_mg_dL: 1.8,
      alt_U_L: 120,
      ast_U_L: 110,
    });
    assert.equal(aliased.serum_folate_ng_mL, 1.5);
    assert.equal(aliased.creatinine_mg_dL, 1.8);
    assert.equal(aliased.alt_u_L, 120);
    assert.equal(aliased.ast_u_L, 110);

    const revAliased = evaluateReversibleAxis(aliased);
    assert.ok(revAliased.categories.includes("FOLATE_DEFICIENCY"));
    assert.ok(revAliased.categories.includes("RENAL_IMPAIRMENT"));
    assert.ok(revAliased.categories.includes("HEPATIC_IMPAIRMENT_WATCH"));
  });

  it("TC-26: Normal assessment still produces explicit clinicalFlags[] for audit transparency", () => {
    const normal = stratifyCognitiveRisk({
      age: 68,
      ad8Score: 0,
      delayedRecallScore: 3,
      cdtResult: "NORMAL",
    });
    assert.equal(normal.axes.cognitiveAxis, "COGNITIVE_NORMAL");
    assert.ok(Array.isArray(normal.clinicalFlags) && normal.clinicalFlags.length > 0);
  });

  it("TC-27: LOINC_DATA_MAPPING catalog contains 27 unique parameters (20 Exact, 3 Closest, 4 Local) with 0 LP* codes", () => {
    const unique = new Map();
    for (const def of Object.values(LOINC_DATA_MAPPING)) {
      assert.ok(!/^LP\d+-\d+$/i.test(def.loincCode), `Forbidden LP* code: ${def.loincCode}`);
      const key = `${def.loincCode}|${def.codeSystem}`;
      if (!unique.has(key)) unique.set(key, def);
    }
    assert.equal(unique.size, 27);
    const counts = { EXACT_LOINC: 0, CLOSEST_MATCH: 0, LOCAL_CODESYSTEM: 0 };
    for (const def of unique.values()) counts[def.mappingType]++;
    assert.equal(counts.EXACT_LOINC, 20);
    assert.equal(counts.CLOSEST_MATCH, 3);
    assert.equal(counts.LOCAL_CODESYSTEM, 4);
  });

  it("TC-28: buildFhirR4Bundle output passes validateFhirR4Bundle and round-trips via parseFhirBundleToLabResults", () => {
    const input = {
      age: 74,
      ad8Score: 4,
      delayedRecallScore: 1,
      cdtResult: "ABNORMAL",
      briefIADL: evaluateBriefIADL(true, false, false, false),
      labs: {
        tsh_uIU_mL: 0.05,
        free_t4_ng_dL: 0.65,
        calcium_mg_dL: 11.4,
        egfr_mL_min: 54,
        apoe_genotype: "e3/e4",
        plasma_ptau217_pg_mL: 0.62,
        abeta_42_40_ratio: 0.068,
      },
    };
    const out = stratifyCognitiveRisk(input);
    const bundle = buildFhirR4Bundle(input, out, { timestampIso: "2026-11-13T10:00:00Z" });
    const validation = validateFhirR4Bundle(bundle);
    assert.equal(validation.valid, true, validation.errors.join("; "));
    assert.equal(validation.summary.partCodeViolations, 0);

    const parsed = parseFhirBundleToLabResults(bundle);
    assert.equal(parsed.plasma_ptau217_pg_mL, 0.62);
    assert.equal(parsed.abeta_42_40_ratio, 0.068);
    assert.equal(parsed.apoe_genotype, "e3/e4");
    assert.equal(parsed.egfr_mL_min, 54);
  });

  it("TC-29: All FHIR R4 sample bundles in samples/ pass validateFhirR4Bundle with 0 LP* Part codes", () => {
    const samplesDir = path.resolve("samples");
    const files = fs.readdirSync(samplesDir).filter(f => f.endsWith(".json"));
    assert.ok(files.length >= 3);
    for (const file of files) {
      const bundle = JSON.parse(fs.readFileSync(path.join(samplesDir, file), "utf8"));
      const validation = validateFhirR4Bundle(bundle);
      assert.equal(validation.valid, true, `${file} failed validation: ${validation.errors.join("; ")}`);
      assert.equal(validation.summary.partCodeViolations, 0, `${file} contains LP* Part code`);
      assert.ok(FHIR_LOCAL_CODE_SYSTEM.startsWith("https://natchlimar-droid.github.io/Project-Alzheimer/"));
    }
  });
});
