import {
  ACBMedicationItem,
  FourATDeliriumAssessment,
  BriefIADLAssessment,
  LabResults,
  LoincCodeDefinition,
  PreviousSessionSnapshot,
} from "../types/clinical";

/**
 * Pre-Test Validity Checklist Items
 * Evaluates whether testing is valid or contraindicated/uninterpretable
 */
export interface PreTestValidityItem {
  key: string;
  labelTh: string;
  descriptionTh: string;
  contraindicatedIfTrue: boolean;
}

export const PRE_TEST_VALIDITY_ITEMS: PreTestValidityItem[] = [
  {
    key: "deliriumSuspected",
    labelTh: "1. ภาวะเพ้อเฉียบพลันหรือสับสนฉับพลัน (Active Delirium / 4AT Score >= 4)",
    descriptionTh: "ผู้ป่วยมีอาการสับสนเฉียบพลันในระดับชั่วโมงหรือวัน หรือระดับความรู้สึกตัวเปลี่ยนแปลง (Fluctuating course) — ต้องรักษาภาวะเพ้อก่อน",
    contraindicatedIfTrue: true,
  },
  {
    key: "severeVisualImpairment",
    labelTh: "2. อุปสรรคทางสายตาขั้นรุนแรง (Severe Visual Impairment)",
    descriptionTh: "ผู้ป่วยมองไม่เห็นหน้าจอ ไม่สามารถมองเห็นตัวเลขหรือหน้าปัดนาฬิกาได้แม้สวมแว่นตา — ไม่สามารถแปลผล CDT/Trail ได้",
    contraindicatedIfTrue: true,
  },
  {
    key: "severeHearingImpairment",
    labelTh: "3. อุปสรรคทางการได้ยินขั้นรุนแรง (Severe Hearing Impairment)",
    descriptionTh: "ผู้ป่วยไม่ได้ยินคำสั่งหรือคำศัพท์ 3 คำแม้ใช้เครื่องช่วยฟัง — อาจทำให้เกิดผลลบลวงใน Mini-Cog",
    contraindicatedIfTrue: true,
  },
  {
    key: "acuteSedativeOrIntoxication",
    labelTh: "4. ได้รับยานอนหลับ ยากล่อมประสาท หรือสารกดประสาทภายใน 12 ชั่วโมง",
    descriptionTh: "เพิ่งได้รับ Benzodiazepines, Z-drugs หรือยาแก้แพ้ขนาดสูงก่อนตรวจ — ทำให้ง่วงซึม ความเร็วคิดช้าชั่วคราว",
    contraindicatedIfTrue: true,
  },
  {
    key: "acuteSeverePainOrMedicalIllness",
    labelTh: "5. มีอาการเจ็บปวดรุนแรง หรือเจ็บป่วยทางกายเฉียบพลัน",
    descriptionTh: "เช่น หอบเหนื่อย ไข้สูง ติดเชื้อทางเดินปัสสาวะ หรือปวดเฉียบพลัน — รบกวนสมาธิอย่างรุนแรง",
    contraindicatedIfTrue: true,
  },
  {
    key: "isNonLiteratePathway",
    labelTh: "6. ผู้รับการประเมินไม่รู้หนังสือ / ไม่ได้เรียนหนังสือ (Non-Literate Pathway)",
    descriptionTh: "สำหรับผู้สูงอายุที่ไม่รู้หนังสือหรือไม่คุ้นเคยกับตัวเลข ระบบจะเปิดใช้เส้นทางสำรอง (Verbal Memory + Informant AD8 + Verbal Fluency บอกชื่อสัตว์ 1 นาที) โดยไม่ใช้ Trail/Clock เพื่อป้องกันผลบวกลวง",
    contraindicatedIfTrue: false,
  },
];

/**
 * 4AT Rapid Clinical Test for Delirium (Validated bedside tool)
 */
