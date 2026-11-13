# Clinical Decision Support (CDS) & System Architecture Specification

เอกสารฉบับนี้อธิบายสถาปัตยกรรมการประมวลผลทางคลินิก (Clinical Informatics Architecture) ของระบบคัดกรองความเสี่ยงภาวะสมองรู้คิดบกพร่องและอัลไซเมอร์เบื้องต้น (**Multimodal Cognitive Screening & Biomarker-Informed Triage System**)

---

## 1. แผนผังลำดับชั้นการตัดสินใจทางคลินิก (Hierarchical Stratification Flowchart)

```mermaid
flowchart TD
    Start["เริ่มต้นการคัดกรอง (Patient & Informant Intake)"] --> Gatekeeper2Q["ด่านคัดกรองซึมเศร้า 2Q (LOINC 44255-8, 44250-9)"]
    Gatekeeper2Q -->|"ตอบ 'มี' >= 1 ข้อ"| FlagDep["บันทึก depression_risk_flag = true\nแจ้งเตือนแพทย์เรื่อง Pseudodementia & แนะนำตรวจ 9Q"]
    Gatekeeper2Q -->|"ตอบ 'ไม่มี' ทั้ง 2 ข้อ"| FlagNoDep["depression_risk_flag = false"]

    FlagDep --> ACBCheck["คัดกรองรายการยาประจำ (ACB Scale: Local CodeSystem acb-total-score)"]
    FlagNoDep --> ACBCheck
    ACBCheck --> Mod1["โมดูลที่ 1: แบบประเมินญาติ AD8 (0-8 คะแนน)"]

    Mod1 --> Mod2["โมดูลที่ 2: Mini-Cog & Speech Telemetry\n1) Word Registration (ล็อกหน้าจอ 5 วินาที)\n2) Clock Drawing Test 11:10 น. + กรอง Motor Tremor ออก\n3) Delayed Recall (0-3 คะแนน)\n4) Audio Speech Biomarkers (Pause Ratio, Latency, Repetition)"]
    Mod2 --> Calib["โหมดฝึกหัดแตะหน้าจอ 3 จุด (1 -> ก -> 2)\nวัดค่า baselineTouchLatencyMs เพื่อชดเชยความคุ้นเคยอุปกรณ์"]
    Calib --> Mod3["โมดูลที่ 3: Visual-Motor Task 8 จุด\n(1 -> ก -> 2 -> ข -> 3 -> ค -> 4 -> ง)\nคำนวณเวลาสุทธิหลังชดเชย + UX ป้องกัน Frustration"]
    Mod3 --> Mod4["โมดูลที่ 4: ผลตรวจทางห้องปฏิบัติการ (LOINC / FHIR R4)"]

    Mod4 --> Tier1{"Tier 1: พบสาเหตุที่รักษา/ปรับลดได้หรือไม่?\n- High ACB Burden (acbTotalScore >= 3) หรือ\n- B12 < 200 pg/mL หรือ TSH > 4.5 / < 0.4 หรือ Na ผิดปกติ"}
    Tier1 -->|"พบ"| OutRev["REVERSIBLE_FLAG\nส่งพบอายุรแพทย์/เภสัชกรคลินิกเพื่อรักษาสาเหตุเมตาบอลิก\nและปรับลดยา (Deprescribing) เป็นลำดับแรก"]
    Tier1 -->|"ไม่พบ"| Tier2{"Tier 2: ผลบวก AD Biomarker\n(p-tau217 POSITIVE หรือ Aβ42/40 < 0.065)\nร่วมกับความบกพร่องทางการรู้คิด?"}

    Tier2 -->|"พบ"| OutAD["VERY_HIGH_ALZHEIMERS\nส่งต่อแพทย์ระบบประสาท / Memory Clinic โดยเร็ว"]
    Tier2 -->|"ไม่พบ"| LongCheck["คำนวณอัตราการเปลี่ยนแปลงระยะยาว (Δ-Decline Rate)\nเทียบกับ previous_session_id (ถ้ามี)"]

    LongCheck --> Tier3{"Tier 3: ประเมินความเสี่ยงพหุโมดูล"}
    Tier3 -->|"Mini-Cog บวก + (AD8 >= 2 หรือ TMT ผิดปกติ)\nหรือ Rapid Δ-Decline หรือคะแนนรวม >= 55%"| OutHigh["HIGH RISK\nส่งปรึกษาแพทย์ระบบประสาท / จิตแพทย์ผู้สูงอายุ"]
    Tier3 -->|"พบความผิดปกติบางส่วน หรือ 2Q บวก หรือ Speech MCI บวก\nหรือ p-tau217 ก้ำกึ่ง หรือคะแนน 25-54%"| OutMod["MODERATE RISK\nตรวจคัดกรองเลือดพื้นฐาน ควบคุมปัจจัยหลอดเลือด นัดติดตาม 3-6 เดือน"]
    Tier3 -->|"ปกติทุกโมดูล (< 25%)"| OutLow["LOW RISK\nส่งเสริมสุขภาพสมองและตรวจคัดกรองซ้ำประจำปี"]
```

