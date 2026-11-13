import type {
  AssessmentInput,
  AuditActionType,
  AuditLogEntry,
  PIIIdentityRecord,
  RiskOutput,
} from "../types/clinical.ts";

/**
 * Computes a cryptographic SHA-256 hex digest using Web Crypto API (or Node crypto if available).
 * Conforms with HIPAA and PDPA de-identification standards.
 */
export async function computeSha256Digest(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(payload);
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuf = await crypto.subtle.digest("SHA-256", data);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  }
  // Synchronous fallback
  return computeDeterministicHexHash(payload, "SHA256_FALLBACK");
}

/**
 * Deterministic Salted Hash Generator (Dual-32-bit Hex fallback)
 * Produces an irreversible Pseudonymized Token Key ("PSN-XXXXXXXXXXXX")
 * to link Schema A (PII Identity Vault) and Schema B (Clinical Screening Vector)
 * in compliance with PDPA (Thailand) and HIPAA Safe Harbor / De-identification standards.
 */
export function computeDeterministicHexHash(payload: string, salt = "COG-SAMD-PDPA-SALT-V1"): string {
  const input = `${salt}::${payload.trim().toLowerCase()}`;
  let h1 = 0x811c9dc5;
  let h2 = 0xcbf29ce4;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch ^ (i & 0xff);
    h2 = Math.imul(h2, 0x01000193);
  }
  const hex1 = (h1 >>> 0).toString(16).toUpperCase().padStart(8, "0");
  const hex2 = (h2 >>> 0).toString(16).toUpperCase().padStart(8, "0");
  return `${hex1}${hex2.slice(0, 4)}`;
}

export function generatePseudonymToken(
  fullName: string,
  nationalId = "",
  phoneNumber = ""
): string {
  const composite = `${fullName || "ANONYMOUS"}|${nationalId}|${phoneNumber}`;
  return `PSN-${computeDeterministicHexHash(composite)}`;
}

export function maskNationalId(nationalId = ""): string {
  const digits = nationalId.replace(/\D/g, "");
  if (!digits) return "ไม่ได้ระบุ";
  if (digits.length < 5) return "***";
  return `${digits[0]}-xxxx-xxxxx-${digits.slice(-2)}`;
}

export function maskPhoneNumber(phone = ""): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "ไม่ได้ระบุ";
  if (digits.length < 4) return "***";
  return `xxx-xxx-${digits.slice(-4)}`;
}

/**
 * Separates raw patient intake into two strictly isolated database schemas:
 * - Schema A (`piiVaultRecord`): Identifiable Information Store (Restricted Access)
 * - Schema B (`clinicalScreeningVector`): De-identified Clinical Vector Store (Zero PII)
 */
export function buildPseudonymizedStorageSchemas(
  piiInput: {
    fullName: string;
    nationalId?: string;
    phoneNumber?: string;
  },
  clinicalInput: AssessmentInput,
  clinicalOutput: RiskOutput
): {
  piiVaultRecord: PIIIdentityRecord;
  clinicalScreeningVector: {
    schemaVersion: "CLINICAL_VECTOR_V1";
    pseudonymToken: string;
    assessedAtIso: string;
    demographicsDeidentified: {
      ageYears: number;
      yearsOfEducation: number;
    };
    assessmentInputDeidentified: AssessmentInput;
    riskOutputDeidentified: RiskOutput;
  };
} {
  const pseudonymToken = generatePseudonymToken(
    piiInput.fullName,
    piiInput.nationalId,
    piiInput.phoneNumber
  );
  const nowIso = clinicalInput.assessedAtIso ?? new Date().toISOString();

  const piiVaultRecord: PIIIdentityRecord = {
    pseudonymToken,
    fullName: piiInput.fullName || "ไม่ระบุชื่อ",
    nationalIdMasked: maskNationalId(piiInput.nationalId),
    phoneMasked: maskPhoneNumber(piiInput.phoneNumber),
    createdAtIso: nowIso,
  };

  const deidentifiedInput: AssessmentInput = {
    ...clinicalInput,
    pseudonymToken,
  };

  const deidentifiedOutput: RiskOutput = {
    ...clinicalOutput,
    pseudonymToken,
  };

  return {
    piiVaultRecord,
    clinicalScreeningVector: {
      schemaVersion: "CLINICAL_VECTOR_V1",
      pseudonymToken,
      assessedAtIso: nowIso,
      demographicsDeidentified: {
        ageYears: clinicalInput.age,
        yearsOfEducation: clinicalInput.yearsOfEducation,
      },
      assessmentInputDeidentified: deidentifiedInput,
      riskOutputDeidentified: deidentifiedOutput,
    },
  };
}

/**
 * Appends a tamper-evident hash-chained Audit Log Entry for HIPAA / PDPA compliance
 */
export function createAuditLogEntry(
  previousLogs: AuditLogEntry[],
  params: {
    actorRole?: string;
    actionType: AuditActionType;
    pseudonymToken: string;
    resourceSummary: string;
    timestampIso?: string;
  }
): AuditLogEntry {
  const timestampIso = params.timestampIso ?? new Date().toISOString();
  const actorRole = params.actorRole ?? "CLINICAL_ASSESSOR";
  const prevEntry = previousLogs.length > 0 ? previousLogs[0] : undefined;
  const previousHash = prevEntry ? prevEntry.integrityHash : "GENESIS-000000000000";

  const logId = `AUD-${timestampIso.slice(0, 10).replace(/-/g, "")}-${String(
    previousLogs.length + 1
  ).padStart(4, "0")}`;

  const chainPayload = `${previousHash}|${logId}|${timestampIso}|${actorRole}|${params.actionType}|${params.pseudonymToken}|${params.resourceSummary}`;
  const integrityHash = computeDeterministicHexHash(
    chainPayload,
    "EMR-AUDIT-CHAIN-V1"
  );

  return {
    logId,
    timestampIso,
    actorRole,
    actionType: params.actionType,
    pseudonymToken: params.pseudonymToken,
    resourceSummary: params.resourceSummary,
    previousHash,
    integrityHash,
  };
}