export const FOUR_AT_DELIRIUM_ITEMS = [
  {
    item: 1,
    titleTh: "1. ระดับความรู้สึกตัว (Alertness)",
    options: [
      { score: 0, textTh: "ปกติ (Normal): รู้สึกตัวดี ตื่นตัวตอบสนองเหมาะสม" },
      { score: 0, textTh: "ง่วงซึมเล็กน้อย (Mild sleepiness): ปลุกตื่นง่ายภายใน 10 วินาที แล้วพูดคุยได้ปกติ" },
      { score: 4, textTh: "ผิดปกติชัดเจน (Clearly abnormal): ซึมมาก ปลุกไม่ค่อยตื่น หรือกระสับกระส่ายสับสนรุนแรง (Hyper/Hypoactive)" },
    ],
  },
  {
    item: 2,
    titleTh: "2. การรับรู้วันเวลาสถานที่ (AMT4: อายุ, วันเกิด, สถานที่, ปี พ.ศ.)",
    options: [
      { score: 0, textTh: "ตอบถูกหมดทั้ง 4 ข้อ (0 errors)" },
      { score: 1, textTh: "ตอบผิด 1 ข้อ (1 error)" },
      { score: 2, textTh: "ตอบผิดตั้งแต่ 2 ข้อขึ้นไป หรือไม่สามารถตอบได้ (>= 2 errors / Untestable)" },
    ],
  },
  {
    item: 3,
    titleTh: "3. สมาธิ (Attention: ท่องชื่อเดือนย้อนหลังจาก ธันวาคม ถอยหลังอย่างน้อย 7 เดือน)",
    options: [
      { score: 0, textTh: "ท่องย้อนหลังถูกต้องได้ตั้งแต่ 7 เดือนขึ้นไป (ธ.ค. -> พ.ย. -> ต.ค. -> ก.ย. -> ส.ค. -> ก.ค. -> มิ.ย.)" },
      { score: 1, textTh: "เริ่มท่องได้แต่น้อยกว่า 7 เดือน หรือมีข้อผิดพลาด (< 7 months)" },
      { score: 2, textTh: "ไม่สามารถทำได้เลย ปฏิเสธ หรือสับสนมาก (Untestable)" },
    ],
  },
  {
    item: 4,
    titleTh: "4. ความเปลี่ยนแปลงฉับพลันหรืออาการขึ้นๆ ลงๆ (Acute Change or Fluctuating Course)",
    options: [
      { score: 0, textTh: "ไม่มี (No): พฤติกรรมและระดับความรู้สึกตัวคงที่ ไม่เปลี่ยนแปลงเร็ว" },
      { score: 4, textTh: "มี (Yes): อาการสับสน ซึม หรือกระวนกระวายเพิ่งเกิดขึ้นภายในชั่วโมงหรือวัน และอาการขึ้นๆ ลงๆ สลับกันในรอบวัน" },
    ],
  },
];

export function calculate4ATDelirium(
  alertness: 0 | 4,
  amt4: 0 | 1 | 2,
  attention: 0 | 1 | 2,
  fluctuation: 0 | 4
): FourATDeliriumAssessment {
  const totalScore = alertness + amt4 + attention + fluctuation;
  const isDeliriumSuspected = totalScore >= 4;
  return {
    alertnessScore: alertness,
    amt4Score: amt4,
    attentionScore: attention,
    acuteFluctuationScore: fluctuation,
    totalScore,
    isDeliriumSuspected,
  };
}

/**
 * 4-Item Brief Thai Instrumental Activities of Daily Living (IADL)
 * Used to differentiate MCI (Preserved IADL = 0 impaired) vs Dementia (Impaired IADL >= 1)
 */
export const BRIEF_IADL_ITEMS = [
  {
    key: "managingFinancesImpaired",
    titleTh: "1. การจัดการการเงินและค่าใช้จ่าย (Managing Finances)",
    questionTh: "มีปัญหาในการจัดการเงิน ซื้อของทอนเงิน หรือจัดการบัญชีธนาคารด้วยตนเองหรือไม่?",
  },
  {
    key: "takingMedicationsImpaired",
    titleTh: "2. การรับประทานยาประจำ (Taking Medications)",
    questionTh: "มีปัญหาในการจัดยาและรับประทานยาประจำตัวให้ถูกต้องตรงเวลาด้วยตนเองหรือไม่?",
  },
  {
    key: "usingPhoneOrTransportImpaired",
    titleTh: "3. การใช้โทรศัพท์หรือการเดินทาง (Telephone & Transportation)",
    questionTh: "มีปัญหาในการกดโทรศัพท์ติดต่อคนคุ้นเคย หรือเดินทางไปสถานที่ใกล้บ้านด้วยตนเองหรือไม่?",
  },
  {
    key: "handlingHouseholdTasksImpaired",
    titleTh: "4. การทำงานบ้านหรือเตรียมอาหาร (Household Tasks)",
    questionTh: "มีปัญหาในการทำงานบ้านง่ายๆ หรือเตรียมอาหารที่เคยทำเป็นประจำด้วยตนเองหรือไม่?",
  },
];

export function evaluateBriefIADL(
  finances: boolean,
  meds: boolean,
  phoneTransport: boolean,
  household: boolean
): BriefIADLAssessment {
  let count = 0;
  if (finances) count++;
  if (meds) count++;
  if (phoneTransport) count++;
  if (household) count++;
  return {
    managingFinancesImpaired: finances,
    takingMedicationsImpaired: meds,
    usingPhoneOrTransportImpaired: phoneTransport,
    handlingHouseholdTasksImpaired: household,
    totalImpairedCount: count,
    isFunctionalDeclinePresent: count >= 1,
  };
}

/**
 * Expanded & Pharmacologically Verified Anticholinergic Cognitive Burden (ACB) Scale
 * Lists individual active pharmaceutical ingredients (APIs) commonly prescribed in Thailand
 * with standard ACB scores (1, 2, 3) based on Boustani et al. and geriatric evidence.
 */