---

## 2. สมการการปรับเทียบความคุ้นเคยหน้าจอสัมผัส (Device Touch Calibration Formula)

ผู้สูงอายุอาจไม่คุ้นเคยกับการใช้นิ้วแตะหน้าจอสัมผัส (Touchscreen Motor Unfamiliarity) ทำให้ใช้เวลาใน Visual-Motor Task นานขึ้นโดยไม่ได้เกิดจากภาวะ Executive Dysfunction ระบบจึงกำหนดให้ทำ **Practice Mode 3 จุด (`1 -> ก -> 2`)** ก่อนเริ่มจับเวลาจริง:

1. วัดค่าความหน่วงเฉลี่ยต่อการแตะในโหมดฝึกหัด:
   $$\text{baselineTouchLatencyMs} = \frac{t_{\text{ก} \leftarrow 1} + t_{2 \leftarrow \text{ก}}}{2}$$
2. หาก $\text{baselineTouchLatencyMs} > 1,500\text{ ms}$ ระบบจะคำนวณค่าชดเชยเวลาสำหรับ 7 ช่วงการเคลื่อนที่ในแบบทดสอบจริง (เพดานสูงสุดไม่เกิน $18,000\text{ ms}$):
   $$\text{calibrationAllowanceMs} = \min\Big(18000,\ \text{round}\big((\text{baselineTouchLatencyMs} - 1500) \times 7 \times 0.65\big)\Big)$$
3. เวลาสุทธิที่ใช้ตัดสินความเสี่ยง (Calibrated Net Completion Time):
   $$\text{calibratedNetTimeMs} = \max\big(1000,\ \text{visualMotorTimeMs} - \text{calibrationAllowanceMs}\big)$$
4. เกณฑ์เวลามาตรฐานปรับตามอายุและระดับการศึกษา (`adjustedThresholdMs`):
   $$\text{adjustedThresholdMs} = 45000 + \begin{cases} 12000 & \text{ถ้า } \text{yearsOfEducation} < 6 \\ 0 & \text{กรณีอื่น} \end{cases} + \begin{cases} 10000 & \text{ถ้า } \text{age} \ge 75 \\ 0 & \text{กรณีอื่น} \end{cases}$$

---

## 3. สมการคำนวณอัตราความเปลี่ยนแปลงระยะยาว ($\Delta$-Decline Rate)

เมื่อมีการระบุ `previous_session_id` พร้อมข้อมูลเซสชันก่อนหน้า ระบบจะคำนวณ:

$$\Delta\text{RiskScore} = \text{RiskScore}_{\text{current}} - \text{RiskScore}_{\text{previous}}$$

$$\text{Annualized }\Delta\text{-Decline Rate (\%/year)} = \left(\frac{\Delta\text{RiskScore}}{\max(1, \text{daysElapsed})}\right) \times 365$$

