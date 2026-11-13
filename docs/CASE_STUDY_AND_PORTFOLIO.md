# UX & Product Case Study + Clinical Architecture Deep Dive

> เอกสารฉบับนี้รวบรวมรายละเอียดด้าน Product Thinking, Human-Centered Healthcare UX, กลไกความปลอดภัยทางคลินิก และบทสรุปสำหรับ Portfolio / Resume ของระบบ **Thai Cognitive Triage CDSS (Project Alzheimer)** — สามารถกลับไปดูภาพรวมเชิงวิศวกรรมและตารางรหัส LOINC ได้ที่ [`README.md`](../README.md)

---

## 1. Executive Summary & Clinical Rationale

ระบบ **Thai Cognitive Triage CDSS** พัฒนาขึ้นเพื่อเป็นต้นแบบแนวคิด (Prototype Concept) แก้ปัญหาคอขวดด้านการคัดกรองภาวะรู้คิดบกพร่องในผู้สูงอายุไทย:

1. **Delayed Triage (มาตรวจเมื่อสายเกินช่วง Golden Window):** ผู้สูงอายุมักมาพบแพทย์เมื่อมีอาการระดับ Moderate–Severe Dementia แล้ว การออกแบบคัดกรองด่านหน้าจึงยึดเป้าหมายเชิงแนวคิดแบบ **High-Sensitivity Triage Design Goal** เพื่อส่งต่อเคสเสี่ยงเข้าประเมินยืนยันได้ทันท่วงที
2. **Misrouting Reversible Causes (แยกสาเหตุที่รักษาหายได้ไม่ออก):** ภาวะเพ้อเฉียบพลัน (Delirium), ภาวะซึมเศร้า (Pseudodementia), ยากลุ่มต้านโคลิเนอร์จิก (Anticholinergic Burden), ไทรอยด์ผิดปกติ, ขาดวิตามินบี 12, แคลเซียมผิดปกติ หรือไตเสื่อม อาจทำให้คะแนนความจำต่ำลงชั่วคราว จึงต้องประเมินแบบคู่ขนาน (Parallel Multi-Axis) แทนการบดบังกัน
3. **White-Coat & Educational Inequity (ความกังวลและอคติทางการศึกษา):** หน้าจอที่ซับซ้อน นาฬิกาจับเวลาเป็นมิลลิวินาที หรือคำถามบังคับเขียนตัวเลข/พยัญชนะในผู้สูงอายุที่ไม่ได้เรียนหนังสือ ทำให้เกิดความเครียดและความคลาดเคลื่อนในการคัดกรอง

---

## 2. Human-Centered Design Thinking (Dual-Persona Architecture)

### ก. โหมดผู้สูงอายุ (Senior Patient Wizard — Zero-Friction UX)
- **1 Screen = 1 Task:** แสดงทีละ 1 คำถามด้วยภาษาพูดที่สุภาพ พร้อมปุ่ม **ฟังเสียงคำถาม (Thai Web Speech TTS)**
- **Targeting WCAG 2.1 Level AAA:** ข้อความขนาดใหญ่ 19–24 px, อัตราส่วนความคมชัดเป้าหมาย >= 7:1, และปุ่มสัมผัสขนาดใหญ่พิเศษ (`>= 60x60 px`) รองรับอาการมือสั่นหรือสายตาผู้สูงวัย
- **ซ่อน Telemetry เชิงเทคนิคทั้งหมด:** ค่าเวลา Latency (ms), Velocity (px/s), และคำเตือนผลแล็บจะไม่ปรากฏในโหมดผู้ป่วย เพื่อลด Test Anxiety

### ข. โหมดแพทย์และบุคลากร (Clinician Workstation)
- แสดง **4-Axis Parallel Breakdown**, Radar Chart 5 มิติ, Kinematic Tremor Filter บน Clock Drawing Canvas, Collapsible LIS Biomarker Panel, และ **HL7 FHIR R4 Bundle Export**
- **Portfolio Interactive Evaluators (Floating Demo Bar & UX X-Ray):** ปุ่มลัดมุมขวาล่างโหลดเคสตัวอย่าง 3 รูปแบบ (High-Risk AD, 4AT Delirium Halt, ACB Burden = 6) และเปิด **UX X-Ray Mode** เพื่ออ่านเหตุผลการออกแบบในแต่ละจุดของหน้าจอได้ทันที

---

## 3. Medical Safety & Algorithmic Guardrails

| กลไกความปลอดภัย | หน้าที่ในระบบ | ผลลัพธ์เชิงกระบวนการดูแล |
| :--- | :--- | :--- |
| **1. 4AT Delirium Gatekeeper** | ตรวจระดับความรู้สึกตัวและความสับสนเฉียบพลันก่อนเริ่มทดสอบ | หากคะแนน `4AT >= 4` ระบบสั่ง **Clinical Halt** ระงับการตรวจความจำและเตือนให้ส่งประเมินฉุกเฉิน |
| **2. 2Q Depression Pre-Screen** | ด่านคัดกรองภาวะซึมเศร้าก่อนเข้าสู่โมดูลสมอง | หาก `2Q` ให้ผลบวก ตั้งธงใน Axis 4 เพื่อประเมินด้วย TGDS-15 แยกภาวะ Pseudodementia |
| **3. Spontaneous Free Recall Priority** | คิดคะแนน Mini-Cog ทางการจาก Free Recall (`0–3`) + CDT (`0/2`) | Cued Recognition ถูกบันทึกแยกเป็นข้อมูลวิจัยประกอบการแยก Storage vs Retrieval Deficit เท่านั้น |
| **4. ACB Medication Burden Hierarchy** | ตรวจสอบยาที่มีฤทธิ์ Anticholinergic รวม 27 รายการ | หาก `ACB Score >= 3` รายงานทันทีใน Axis 2 เพื่อทำ Medication Reconciliation |
| **5. Null & Unsure Protection** | ตั้งค่าเริ่มต้นเป็น `null` และติดตามข้อ `ไม่แน่ใจ (NA)` ใน AD8 | หากตอบ AD8 ไม่ครบ หรือตอบ `ไม่แน่ใจ >= 3 ข้อ` ระบบตั้ง `isComplete = false` เพื่อป้องกัน False Negative; `1–2 ข้อ` แสดง `[AD8 UNSURE WARNING]` |
| **6. Non-Literate Alternative Pathway** | สำหรับผู้สูงอายุที่อ่านเขียนไม่ได้หรือไม่ได้รับการศึกษา | ใช้ `Animal Naming` ปรับเกณฑ์ตามปีการศึกษา (`< 9` ตัว สำหรับ `0 ปี` และ `< 10` ตัว สำหรับ `>= 1 ปี`) ร่วมกับ Word Recall (`Composite < 3/5`) แทนการวาดนาฬิกาและ Trail Making |