export const ACB_MEDICATIONS: ACBMedicationItem[] = [
  // ACB = 3 (Definite / Severe Anticholinergic Activity)
  {
    id: "MED_CPM",
    genericName: "Chlorpheniramine (CPM)",
    tradeNamesTh: "คลอเฟนิรามีน, ดีคอลเจน, ทิฟฟี่",
    categoryTh: "ยาแก้แพ้รุ่นที่ 1 (1st-Gen Antihistamine)",
    acbScore: 3,
    clinicalNoteTh: "ยับยั้ง M1 receptors ในสมองชัดเจน ทำให้สมองตื้อ สับสน และความจำเสื่อมชั่วคราวในผู้สูงอายุ",
  },
  {
    id: "MED_HYDROXYZINE",
    genericName: "Hydroxyzine",
    tradeNamesTh: "Atarax, ไฮดรอกซีซีน",
    categoryTh: "ยาแก้แพ้/คลายกังวล (1st-Gen Antihistamine)",
    acbScore: 3,
    clinicalNoteTh: "ผ่าน Blood-Brain Barrier ได้ดีมาก ทำให้เกิดอาการง่วงซึมและรบกวนความจำระยะสั้นอย่างมีนัยสำคัญ",
  },
  {
    id: "MED_DIMENHYDRINATE",
    genericName: "Dimenhydrinate",
    tradeNamesTh: "Dramamine, ดรามามีน, ยาแก้เมารถ/แก้วิงเวียน",
    categoryTh: "ยาแก้เมารถ/แก้วิงเวียน (Antiemetic/Antihistamine)",
    acbScore: 3,
    clinicalNoteTh: "ใช้บ่อยมากในผู้สูงอายุไทยที่มีอาการเวียนศีรษะ มีฤทธิ์ anticholinergic สูงมาก เสี่ยงต่อ Delirium และล้ม",
  },
  {
    id: "MED_DIPHENHYDRAMINE",
    genericName: "Diphenhydramine",
    tradeNamesTh: "Benadryl, เบนาดริล",
    categoryTh: "ยาแก้แพ้รุ่นที่ 1 (1st-Gen Antihistamine)",
    acbScore: 3,
    clinicalNoteTh: "ฤทธิ์ต้านโคลิเนอร์จิกสูงมาก เสี่ยงต่อภาวะสับสนเฉียบพลันและปัสสาวะคั่งในผู้สูงอายุ",
  },
  {
    id: "MED_PROMETHAZINE",
    genericName: "Promethazine",
    tradeNamesTh: "Phenergan, ฟีเนอร์แกน",
    categoryTh: "ยาแก้แพ้/แก้อาเจียน (Phenothiazine Antihistamine)",
    acbScore: 3,
    clinicalNoteTh: "ฤทธิ์ต้าน Muscarinic และความง่วงซึมสูงมาก (ACB=3) เสี่ยงทำให้สมองตื้ออย่างรุนแรง",
  },
  {
    id: "MED_CYPROHEPTADINE",
    genericName: "Cyproheptadine",
    tradeNamesTh: "Periactin, ไซโปรเฮปทาดีน",
    categoryTh: "ยาแก้แพ้/กระตุ้นความอยากอาหาร",
    acbScore: 3,
    clinicalNoteTh: "มักใช้เพื่อเจริญอาหารในผู้สูงอายุ แต่มีฤทธิ์ Anticholinergic สูง (ACB=3) ทำให้ความจำถดถอย",
  },
  {
    id: "MED_TRIHEXYPHENIDYL",
    genericName: "Trihexyphenidyl (Artane)",
    tradeNamesTh: "Artane, อาร์เทน",
    categoryTh: "ยารักษาพาร์กินสัน/แก้สั่นจากยาจิตเวช (Antimuscarinic)",
    acbScore: 3,
    clinicalNoteTh: "ฤทธิ์ต้านโคลิเนอร์จิกต่อระบบประสาทส่วนกลางสูงมาก มักเป็นสาเหตุของความจำเสื่อมและประสาทหลอนในผู้สูงอายุ",
  },
  {
    id: "MED_CHLORPROMAZINE",
    genericName: "Chlorpromazine",
    tradeNamesTh: "Largactil, คลอร์โพรมาซีน",
    categoryTh: "ยาต้านโรคจิตรุ่นเก่า (Typical Antipsychotic)",
    acbScore: 3,
    clinicalNoteTh: "ฤทธิ์ต้าน Muscarinic สูงมาก (ACB=3) ทำให้ความดันตกในท่ายืนและสมองประมวลผลช้า",
  },
  {
    id: "MED_AMITRIPTYLINE",
    genericName: "Amitriptyline",
    tradeNamesTh: "Triptanol, อะมิทริปไทลีน",
    categoryTh: "ยาต้านซึมเศร้ากลุ่มไตรไซคลิก (TCA)",
    acbScore: 3,
    clinicalNoteTh: "มักใช้ขนาดต่ำเป็นยาช่วยนอนหลับ/แก้ปวดปลายประสาท แต่มี ACB=3 เสี่ยงต่อ cognitive blunting",
  },
  {
    id: "MED_NORTRIPTYLINE",
    genericName: "Nortriptyline",
    tradeNamesTh: "Nortrilen, นอร์ทริปไทลีน",
    categoryTh: "ยาต้านซึมเศร้ากลุ่มไตรไซคลิก (TCA)",
    acbScore: 3,
    clinicalNoteTh: "แม้ anticholinergic น้อยกว่า amitriptyline เล็กน้อย แต่ยังจัดเป็น ACB=3",
  },
  {
    id: "MED_OXYBUTYNIN",
    genericName: "Oxybutynin",
    tradeNamesTh: "Ditropan, ออกซีบูทินิน",
    categoryTh: "ยารักษาปัสสาวะเล็ด/กระเพาะปัสสาวะไวเกิน (OAB)",
    acbScore: 3,
    clinicalNoteTh: "โมเลกุลขนาดเล็กเข้าสมองได้สูง ทำให้เกิด Drug-Induced Cognitive Impairment ชัดเจน",
  },
  {
    id: "MED_TOLTERODINE",
    genericName: "Tolterodine",
    tradeNamesTh: "Detrusitol, ทอลเทอโรดีน",
    categoryTh: "ยารักษาปัสสาวะไวเกิน (OAB)",
    acbScore: 3,
    clinicalNoteTh: "ฤทธิ์ Antimuscarinic ชัดเจน",
  },
  {
    id: "MED_SOLIFENACIN",
    genericName: "Solifenacin",
    tradeNamesTh: "Vesicare, โซลิเฟนาซิน",
    categoryTh: "ยารักษาปัสสาวะไวเกิน (OAB)",
    acbScore: 3,
    clinicalNoteTh: "แม้ค่อนข้างจำเพาะต่อ M3 แต่ยังคงมีฤทธิ์ต้านโคลิเนอร์จิกต่อระบบประสาทส่วนกลาง",
  },
  {
    id: "MED_PAROXETINE",
    genericName: "Paroxetine",
    tradeNamesTh: "Seroxat, พาแร็กซีทีน",
    categoryTh: "ยาต้านซึมเศร้ากลุ่ม SSRI",
    acbScore: 3,
    clinicalNoteTh: "เป็น SSRI ตัวเดียวที่มีฤทธิ์ Anticholinergic สูงมาก (ACB=3) ต่างจาก sertraline/escitalopram",
  },
  {
    id: "MED_CLOZAPINE",
    genericName: "Clozapine",
    tradeNamesTh: "Clozaril, โคลซาปีน",
    categoryTh: "ยาต้านโรคจิต (Antipsychotic)",
    acbScore: 3,
    clinicalNoteTh: "ฤทธิ์ต้าน Muscarinic และความง่วงซึมสูงมาก",
  },
  {
    id: "MED_OLANZAPINE",
    genericName: "Olanzapine",
    tradeNamesTh: "Zyprexa, โอแลนซาปีน",
    categoryTh: "ยาต้านโรคจิต (Antipsychotic)",
    acbScore: 3,
    clinicalNoteTh: "มีฤทธิ์ต้านโคลิเนอร์จิกสูง (ACB=3) เสี่ยงทำให้สมองตื้อในผู้สูงอายุ",
  },

  // ACB = 2 (Moderate Anticholinergic Activity)
  {
    id: "MED_BUSCOPAN",
    genericName: "Hyoscine butylbromide",
    tradeNamesTh: "Buscopan, บัสโคพาน",
    categoryTh: "ยาลดการบีบเกร็งทางเดินอาหาร (Antispasmodic)",
    acbScore: 2,
    clinicalNoteTh: "มีฤทธิ์ Anticholinergic ปานกลาง (ACB=2) โดยเฉพาะเมื่อใช้ร่วมกับยาอื่น",
  },
  {
    id: "MED_ORPHENADRINE",
    genericName: "Orphenadrine (ร่วมกับ Paracetamol)",
    tradeNamesTh: "Norgesic, นอร์จีสิค",
    categoryTh: "ยาคลายกล้ามเนื้อ (Muscle Relaxant)",
    acbScore: 2,
    clinicalNoteTh: "โครงสร้างคล้าย diphenhydramine มีฤทธิ์ต้านโคลิเนอร์จิกปานกลางถึงสูง",
  },
  {
    id: "MED_BACLOFEN",
    genericName: "Baclofen",
    tradeNamesTh: "Lioresal, บาโคลเฟน",
    categoryTh: "ยาคลายกล้ามเนื้อ (Muscle Relaxant)",
    acbScore: 2,
    clinicalNoteTh: "อาจทำให้เกิดอาการสับสน ง่วงซึม และ cognitive slowing ในผู้สูงอายุ",
  },
  {
    id: "MED_CARBAMAZEPINE",
    genericName: "Carbamazepine",
    tradeNamesTh: "Tegretol, คาร์บามาซีปีน",
    categoryTh: "ยากันชัก/แก้ปวดเส้นประสาท",
    acbScore: 2,
    clinicalNoteTh: "มีฤทธิ์ Anticholinergic ปานกลางและรบกวนระดับเกลือแร่โซเดียม",
  },
  {
    id: "MED_MECLIZINE",
    genericName: "Meclizine",
    tradeNamesTh: "Antivert, เมคลิซีน",
    categoryTh: "ยาแก้อาเจียน/เวียนศีรษะ",
    acbScore: 2,
    clinicalNoteTh: "ฤทธิ์ Anticholinergic ปานกลาง (ACB=2)",
  },

  // ACB = 1 (Potential / Mild Anticholinergic Activity or CNS Depressant)
  {
    id: "MED_LORAZEPAM",
    genericName: "Lorazepam",
    tradeNamesTh: "Ativan, ลอราซีแพม",
    categoryTh: "ยานอนหลับ/คลายกังวล (Benzodiazepine - Intermediate acting)",
    acbScore: 1,
    clinicalNoteTh: "กดประสาทส่วนกลาง รบกวนการบันทึกความจำใหม่ (Anterograde Amnesia) เสี่ยงล้ม",
  },
  {
    id: "MED_DIAZEPAM",
    genericName: "Diazepam",
    tradeNamesTh: "Valium, ไดอะซีแพม",
    categoryTh: "ยานอนหลับ/คลายกล้ามเนื้อ (Benzodiazepine - Long acting)",
    acbScore: 1,
    clinicalNoteTh: "ออกฤทธิ์ยาวนาน มี active metabolites สะสมในผู้สูงอายุ ทำให้ง่วงซึมเรื้อรังและสับสน",
  },
  {
    id: "MED_ALPRAZOLAM",
    genericName: "Alprazolam",
    tradeNamesTh: "Xanax, แอลปราโซแลม",
    categoryTh: "ยาคลายกังวล (Benzodiazepine - Short acting)",
    acbScore: 1,
    clinicalNoteTh: "ทำให้เกิดอาการลืมชั่วขณะ สมาธิถดถอย และติดยาง่ายในผู้สูงอายุ",
  },
  {
    id: "MED_QUETIAPINE",
    genericName: "Quetiapine",
    tradeNamesTh: "Seroquel, เควไทอะปีน",
    categoryTh: "ยาต้านโรคจิต/ช่วยนอนหลับ",
    acbScore: 1,
    clinicalNoteTh: "ตามมาตรฐาน ACB Scale จัดเป็น Score 1 (ต่างจาก Clozapine/Olanzapine ที่เป็น Score 3) แต่ง่วงซึมสูงมากและเสี่ยงต่อ Delirium",
  },
  {
    id: "MED_CETIRIZINE",
    genericName: "Cetirizine",
    tradeNamesTh: "Zyrtec, เซทิริซีน",
    categoryTh: "ยาแก้แพ้รุ่นที่ 2 (2nd-Gen Antihistamine)",
    acbScore: 1,
    clinicalNoteTh: "แม้เป็น 2nd-gen แต่ผ่านเข้าสมองได้บางส่วน (Sedating 2nd-gen) มีฤทธิ์ ACB แฝงระดับ 1",
  },
  {
    id: "MED_RANITIDINE",
    genericName: "Ranitidine / Cimetidine",
    tradeNamesTh: "Zantac, รานิทิดีน",
    categoryTh: "ยาลดกรดกลุ่ม H2-Blocker",
    acbScore: 1,
    clinicalNoteTh: "มีฤทธิ์ต้านโคลิเนอร์จิกแฝงระดับต่ำ",
  },
  {
    id: "MED_FUROSEMIDE",
    genericName: "Furosemide",
    tradeNamesTh: "Lasix, ฟูโรซีไมด์",
    categoryTh: "ยาขับปัสสาวะ (Loop Diuretic)",
    acbScore: 1,
    clinicalNoteTh: "มีฤทธิ์ ACB แฝงระดับต่ำ (ACB=1) และอาจทำให้เสียเกลือแร่โซเดียม",
  },
  {
    id: "MED_CODEINE",
    genericName: "Codeine / Tramadol",
    tradeNamesTh: "โคเดอีน, ทรามาดอล",
    categoryTh: "ยาแก้ปวดกลุ่มโอปิออยด์ (Opioid Analgesic)",
    acbScore: 1,
    clinicalNoteTh: "มีฤทธิ์ต้านโคลิเนอร์จิกระดับต่ำ และกดการทำงานของระบบประสาท",
  },
  {
    id: "MED_ZOLPIDEM",
    genericName: "Zolpidem",
    tradeNamesTh: "Ambien, ซอลพิเดม",
    categoryTh: "ยานอนหลับกลุ่ม Z-drug",
    acbScore: 1,
    clinicalNoteTh: "รบกวนสมาธิและความจำระยะสั้นชั่วคราวในผู้สูงอายุ",
  },
  {
    id: "MED_ATENOLOL",
    genericName: "Atenolol",
    tradeNamesTh: "Tenormin, อะทีโนลอล",
    categoryTh: "ยาลดความดันกลุ่ม Beta-Blocker",
    acbScore: 1,
    clinicalNoteTh: "มีฤทธิ์ต้านโคลิเนอร์จิกแฝงระดับต่ำ (ACB=1)",
  },
];