- **`RAPID_DECLINE`**: เมื่อ $\text{Annualized }\Delta\text{-Decline Rate} \ge +25\%/\text{ปี}$ หรือ $\Delta\text{RiskScore} \ge +20\%$ หรือ $\Delta\text{DelayedRecall} \le -2\text{ คำ}$ หรือ $\Delta\text{AD8} \ge +3\text{ คะแนน}$
- **`PROGRESSIVE_DECLINE`**: เมื่อ $\Delta\text{RiskScore} \ge +8\%$ หรือ $\Delta\text{DelayedRecall} \le -1\text{ คำ}$ หรือ $\Delta\text{AD8} \ge +1\text{ คะแนน}$ หรือ $\Delta\text{VisualMotorTime} \ge +10,000\text{ ms}$
- **`STABLE`**: การเปลี่ยนแปลงอยู่ในช่วงความแปรปรวนปกติ
- **`IMPROVED`**: เมื่อ $\Delta\text{RiskScore} \le -8\%$ หรือจำคำศัพท์ได้ดีขึ้น

---

## 4. ไฟล์ตัวอย่าง HL7 FHIR R4 Bundle สำหรับทดสอบนำเข้า (Sample Bundles)

สามารถใช้ไฟล์ในโฟลเดอร์ [`samples/`](../samples/) เพื่อทดสอบปุ่ม **"📂 นำเข้าไฟล์ FHIR R4 Bundle (.json)"** ในโมดูลที่ 4 ได้ทันที:
- [`samples/fhir-reversible-b12-hypothyroid.json`](../samples/fhir-reversible-b12-hypothyroid.json) — ตัวอย่างผลแล็บ FHIR R4 ของผู้ป่วยที่มีภาวะพร่องวิตามิน B12 (`135 pg/mL`, LOINC `2132-9`) และภาวะพร่องฮอร์โมนไทรอยด์ (`TSH = 8.6 uIU/mL`, LOINC `3016-3`; `Free T4 = 0.68 ng/dL`, LOINC `3024-7`)
- [`samples/fhir-alzheimers-ptau217-positive.json`](../samples/fhir-alzheimers-ptau217-positive.json) — ตัวอย่างผลแล็บ FHIR R4 ของผู้ป่วยที่มีผลบวกจำเพาะต่อโรคอัลไซเมอร์ (`Plasma p-tau217 = 0.74 pg/mL`, LOINC `104663-0`; `Aβ42/40 Ratio = 0.048`, LOINC `106941-8`; `APOE = e4/e4`, LOINC `42315-2`)
- [`samples/fhir-acb-speech-tremor.json`](../samples/fhir-acb-speech-tremor.json) — ตัวอย่างผลประเมิน FHIR R4 ของผู้ป่วยที่มีภาระยาต้านโคลิเนอร์จิกสูง (`ACB Total Score = 6`, Project CodeSystem `acb-total-score`), เมทริกซ์เสียงเสี่ยงต่อ MCI (`speech_mci_biomarker_flag = true`, Project CodeSystem `speech-biomarker-exploratory`), และการตรวจพบมือสั่นแบบแยกแยะมิติ (`motor_tremor_flag = true` ร่วมกับ CDT ปกติ) พร้อมระบุรหัสนิรนามตามแนวทาง HIPAA/PDPA Privacy-by-Design (`PSN-E821-4F2A90C1-B739`)

---

## 5. การจัดการภาระยาต้านโคลิเนอร์จิก (Anticholinergic Cognitive Burden: ACB Scale)

ยาที่ผู้สูงอายุรับประทานเป็นประจำหลายกลุ่มมีฤทธิ์ยับยั้งสารสื่อประสาท Acetylcholine ซึ่งจำเป็นต่อการสร้างความจำในสมองส่วนฮิปโปแคมปัส ส่งผลให้เกิด **Drug-Induced Cognitive Impairment (ภาวะสมองตื้อชั่วคราวจากยา)**