---

## 4. Parallel 4-Axis Clinical Reporting & Differential Logic

1. **Axis 1 (Cognitive Performance Tier):** `COGNITIVE_NORMAL`, `COGNITIVE_SCREEN_POSITIVE_MCI_SUSPECTED`, `COGNITIVE_SCREEN_POSITIVE_PROBABLE_DEMENTIA`, `COGNITIVE_SCREEN_POSITIVE_NEEDS_IADL_WORKUP`, `INCOMPLETE_DATA`
2. **Axis 2 (Reversible & Drug-Induced Causes):**
   - **ยา:** `HIGH_ACB_BURDEN` (`ACB >= 3`)
   - **ไทรอยด์:** แยก **Central Hypothyroidism** (`FT4 < 0.8 ng/dL` โดย `TSH <= 4.2 uIU/mL` แม้กรณี `TSH < 0.1`), **Overt Hypothyroidism** (`TSH > 10` หรือ `TSH > 4.2` + `FT4 < 0.8`), **Subclinical Hypothyroid Watch** (`TSH 4.2–10.0` + `FT4` ปกติ), **Hyperthyroidism / Thyrotoxicosis** (`TSH < 0.4` ร่วมกับ `FT4 > 1.8 ng/dL`), และ **Subclinical Hyperthyroidism Watch** (`TSH < 0.4` เมื่อ `FT4 <= 1.8` หรือไม่ระบุ `FT4`)
   - **เกลือแร่และเมแทบอลิก:** Vitamin B12 (`< 200` / `200–300 pg/mL`), Folate (`< 2.0` / `2.0–4.0 ng/mL`), Sodium (`< 130` / `< 135` / `> 145 mEq/L`), **Calcium** (`< 8.5` Hypocalcemia / `> 10.5` Hypercalcemia), Glucose, Hemoglobin, ALT/AST, **Creatinine & Standalone eGFR** (`< 15` Severe / `< 60 mL/min/1.73m2` Impairment)
3. **Axis 3 (Alzheimer's Specific Biomarkers):** `AD_BIOMARKER_POSITIVE`, `AD_BIOMARKER_INTERMEDIATE`, `AD_BIOMARKER_NEGATIVE`, `NOT_INDICATED_ASYMPTOMATIC` (ระงับการแปลผลคัดกรองในผู้ที่ผลพุทธิปัญญาปกติ), `UNASSESSED`
4. **Axis 4 (Affective / Depressive Modifiers):** `PSEUDODEMENTIA_RISK_2Q_POSITIVE`, `2Q_NEGATIVE`, `UNASSESSED`

---

## 5. Anticholinergic Cognitive Burden (ACB Scale — 27 Thai-Common Medications)

- **ACB Score = 3 (High Burden):** Amitriptyline, Nortriptyline, Chlorpheniramine (CPM), Hydroxyzine, Diphenhydramine, Dimenhydrinate, Trihexyphenidyl, Oxybutynin, Tolterodine, Imipramine, Doxepin, Clomipramine, Cyproheptadine
- **ACB Score = 2 (Moderate Burden):** Carbamazepine, Baclofen, Cetirizine, Meclizine, Loperamide, Belladonna Alkaloids
- **ACB Score = 1 (Mild / CNS Sedative):** Diazepam, Lorazepam, Alprazolam, Atenolol, Ranitidine, Furosemide, Haloperidol, Risperidone

---

## 6. Portfolio / Resume Summary Snippet

> **Thai Cognitive Triage CDSS (`Project-Alzheimer`) — Healthcare CDSS & HL7 FHIR R4 Prototype**
> - Designed and engineered a dual-persona cognitive screening CDSS prototype separating **Senior Patient Mode** (targets WCAG 2.1 Level AAA typography/touch sizing, telemetry hidden, non-literate verbal fluency pathway) from **Clinician Workstation Mode** (4-axis differential reporting, kinematic tremor smoothing, Clinician Override sign-off).
> - Consolidated core medical triage logic and HL7 FHIR R4 serialization into a modular TypeScript engine (`src/*.ts`) compiled into zero-dependency browser artifacts (`dist/clinical-engine.{mjs,js}`), ensuring 100% logic parity across the web app and automated Node.js CI (`node --test`).
> - Mapped **27 clinical & biomarker parameters** to verified **LOINC** codes (`20 Exact LOINC`, `3 Closest Match`) and a documented **Project FHIR CodeSystem** (`4 Local Concepts`, `0` invalid `LP*` Part codes), verified via automated FHIR R4 round-trip validation.
> - Built `dashboard.html` with a **25-case synthetic registry** and an educational **in-browser Logistic Regression demo** displaying a normalized **100% XAI feature weight breakdown**.