/**
 * 2Q Depression Screening Gatekeeper (LOINC 44255-8, 44250-9)
 */
export const DEPRESSION_2Q_QUESTIONS = [
  {
    id: "q1_depressed_mood",
    loincCode: "44255-8",
    questionTh: "1. ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึกหดหู่ เศร้า หรือท้อแท้สิ้นหวังหรือไม่?",
    clinicalNoteTh: "ประเมินอารมณ์เศร้า (Depressed Mood)",
  },
  {
    id: "q2_anhedonia",
    loincCode: "44250-9",
    questionTh: "2. ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึกเบื่อ ทำอะไรก็ไม่เพลิดเพลิน หรือไม่มีความสนใจในสิ่งที่เคยชอบทำหรือไม่?",
    clinicalNoteTh: "ประเมินภาวะสิ้นยินดี (Anhedonia / Apathy)",
  },
];

/**
 * AD8 Informant Interview Questions (Thai Adaptation)
 */
export const AD8_QUESTIONS = [
  {
    id: 1,
    domain: "การตัดสินใจและการแก้ปัญหา (Judgment & Problem Solving)",
    questionTh: "1. มีปัญหาในการตัดสินใจ หรือการแก้ไขปัญหาในชีวิตประจำวันหรือไม่?",
    examplesTh: "เช่น ตัดสินใจเรื่องการเงินผิดพลาด ถูกหลอกง่ายขึ้น หรือเลือกเสื้อผ้าไม่เหมาะกับโอกาส",
  },
  {
    id: 2,
    domain: "ความสนใจในงานอดิเรก (Hobbies & Activities)",
    questionTh: "2. มีความสนใจในงานอดิเรก หรือกิจกรรมที่เคยชอบทำลดลงหรือไม่?",
    examplesTh: "เช่น เลิกทำสวน เลิกทำอาหาร หรือเลิกเข้าร่วมกิจกรรมทางสังคมที่เคยทำเป็นประจำ",
  },
  {
    id: 3,
    domain: "การพูดซ้ำหรือถามซ้ำ (Repetition)",
    questionTh: "3. ชอบพูดเรื่องเดิมซ้ำๆ คำถามเดิมซ้ำๆ หรือเล่าเรื่องเดิมซ้ำในวันเดียวกันหรือไม่?",
    examplesTh: "เช่น ถามคำถามเดิมซ้ำหลายครั้งแม้เพิ่งได้รับคำตอบไปแล้วไม่นาน",
  },
  {
    id: 4,
    domain: "การเรียนรู้ใช้อุปกรณ์ใหม่ (Learning New Tools/Appliances)",
    questionTh: "4. มีปัญหาในการเรียนรู้วิธีใช้อุปกรณ์เครื่องใช้ในบ้าน หรือเทคโนโลยีใกล้ตัวหรือไม่?",
    examplesTh: "เช่น ใช้รีโมททีวี โทรศัพท์มือถือ เตาไมโครเวฟ หรือเครื่องซักผ้าที่เคยใช้ได้ลำบากขึ้น",
  },
  {
    id: 5,
    domain: "การรับรู้วันเดือนปี (Temporal Orientation)",
    questionTh: "5. ลืมเดือนหรือปีปัจจุบัน หรือสับสนเรื่องเวลาบ่อยครั้งหรือไม่?",
    examplesTh: "เช่น จำปี พ.ศ. หรือเดือนปัจจุบันไม่ได้ หรือสับสนช่วงเวลาเช้า-เย็น",
  },
  {
    id: 6,
    domain: "การจัดการการเงินที่ซับซ้อน (Complex Financial Affairs)",
    questionTh: "6. มีปัญหาในการจัดการเรื่องการเงินที่ซับซ้อน หรือการคำนวณค่าใช้จ่ายหรือไม่?",
    examplesTh: "เช่น ลืมจ่ายค่าน้ำ-ค่าไฟ คิดเงินทอนผิดพลาด หรือจัดการบัญชีธนาคารไม่ได้เหมือนเดิม",
  },
  {
    id: 7,
    domain: "การจำวันนัดหมาย (Remembering Appointments)",
    questionTh: "7. ลืมวันนัดหมายสำคัญ เช่น นัดพบแพทย์ หรือนัดหมายกับคนในครอบครัวหรือไม่?",
    examplesTh: "เช่น ลืมนัดหมอ ลืมงานสำคัญของครอบครัว แม้จะมีการเตือนไว้ล่วงหน้าแล้ว",
  },
  {
    id: 8,
    domain: "ปัญหาความจำและการคิดในชีวิตประจำวัน (Daily Memory & Thinking)",
    questionTh: "8. มีปัญหาเรื่องความจำและการคิดที่เกิดขึ้นเป็นประจำทุกวัน เช่น วางของผิดที่ หรือนึกคำพูดไม่ออกหรือไม่?",
    examplesTh: "เช่น หาของไม่เจอบ่อยครั้ง วางกุญแจหรือแว่นตาไว้ในที่แปลกๆ หรือนึกชื่อสิ่งของที่คุ้นเคยไม่ออก",
  },
];