ระบบประเมินตาม **ACB Scale**:
- **คะแนน 3 (Definite / High Anticholinergic Activity):** ยาแก้แพ้รุ่นที่ 1 (CPM, Hydroxyzine), ยาต้านซึมเศร้าไตรไซคลิก (Amitriptyline, Nortriptyline), ยาลดการบีบเกร็งกระเพาะปัสสาวะ (Oxybutynin, Tolterodine)
- **คะแนน 2 (Moderate Activity):** Hyoscine-N-butylbromide (Buscopan), Dicyclomine, Orphenadrine
- **คะแนน 1 (Potential / Mild Activity / CNS Depressant):** ยานอนหลับ Benzodiazepines (Lorazepam, Diazepam), Z-drugs

**เกณฑ์การตัดสินใจทางคลินิก (Clinical Rule):**
$$\text{acbTotalScore} = \sum_{m \in \text{Selected}} \text{acbScore}(m)$$
$$\text{high\_acb\_risk\_flag} = \text{true } \iff \text{acbTotalScore} \ge 3$$

เมื่อ `high_acb_risk_flag = true` ระบบจะกำหนดผลเป็น `REVERSIBLE_FLAG` พร้อมข้อเสนอแนะให้แพทย์และเภสัชกรคลินิกดำเนินการ **Deprescribing (การทบทวนและปรับลดยา)** ก่อนที่จะวินิจฉัยโรคสมองเสื่อมถาวร

---

## 6. เมทริกซ์เสียงพูดบ่งชี้ความเสี่ยงระยะก่อนสมองเสื่อม (Speech Biomarkers in MCI)

ระบบรองรับการสกัดคุณลักษณะทางสรีรวิทยาของเสียงพูด (Acoustic & Linguistic Telemetry) ขณะทำแบบทดสอบ Delayed Recall หรือ Category Verbal Fluency:

| เมทริกซ์ (Metric) | คำจำกัดความทางเทคนิค | ค่าเกณฑ์ความผิดปกติ (Cutoff) | นัยสำคัญทางการแพทย์ (Clinical Interpretation) |
| :--- | :--- | :--- | :--- |
| **Pause-to-Speech Ratio** | $\frac{\text{Duration}_{\text{silence}}}{\text{Duration}_{\text{voiced}} + \text{Duration}_{\text{silence}}}$ | $> 0.45$ | ภาวะนึกคำศัพท์ลำบาก (Word-Finding Difficulty / Anomia) พบเด่นชัดในระยะต้นของ MCI |
| **Phonetic Latency** | เวลาหน่วงจากสิ้นสุดคำสั่งจนถึง onset ของพยางค์แรก | $> 2,200\text{ ms}$ | ความเร็วในการประมวลผลและการเข้าถึงคลังคำศัพท์ช้าลง (Slowed Linguistic Processing Speed) |
| **Semantic Repetition** | จำนวนคำศัพท์ที่ผู้ป่วยพูดซ้ำในหมวดหมู่เดียวกัน | $\ge 2\text{ ครั้ง}$ | การบกพร่องของ Working Memory และกระบวนการตรวจทานการตอบสนองตนเอง (Response Monitoring Deficit) |

---

## 7. การแยกแยะ Motor Tremor vs Cognitive Deficit และ Non-Punitive UX

### 7.1 Kinematic Tremor Decomposition ใน Clock Drawing Test (CDT)
ผู้ป่วยสูงอายุจำนวนมากมีภาวะมือสั่นจากความชรา (Senile Tremor) หรือโรคพาร์กินสัน (Parkinsonism) แต่ความจำและมิติสัมพันธ์ยังปกติ หากใช้อัลกอริทึมทั่วไปตรวจจับเฉพาะความเรียบของเส้น ผู้ป่วยกลุ่มนี้จะถูกหักคะแนนเป็น `ABNORMAL` แบบผลบวกลวง

ระบบจึงใช้สมการแยกแยะความสั่น:
1. คำนวณเส้น Smoothed Moving Average ($W = 5$ จุด):
   $$\bar{x}_i = \frac{1}{2k+1}\sum_{j=-k}^k x_{i+j},\quad \bar{y}_i = \frac{1}{2k+1}\sum_{j=-k}^k y_{i+j}$$
2. วัดขนาดความสั่นสะเทือนแบบ Root Mean Square (RMS Jitter):
   $$\text{RMS}_{\text{jitter}} = \sqrt{\frac{1}{N}\sum_{i=1}^N \big((x_i - \bar{x}_i)^2 + (y_i - \bar{y}_i)^2\big)}$$
