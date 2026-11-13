import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stripTypeScriptTypes } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

const SOURCE_FILES = [
  "src/types/clinical.ts",
  "src/data/clinicalContent.ts",
  "src/engine/cdtAnalyzer.ts",
  "src/engine/riskStratification.ts",
  "src/services/fhirService.ts",
  "src/services/privacyAuditService.ts",
];

const EXPORTED_SYMBOLS = [
  // clinical.ts
  "ALGORITHM_VERSION",
  // clinicalContent.ts
  "PRE_TEST_VALIDITY_ITEMS",
  "FOUR_AT_DELIRIUM_ITEMS",
  "calculate4ATDelirium",
  "BRIEF_IADL_ITEMS",
  "evaluateBriefIADL",
  "ACB_MEDICATIONS",
  "DEPRESSION_2Q_QUESTIONS",
  "AD8_QUESTIONS",
  "MINICOG_WORD_SETS",
  "SAMD_DISCLAIMER_TH",
  "FHIR_LOCAL_CODE_SYSTEM",
  "LOINC_DATA_MAPPING",
  // cdtAnalyzer.ts
  "smoothStrokeForTremor",
  "detectMotorTremorFromStrokes",
  "analyzeClockDrawingStrokes",
  // riskStratification.ts
  "normalizeLabResults",
  "getAnimalNamingThreshold",
  "CLINICAL_THRESHOLDS",
  "evaluatePreTestValidity",
  "evaluateMiniCog",
  "evaluateAnticholinergicBurden",
  "evaluateVisualMotorTaskExperimental",
  "evaluateSpeechBiomarkers",
  "evaluateReversibleAxis",
  "evaluateBiomarkerAxis",
  "calculateLongitudinalDelta",
  "stratifyCognitiveRisk",
  // fhirService.ts
  "PROJECT_FHIR_BASE_URL",
  "CLINICAL_LOINC_CODES",
  "buildFhirR4Bundle",
  "exportFhirJsonString",
  "parseFhirBundleToLabResults",
  "validateFhirR4Bundle",
  // privacyAuditService.ts
  "computeSha256Digest",
  "computeDeterministicHexHash",
  "generatePseudonymToken",
  "maskNationalId",
  "maskPhoneNumber",
  "buildPseudonymizedStorageSchemas",
  "createAuditLogEntry",
];

function stripModuleImportsAndExports(jsCode) {
  let out = jsCode;
  // Remove multi-line or single-line ESM import statements
  out = out.replace(/^\s*import\s+(?:type\s+)?[\s\S]*?from\s+["'][^"']+["'];?\s*$/gm, "");
  // Remove re-export blocks like `export { calculate4ATDelirium, evaluateBriefIADL };`
  out = out.replace(/^\s*export\s*\{[^}]+\};?\s*$/gm, "");
  // Remove `export ` keyword before declarations
  out = out.replace(/^\s*export\s+(?=(?:async\s+)?function\b|const\b|let\b|var\b|class\b)/gm, "");
  // Trim excessive blank lines
  out = out.replace(/\n{4,}/g, "\n\n\n");
  return out.trim();
}

function buildCombinedBody() {
  const chunks = [];
  for (const relPath of SOURCE_FILES) {
    const absPath = path.join(ROOT_DIR, relPath);
    const tsCode = fs.readFileSync(absPath, "utf8");
    const jsStripped = stripTypeScriptTypes(tsCode, { mode: "strip" });
    const cleaned = stripModuleImportsAndExports(jsStripped);
    chunks.push(`// ===== SOURCE: ${relPath.replace(/\\/g, "/")} =====\n${cleaned}`);
  }
  return chunks.join("\n\n");
}

function generateArtifacts() {
  const header = [
    "/**",
    " * AUTO-GENERATED SINGLE-SOURCE-OF-TRUTH CLINICAL ENGINE BUNDLE",
    " * Generated from src/ TypeScript modules via scripts/build-engine.mjs",
    " * DO NOT EDIT MANUALLY — edit src/ and run `node scripts/build-engine.mjs`.",
    " */",
  ].join("\n");

  const body = buildCombinedBody();
  const exportList = EXPORTED_SYMBOLS.join(",\n  ");

  const esmContent = `${header}\n\n${body}\n\nexport {\n  ${exportList},\n};\n`;

  const browserContent = `${header}\n(function (globalScope) {\n  "use strict";\n\n${body
    .split("\n")
    .map((line) => (line ? "  " + line : ""))
    .join("\n")}\n\n  const ClinicalEngine = {\n    ${EXPORTED_SYMBOLS.join(",\n    ")},\n  };\n\n  if (typeof globalScope !== "undefined") {\n    globalScope.ClinicalEngine = ClinicalEngine;\n  }\n  if (typeof module !== "undefined" && module.exports) {\n    module.exports = ClinicalEngine;\n  }\n})(typeof window !== "undefined" ? window : globalThis);\n`;

  return { esmContent, browserContent };
}

function main() {
  const isCheckMode = process.argv.includes("--check");
  const distDir = path.join(ROOT_DIR, "dist");
  const esmPath = path.join(distDir, "clinical-engine.mjs");
  const browserPath = path.join(distDir, "clinical-engine.js");

  const { esmContent, browserContent } = generateArtifacts();

  if (isCheckMode) {
    if (!fs.existsSync(esmPath) || !fs.existsSync(browserPath)) {
      console.error("❌ dist/clinical-engine.{js,mjs} missing. Run `node scripts/build-engine.mjs`.");
      process.exit(1);
    }
    const curEsm = fs.readFileSync(esmPath, "utf8").replace(/\r\n/g, "\n");
    const curBrowser = fs.readFileSync(browserPath, "utf8").replace(/\r\n/g, "\n");
    if (curEsm !== esmContent.replace(/\r\n/g, "\n") || curBrowser !== browserContent.replace(/\r\n/g, "\n")) {
      console.error("❌ dist/clinical-engine.{js,mjs} is out of date with src/! Run `node scripts/build-engine.mjs`.");
      process.exit(1);
    }
    console.log("✅ dist/clinical-engine.mjs & dist/clinical-engine.js are in sync with src/ (41 exports).");
    return;
  }

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.writeFileSync(esmPath, esmContent, "utf8");
  fs.writeFileSync(browserPath, browserContent, "utf8");
  console.log(`✅ Built ${path.relative(ROOT_DIR, esmPath)} (${esmContent.length} bytes)`);
  console.log(`✅ Built ${path.relative(ROOT_DIR, browserPath)} (${browserContent.length} bytes)`);
}

main();