export interface WordSet {
  id: string;
  label: string;
  validationSourceTh: string;
  words: [string, string, string];
  distractors: string[];
}

/**
 * Validated Thai Word Triplets
 * Adapted from standardized Thai cognitive assessment norms (TMSE / MoCA Thai equivalent frequency words)
 */
export const MINICOG_WORD_SETS: WordSet[] = [
  {
    id: "SET_A",
    label: "ชุดมาตรฐาน A (กล้วย - เก้าอี้ - เหรียญ)",
    validationSourceTh: "คำนามรูปธรรมความถี่สูง 2 พยางค์มาตรฐาน ดัดแปลงจาก TMSE (Thai Mental State Examination)",
    words: ["กล้วย", "เก้าอี้", "เหรียญ"],
    distractors: ["ส้ม", "โต๊ะ", "ธนบัตร", "ร่ม", "นาฬิกา", "แมว"],
  },
  {
    id: "SET_B",
    label: "ชุดมาตรฐาน B (หลอดไฟ - ดอกมะลิ - รถไฟ)",
    validationSourceTh: "คำนามความคุ้นเคยสูงในผู้สูงอายุไทย (Validated High-Familiarity Thai Norms)",
    words: ["หลอดไฟ", "ดอกมะลิ", "รถไฟ"],
    distractors: ["พัดลม", "ดอกกุหลาบ", "เรือใบ", "หนังสือ", "ช้อน", "ภูเขา"],
  },
  {
    id: "SET_C",
    label: "ชุดมาตรฐาน C (แม่น้ำ - เสื้อเชิ้ต - กระจก)",
    validationSourceTh: "คำนามมาตรฐานคู่ขนานสำหรับการทดสอบซ้ำ (Validated Parallel Word Set)",
    words: ["แม่น้ำ", "เสื้อเชิ้ต", "กระจก"],
    distractors: ["ทะเล", "กางเกง", "หน้าต่าง", "ดินสอ", "หมวก", "ต้นไม้"],
  },
];