3. วัดอัตราการเปลี่ยนทิศทางแบบสลับกลับไปมา (Direction Reversal Rate):
   $$\text{reversalRate} = \frac{\sum_{i=2}^{N-1} \mathbb{I}\left((\vec{v}_i \cdot \vec{v}_{i-1}) < 0\right)}{N-2}$$
4. เกณฑ์การตรวจจับ Motor Tremor:
   $$\text{motorTremorDetected} = \text{true } \iff \big(\text{RMS}_{\text{jitter}} \ge 1.75\text{ px}\big) \land \big(\text{reversalRate} \ge 0.22\big)$$
5. **การตัดสินผล:** ระบบนำเส้น Smoothed ไปวิเคราะห์โครงร่างวงกลมและการชี้เข็ม 11:10 น. หากตำแหน่งถูกต้อง ผลการประเมินจะคงเป็น `NORMAL` โดยบันทึก `motor_tremor_flag = true` เพื่อให้แพทย์ทราบอาการมือสั่นแยกต่างหากจากการรู้คิด

### 7.2 การป้องกัน Frustration Trigger ใน Visual-Motor Task
ผู้สูงอายุเมื่อกดผิดซ้ำแล้วมีสัญญาณไฟกะพริบสีแดงหรือเสียงปี๊บดังเตือน ความเครียดเฉียบพลันจะทำให้คอร์ติซอลหลั่งและคะแนนความจำรอบถัดไปลดลง ระบบจึงใช้:
- แอนิเมชันสั่นเตือนนุ่มนวล (`.gentle-nudge`) แทนการกะพริบสีแดงจัด
- จุดเป้าหมายถัดไปจะเรืองแสงสีเขียวอ่อนนวล (`.target-hint-glow`) เป็นเวลา 1.4 วินาทีเพื่อช่วยนำสายตา
- กล่องข้อความแนะแนวที่ใช้ภาษาอบอุ่นและไม่กดดัน

---

## 8. สถาปัตยกรรมความมั่นคงปลอดภัยตามมาตรฐาน HIPAA / PDPA

### 8.1 สถาปัตยกรรมแยกสองสคีมา (Two-Schema Pseudonymization)
```mermaid
flowchart LR
    subgraph PII_Vault["Schema A: Identifiable PII Vault (จัดเก็บแยกเฉพาะ เข้ารหัสเข้มงวด)"]
        A1["ชื่อ-นามสกุลจริง"]
        A2["เลขประจำตัวประชาชน (Masked)"]
        A3["เบอร์โทรศัพท์ (Masked)"]
    end

    Token["Deterministic Pseudonym Token\n(เช่น PSN-E821-4F2A90C1-B739)\nคำนวณด้วย Salt + Hex Hash"]

    subgraph Clinical_Vector["Schema B: De-identified Clinical Screening Vector (IP-Safe / CDSS)"]
        B1["คะแนน AD8 / Mini-Cog / TMT"]
        B2["CDT Kinematics & Speech Biomarkers"]
        B3["ผลแล็บ Biomarkers (LOINC)"]
        B4["ระดับความเสี่ยง Risk Category"]
    end

    PII_Vault <-->|"เชื่อมโยงเฉพาะ Token"| Token
    Token <-->|"อ้างอิงเฉพาะ Token"| Clinical_Vector
```

### 8.2 ห่วงโซ่บันทึกการเข้าถึงข้อมูลที่ไม่สามารถแก้ไขย้อนหลังได้ (Immutable Audit Trail)
ทุกครั้งที่มีการประเมินความเสี่ยง, นำเข้าผลแล็บจาก HIS/LIS, นำเข้า FHIR Bundle หรือส่งออกรายงาน ระบบจะสร้างบันทึก Audit Log ที่มี Hash Chain เชื่อมโยงกัน:

$$\text{CanonicalString}_k = \text{previousHash}_{k-1} \,\|\, \text{timestampIso}_k \,\|\, \text{actorRole}_k \,\|\, \text{actionType}_k \,\|\, \text{sessionId}_k \,\|\, \text{pseudonymToken}_k \,\|\, \text{resourceSummary}_k$$

$$\text{integrityHash}_k = \text{HexHash}\left(\text{CanonicalString}_k\right)$$

หากมีการแก้ไข ลบ หรือสลับลำดับบันทึกใดๆ ห่วงโซ่ `previousHash` $\rightarrow$ `integrityHash` จะขาดออกจากกันทันที ทำให้สามารถตรวจสอบความโปร่งใสและหลักฐานทางเวชระเบียน (Tamper-Evident EMR Auditability) ได้อย่างสมบูรณ์

---

## 9. สถาปัตยกรรม Dual-Persona UX, Paper-to-Digital CDT และระบบส่งต่อ EMR Cloud

### 9.1 การแยกหน้าจอระหว่าง "โหมดผู้สูงอายุ (Patient Mode)" และ "โหมดบุคลากรการแพทย์ (Clinician Mode)"
เพื่อแก้ไขปัญหา **Cognitive Overload** และ **Test Anxiety** (ความเครียดและความกังวลขณะทดสอบ) สถาปัตยกรรมระบบได้แบ่งการแสดงผลออกเป็น 2 มุมมอง (Dual Persona Architecture):

1. **โหมดผู้สูงอายุ / ผู้รับการประเมิน (Senior Patient Mode):**
   - **ซ่อนข้อมูลเชิงเทคนิคและ Telemetry:** ไม่แสดงศัพท์เทคนิคการวิเคราะห์ (เช่น Normative Adjustment, Salted Token Key, Pause-to-Speech Ratio, Kinematic Jerk, LOINC Codes)
   - **ซ่อนการให้คะแนนและตัวเลขแบบ Real-Time:** ป้องกันความเครียดจากการเห็นคะแนนหรือเวลานับถอยหลังขณะทำแบบทดสอบ
   - **การออกแบบฟอนต์และปุ่มขนาดใหญ่พิเศษ (Touch-Friendly WCAG AAA):** ปุ่มมีพื้นที่สัมผัส $\ge 60\times 60$ พิกเซล ตัวอักษรขนาด $\ge 19-24$ พิกเซล พร้อมปุ่มฟังเสียงแนะนำ (Text-to-Speech) ชัดเจนในทุกโมดูล
   - **สรุปผลลัพธ์ที่เป็นมิตรและไม่ข่มขวัญ:** แสดงคำแนะนำที่อบอุ่นและปุ่มพิมพ์เอกสารสำหรับนำไปปรึกษาแพทย์เฉพาะทาง

2. **โหมดบุคลากรทางการแพทย์ (Staff / Clinician Mode):**
   - แสดงแดชบอร์ดทางคลินิกครบทั้ง 4 มิติ (4-Axis Parallel Model)
   - แสดงตัวชี้วัดจลนศาสตร์การวาด (CDT Kinematics & Tremor Vectors) และตัวชี้วัดเสียง (Speech Telemetry)
   - โมดูลนำเข้า-ส่งออกผลตรวจแล็บผ่าน LIS / FHIR DiagnosticReport
   - ระบบบันทึกดุลยพินิจของแพทย์ (Clinician Override) พร้อมเลขที่ใบอนุญาตประกอบวิชาชีพเวชกรรม (ว.)
   - การจัดพิมพ์เอกสารทางการแพทย์มาตรฐานองค์กร A4 (Corporate Print Layout)