/**
 * Standardized International LOINC Code Mapping (All Observation Codes, No Part Codes)
 */
export const LOINC_DATA_MAPPING: Record<string, LoincCodeDefinition> = {
  // 1. Reversible Metabolic
  labTsh: {
    fieldKey: "tsh_uIU_mL",
    loincCode: "3016-3",
    loincName: "Thyrotropin [Units/volume] in Serum or Plasma",
    labelTh: "TSH (ฮอร์โมนกระตุ้นต่อมไทรอยด์)",
    unit: "uIU/mL",
    referenceRange: "0.4 - 4.5 uIU/mL (ผู้สูงอายุอาจยอมรับได้ถึง 6.0 uIU/mL)",
    category: "REVERSIBLE_METABOLIC",
  },
  labFreeT4: {
    fieldKey: "free_t4_ng_dL",
    loincCode: "3024-7",
    loincName: "Thyroxine (T4) free [Mass/volume] in Serum or Plasma",
    labelTh: "Free T4 (ฮอร์โมนไทรอยด์อิสระ)",
    unit: "ng/dL",
    referenceRange: "0.8 - 1.8 ng/dL",
    category: "REVERSIBLE_METABOLIC",
  },
  labB12: {
    fieldKey: "vitamin_b12_pg_mL",
    loincCode: "2132-9",
    loincName: "Cobalamin (Vitamin B12) [Mass/volume] in Serum or Plasma",
    labelTh: "Vitamin B12 (โคบาลามิน)",
    unit: "pg/mL",
    referenceRange: "ขาด: < 200 pg/mL | ก้ำกึ่ง: 200 - 300 pg/mL | ปกติ: > 300 pg/mL",
    category: "REVERSIBLE_METABOLIC",
  },
  labFolate: {
    fieldKey: "serum_folate_ng_mL",
    loincCode: "2284-8",
    loincName: "Folate [Mass/volume] in Serum or Plasma",
    labelTh: "Serum Folate (กรดโฟลิกในเลือด)",
    unit: "ng/mL",
    referenceRange: "ขาด: < 3.0 ng/mL | ก้ำกึ่ง: 3.0 - 4.0 ng/mL | ปกติ: > 4.0 ng/mL",
    category: "REVERSIBLE_METABOLIC",
  },
  labSodium: {
    fieldKey: "sodium_mEq_L",
    loincCode: "2951-2",
    loincName: "Sodium [Moles/volume] in Serum or Plasma",
    labelTh: "Sodium (เกลือแร่โซเดียมในเลือด)",
    unit: "mEq/L",
    referenceRange: "ปกติ: 135 - 145 mEq/L (ต่ำเล็กน้อย: 130-134; รุนแรง: < 130)",
    category: "REVERSIBLE_METABOLIC",
  },
  labCalcium: {
    fieldKey: "calcium_mg_dL",
    loincCode: "17861-6",
    loincName: "Calcium [Mass/volume] in Serum or Plasma",
    labelTh: "Calcium (แคลเซียมในเลือด)",
    unit: "mg/dL",
    referenceRange: "ปกติ: 8.5 - 10.5 mg/dL",
    category: "REVERSIBLE_METABOLIC",
  },

  // 2. Vascular, Renal, Hepatic & Hematologic Geriatric Causes
  labHba1c: {
    fieldKey: "hba1c_percent",
    loincCode: "4548-4",
    loincName: "Hemoglobin A1c/Hemoglobin.total in Blood",
    labelTh: "HbA1c (น้ำตาลสะสมในเลือด)",
    unit: "%",
    referenceRange: "< 5.7% ปกติ | 5.7-6.4% ก่อนเบาหวาน | >= 6.5% เบาหวาน",
    category: "VASCULAR_METABOLIC",
  },
  labFastingGlucose: {
    fieldKey: "fasting_glucose_mg_dL",
    loincCode: "1558-6",
    loincName: "Fasting glucose [Mass/volume] in Blood",
    labelTh: "Fasting Blood Sugar (น้ำตาลในเลือดหลังอดอาหาร)",
    unit: "mg/dL",
    referenceRange: "70 - 99 mg/dL (ต่ำรุนแรง: < 54; ต่ำ: < 70; สูงมาก: > 300)",
    category: "VASCULAR_METABOLIC",
  },
  labLdl: {
    fieldKey: "ldl_mg_dL",
    loincCode: "2089-1",
    loincName: "Cholesterol in LDL [Mass/volume] in Serum or Plasma",
    labelTh: "LDL-C (ไขมันคอเลสเตอรอลชนิดไม่ดี)",
    unit: "mg/dL",
    referenceRange: "< 100 mg/dL (เป้าหมาย)",
    category: "VASCULAR_METABOLIC",
  },
  labHdl: {
    fieldKey: "hdl_mg_dL",
    loincCode: "2085-9",
    loincName: "Cholesterol in HDL [Mass/volume] in Serum or Plasma",
    labelTh: "HDL-C (ไขมันคอเลสเตอรอลชนิดดี)",
    unit: "mg/dL",
    referenceRange: "> 40 mg/dL (ชาย), > 50 mg/dL (หญิง)",
    category: "VASCULAR_METABOLIC",
  },
  labCreatinine: {
    fieldKey: "creatinine_mg_dL",
    loincCode: "2160-0",
    loincName: "Creatinine [Mass/volume] in Serum or Plasma",
    labelTh: "Serum Creatinine (ค่าการทำงานของไต)",
    unit: "mg/dL",
    referenceRange: "0.6 - 1.2 mg/dL (ไตเสื่อมปานกลาง: 2.0-2.9; ไตวายรุนแรง: >= 3.0)",
    category: "ROUTINE_GERIATRIC",
  },
  labEgfr: {
    fieldKey: "egfr_mL_min",
    loincCode: "62238-1",
    loincName: "Glomerular filtration rate/1.73 sq M.predicted [CKD-EPI]",
    labelTh: "eGFR (อัตราการกรองของเสียของไต)",
    unit: "mL/min/1.73m2",
    referenceRange: ">= 60 mL/min/1.73m² (ไตเสื่อมทำให้ p-tau ในเลือดคั่งหลอกได้)",
    category: "VASCULAR_METABOLIC",
  },
  labHemoglobin: {
    fieldKey: "hemoglobin_g_dL",
    loincCode: "718-7",
    loincName: "Hemoglobin [Mass/volume] in Blood",
    labelTh: "Hemoglobin (ความเข้มข้นของเลือด / ภาวะซีด)",
    unit: "g/dL",
    referenceRange: "12.0 - 16.0 g/dL (ซีดรุนแรง: < 8.0; ซีดเล็กน้อย-ปานกลาง: 8.0-10.9)",
    category: "ROUTINE_GERIATRIC",
  },
  labAlt: {
    fieldKey: "alt_u_L",
    loincCode: "1742-6",
    loincName: "Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
    labelTh: "ALT (เอนไซม์การทำงานของตับ)",
    unit: "U/L",
    referenceRange: "7 - 56 U/L (ตับอักเสบสูง: > 120; ตับวายรุนแรง: > 250)",
    category: "ROUTINE_GERIATRIC",
  },
  labAst: {
    fieldKey: "ast_u_L",
    loincCode: "1920-8",
    loincName: "Aspartate aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
    labelTh: "AST (เอนไซม์การทำงานของตับ)",
    unit: "U/L",
    referenceRange: "10 - 40 U/L (ตับอักเสบสูง: > 120; ตับวายรุนแรง: > 250)",
    category: "ROUTINE_GERIATRIC",
  },

  // 3. Genetic & Alzheimer Specific Biomarkers
  labApoe: {
    fieldKey: "apoe_genotype",
    loincCode: "41762-6",
    loincName: "APOE gene allele genotype",
    labelTh: "APOE Genotype (ยีนความเสี่ยงอัลไซเมอร์)",
    unit: "",
    referenceRange: "e2/e2, e2/e3, e2/e4, e3/e3, e3/e4, e4/e4",
    category: "ALZHEIMER_GENETIC",
  },
  labPtauVal: {
    fieldKey: "plasma_ptau217_pg_mL",
    loincCode: "104352-0", // Validated official Observation code
    loincName: "Phosphorylated tau 217 [Mass/volume] in Plasma",
    labelTh: "Plasma p-tau217 (โปรตีนจำเพาะต่อโรคอัลไซเมอร์)",
    unit: "pg/mL",
    referenceRange: "ขึ้นกับแพลตฟอร์มผู้ผลิตชุดตรวจ (แนะนำ Two-Cutoff Approach เช่น <0.25 ลบ, 0.25-0.39 ก้ำกึ่ง, >=0.40 บวก)",
    category: "ALZHEIMER_GENETIC",
  },
  labAbetaRatio: {
    fieldKey: "abeta_42_40_ratio",
    loincCode: "94660-8",
    loincName: "Beta-amyloid 42/Beta-amyloid 40 ratio in Plasma",
    labelTh: "Aβ 42/40 Ratio (สัดส่วนโปรตีนอะไมลอยด์เบต้า)",
    unit: "{ratio}",
    referenceRange: "ปกติ >= 0.090 | อะไมลอยด์บวก (เสี่ยงสูง): < 0.090",
    category: "ALZHEIMER_GENETIC",
  },
};

// Also index definitions by fieldKey for convenient lookup
Object.values(LOINC_DATA_MAPPING).forEach((def) => {
  if (def.fieldKey && !(def.fieldKey in LOINC_DATA_MAPPING)) {
    LOINC_DATA_MAPPING[def.fieldKey] = def;
  }
});