### 9.2 การแก้ไขปัญหาความฝืดของอุปกรณ์ (Hardware Friction) ด้วยระเบียบวิธี Paper-to-Digital CDT
การทำแบบทดสอบ Clock Drawing Test ด้วยเมาส์คอมพิวเตอร์ (Mouse-drawn) จะสูญเสียความแม่นยำด้าน Fine-motor control อย่างสิ้นเชิง และสร้างความหงุดหงิดให้กับผู้สูงอายุ ระบบจึงพัฒนาระเบียบวิธี 2 ทางเลือก:
- **ทางเลือกที่ 1 (Touchscreen / Stylus):** ใช้งานบน Tablet หรือหน้าจอสัมผัสที่มีปากกา Stylus
- **ทางเลือกที่ 2 (Paper-to-Digital Photo Upload - แนะนำสำหรับผู้สูงอายุ):**
  1. ให้ผู้รับการประเมินใช้ปากกาหรือดินสอวาดหน้าปัดนาฬิกาวงกลม ตัวเลข 1–12 และเข็ม 11:10 น. ลงบนกระดาษเปล่า A4 ตามมาตรฐานเวชปฏิบัติสากล
  2. เจ้าหน้าที่หรือผู้ดูแลใช้กล้องถ่ายภาพกระดาษวาด หรือเลือกไฟล์ภาพอัปโหลดเข้าสู่ระบบ
  3. ระบบจะแปลงภาพถ่ายเข้าสู่ Canvas Frame พร้อมบันทึกภาพลงในเวชระเบียน FHIR Bundle และให้บุคลากรการแพทย์ตรวจเกณฑ์ 3 ข้อ (12 ตัวเลขครบ, 4 จตุภาคถูกต้อง, เข็ม 11:10) ได้อย่างสะดวก แม่นยำ และเป็นธรรมชาติที่สุด

### 9.3 สถาปัตยกรรมการจัดเก็บข้อมูลติดตามผลระยะยาว (Secure Healthcare Cloud & EMR Referral)
เพื่อก้าวข้ามข้อจำกัดของ Browser LocalStorage (ซึ่งข้อมูลอาจสูญหายเมื่อเปลี่ยนเครื่อง, ล้างประวัติ หรือใช้งานโหมด Incognito) ระบบได้ออกแบบการเชื่อมต่อ Secure Backend API:

```mermaid
flowchart TD
    Client["เว็บแอปพลิเคชันคัดกรอง\n(Client-Side Application)"]
    Gateway["Secure API Gateway\n(TLS 1.3 + mTLS + JWT Bearer Auth)"]
    EMR_Service["Referral & Longitudinal Service\n(FHIR R4 Microservice)"]
    CloudKMS["Cloud KMS / HSM\n(Hardware Encryption Key Management)"]
    DB[("Secure Healthcare Database\n(PostgreSQL with Row-Level Security\n& Encrypted Identifiers)")]
    HospitalEMR["ระบบสารสนเทศโรงพยาบาล\n(Hospital HIS / EMR / PACS)"]

    Client -->|"ส่งออก HL7 FHIR R4 Bundle\n(ServiceRequest + Observations)"| Gateway
    Gateway --> EMR_Service
    EMR_Service <-->|"สร้าง/ถอดรหัส Token แฝง"| CloudKMS
    EMR_Service -->|"จัดเก็บเวชระเบียนระยะยาว\n(Longitudinal Tracking)"| DB
    EMR_Service -->|"ส่งต่อผู้ป่วยเข้า Memory Clinic"| HospitalEMR
```

- **FHIR R4 ServiceRequest:** สร้างแพ็กเกจส่งต่อผู้ป่วย (e-Referral Ticket) ที่มีรหัสมาตรฐาน LOINC ครบถ้วน
- **การจัดลำดับความเร่งด่วน (Triage Priority):** คัดแยกระดับ Routine (นัด 2-4 สัปดาห์), Urgent (พบภาวะขาด B12/ไทรอยด์ หรือ MCI), Emergency/ASAP (พบ Delirium หรือสมองเสื่อมถอยฉับพลัน)
- **การคงอยู่ของข้อมูลระยะยาว (Longitudinal Continuity):** ข้อมูลถูกบันทึกลงฐานข้อมูลระดับโรงพยาบาลที่มีการสำรองข้อมูลตามมาตรฐาน HIPAA / PDPA ทำให้สามารถคำนวณอัตราความเสื่อมถอยต่อปี ($\Delta$-Decline Rate) ในการตรวจซ้ำครั้งถัดไปได้อย่างแม่นยำ ไม่ว่าจะประเมินจากอุปกรณ์ใดก็ตาม


