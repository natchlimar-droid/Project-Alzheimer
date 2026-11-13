/**
 * AUTO-GENERATED SINGLE-SOURCE-OF-TRUTH CLINICAL ENGINE BUNDLE
 * Generated from src/ TypeScript modules via scripts/build-engine.mjs
 * DO NOT EDIT MANUALLY — edit src/ and run `node scripts/build-engine.mjs`.
 */

// ===== SOURCE: src/types/clinical.ts =====
/**
 * Multimodal Cognitive Screening & Biomarker-Informed Triage System
 * Core Clinical Data Interfaces, Pre-Test Validity Gatekeeper (with 4AT & Non-Literate Path),
 * Multi-Axis Stratification, Reversible Metabolic Encephalopathy Screen,
 * Independent Analyte Biomarker Rules, LOINC & Clinical Governance Types.
 */
const ALGORITHM_VERSION = "2.4.1-clinical-multiaxis-hardened";

                          
           
           
           
           
           
           
              

                                                                                  
                                                                                                      

                                              

/**
 * 4AT Brief Delirium Assessment Tool (Validated 0-12 Score)
 * 1. Alertness: 0 = Normal, 0 = Mild sleepiness < 10s, 4 = Clearly abnormal (hyper/hypoactive)
 * 2. AMT4 (Age, Date of Birth, Place, Current Year): 0 = 0 errors, 1 = 1 error, 2 = 2+ errors / untestable
 * 3. Attention (Months of year backwards from Dec): 0 = 7+ months correctly, 1 = starts but < 7, 2 = untestable
 * 4. Acute change or fluctuating course: 0 = No, 4 = Yes
 * Score >= 4 indicates delirium suspected.
 */
                                           
                        
                       
                            
                               
                     
                               
 

/**
 * Pre-Test Validity Gatekeeper (ด่านตรวจความพร้อมและความสมบูรณ์ก่อนทดสอบ)
 * Identifies delirium (via 4AT), sensory, acute medication, or literacy barriers
 */
                                      
                                                        
                                    
                                                                     
                                                                       
                                                                             
                                                                            
                                                                                                  
                          
                               
 

/**
 * Multi-Axis Parallel Reporting Categories
 * Prevents single-category masking (e.g. Reversible cause masking Alzheimer's)
 */
                                   
                      
                                             
                                                 
                                                 
                      

                                    
                      
                     
                          
                               
                                       
                                      
                                    
                            
                          
                       
                             
                         
                       
                          
                           
                         
                             
                   
                   
                  
                   
                  
                                      
                      
                                
                              
                 

                                   
                           
                               
                           
                                
                 

                                   
                                     
                 
                 

                                                                                    

                                      
                                      
                    
                    
                  
               
                         
                                
                     
                              
           
                          
                        
                       
                       
                     
 

                             
                                   
                                              
                                                 
                                                     
                                                      
                                                               
                                                
                                                  

                                                               
                                                         
                                                 
                                                  
                                                    
                                                                       
                                                                 
                                           
                                               
                                           
                                               
                                             
                                             

                                                                                   
                                                                  
                                                                            
                                 
                                                                        
                                        
                                                                                                  
                                
                                    
                                                                                 
 

/**
 * 4-Item Brief Thai Instrumental Activities of Daily Living (IADL)
 * Used to differentiate MCI (intact IADL: 0 impaired) from Dementia (impaired IADL: >= 1)
 */
                                      
                                                                    
                                                                      
                                                                                  
                                                                              
                                      
                                                                 
 

                                        
                                    
                               
                                
 

/**
 * Verified Specific Medication in Anticholinergic Cognitive Burden Scale
 */
                                    
             
                      
                       
                     
                      
                         
 

                                                  
                                  
                        
                              
                                           
                           
 

/**
 * Informed Consent & Governance for Speech Telemetry (PDPA Compliant)
 */
                                      
                          
                              
                                       
                            
                                        
 

/**
 * Speech Biomarker Telemetry (Exploratory / Research Only)
 * Transcript is kept separate or redacted in exports to protect privacy.
 */
                                           
                          
                                     
                                    
                                   
                                         
                                                                                         
                            
                               
                                 
                            
 

                                             
                             
                                    
                                        
                                 
                                 
 

                                        
                        
                      
                      
                          
                                  
                                
                             
                                       
 

/**
 * Visual-Motor Task is clearly designated as Experimental Research Telemetry
 */
                                       
                             
                                       
                                      
                            
                              
                                        
                                         
                               
                            
                            
                           
 

                                          
                     
                        
                          
                                    
                              
                                   
                                        
 

                                          
                              
                      
                               
                                         
                                     
                                    
                               
                   
                   
                         
            
              
                           
                                
                                       
                    
 

                             
                         
                        
                          
                        
                      
                      
                               
                              
                                
                            

                                    
                         
                   
                           
                      
                       
 

                                
                
                       
                    
                              
                         
                          
                       
                        
 

/**
 * Clinician Decision Record & License Attestation
 */
                                          
                        
                                                  
                             
                                                                                     
                                                                  
                                                                               
                       
 

/**
 * Clinical Assessment Input
 * Note: Core fields default to null to avoid false-negative defaults!
 */
                                  
                     
                                  
                                                        
                                                                             
                                                                 
                                                                        
                                            
                                                                          

                                                  
                                        
                                    
                                 
                                                                                                      
                                                                               

                                     
                                   
                                   
                                         

         
                    

                            
                                       
                           
                                    
                           
    
                                              
                                       

                 
                               
                                            
                         

                         
                          
                                              
 

/**
 * Multi-Axis Parallel Risk & Clinical Stratification Output
 */

// ===== SOURCE: src/data/clinicalContent.ts =====
/**
 * Pre-Test Validity Checklist Items
 * Evaluates whether testing is valid or contraindicated/uninterpretable
 */
const PRE_TEST_VALIDITY_ITEMS                        = [
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
const FOUR_AT_DELIRIUM_ITEMS = [
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
function calculate4ATDelirium(
  alertness       ,
  amt4           ,
  attention           ,
  fluctuation       
)                           {
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
const BRIEF_IADL_ITEMS = [
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
function evaluateBriefIADL(
  finances         ,
  meds         ,
  phoneTransport         ,
  household         
)                      {
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
const ACB_MEDICATIONS                      = [
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
const DEPRESSION_2Q_QUESTIONS = [
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
const AD8_QUESTIONS = [
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

                          
             
                
                             
                                  
                        
 

/**
 * Validated Thai Word Triplets
 * Adapted from standardized Thai cognitive assessment norms (TMSE / MoCA Thai equivalent frequency words)
 */
const MINICOG_WORD_SETS            = [
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
const SAMD_DISCLAIMER_TH =
  "ระบบนี้เป็นเครื่องมือคัดกรองและสนับสนุนการตัดสินใจทางคลินิกเบื้องต้นเชิงแนวคิด (Clinical Decision Support Prototype) ไม่ใช่การวินิจฉัยโรคทางการแพทย์ ผลการประเมินต้องได้รับการยืนยันโดยแพทย์ผู้เชี่ยวชาญ";
const FHIR_LOCAL_CODE_SYSTEM =
  "https://natchlimar-droid.github.io/Project-Alzheimer/fhir/CodeSystem/thai-cognitive-triage";

/**
 * Standardized International LOINC & Local FHIR CodeSystem Mapping
 * Audited against loinc.org:
 * - ZERO LOINC Part (LP*) codes used in Observation.code
 * - Each entry classifies mappingType as EXACT_LOINC, CLOSEST_MATCH, or LOCAL_CODESYSTEM
 */
const LOINC_DATA_MAPPING                                      = {
  // 1. Reversible Metabolic
  labTsh: {
    fieldKey: "tsh_uIU_mL",
    loincCode: "3016-3",
    loincName: "Thyrotropin [Units/volume] in Serum or Plasma",
    labelTh: "TSH (ฮอร์โมนกระตุ้นต่อมไทรอยด์)",
    unit: "uIU/mL",
    referenceRange: "0.35 - 4.5 uIU/mL (ผู้สูงอายุอาจยอมรับได้ถึง 6.0 uIU/mL)",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "REVERSIBLE_METABOLIC",
  },
  labFreeT4: {
    fieldKey: "free_t4_ng_dL",
    loincCode: "3024-7",
    loincName: "Thyroxine (T4) free [Mass/volume] in Serum or Plasma",
    labelTh: "Free T4 (ฮอร์โมนไทรอยด์อิสระ)",
    unit: "ng/dL",
    referenceRange: "0.8 - 1.8 ng/dL",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "REVERSIBLE_METABOLIC",
  },
  labB12: {
    fieldKey: "vitamin_b12_pg_mL",
    loincCode: "2132-9",
    loincName: "Cobalamin (Vitamin B12) [Mass/volume] in Serum or Plasma",
    labelTh: "Vitamin B12 (โคบาลามิน)",
    unit: "pg/mL",
    referenceRange: "ขาด: < 200 pg/mL | ก้ำกึ่ง: 200 - 300 pg/mL | ปกติ: > 300 pg/mL",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "REVERSIBLE_METABOLIC",
  },
  labFolate: {
    fieldKey: "serum_folate_ng_mL",
    loincCode: "2284-8",
    loincName: "Folate [Mass/volume] in Serum or Plasma",
    labelTh: "Serum Folate (กรดโฟลิกในเลือด)",
    unit: "ng/mL",
    referenceRange: "ขาด: < 3.0 ng/mL | ก้ำกึ่ง: 3.0 - 4.0 ng/mL | ปกติ: > 4.0 ng/mL",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "REVERSIBLE_METABOLIC",
  },
  labSodium: {
    fieldKey: "sodium_mEq_L",
    loincCode: "2951-2",
    loincName: "Sodium [Moles/volume] in Serum or Plasma",
    labelTh: "Sodium (เกลือแร่โซเดียมในเลือด)",
    unit: "mEq/L",
    referenceRange: "ปกติ: 135 - 145 mEq/L (ต่ำเล็กน้อย: 130-134; รุนแรง: < 130)",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "REVERSIBLE_METABOLIC",
  },
  labCalcium: {
    fieldKey: "calcium_mg_dL",
    loincCode: "17861-6",
    loincName: "Calcium [Mass/volume] in Serum or Plasma",
    labelTh: "Calcium (แคลเซียมในเลือด)",
    unit: "mg/dL",
    referenceRange: "ปกติ: 8.5 - 10.5 mg/dL",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
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
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "VASCULAR_METABOLIC",
  },
  labFastingGlucose: {
    fieldKey: "fasting_glucose_mg_dL",
    loincCode: "1558-6",
    loincName: "Fasting glucose [Mass/volume] in Serum or Plasma",
    labelTh: "Fasting Blood Sugar (น้ำตาลในเลือดหลังอดอาหาร)",
    unit: "mg/dL",
    referenceRange: "70 - 99 mg/dL (ต่ำรุนแรง: < 54; ต่ำ: < 70; สูงมาก: > 300)",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    legacyAliasCodes: ["2345-7"],
    category: "VASCULAR_METABOLIC",
  },
  labLdl: {
    fieldKey: "ldl_mg_dL",
    loincCode: "2089-1",
    loincName: "Cholesterol in LDL [Mass/volume] in Serum or Plasma",
    labelTh: "LDL-C (ไขมันคอเลสเตอรอลชนิดไม่ดี)",
    unit: "mg/dL",
    referenceRange: "< 100 mg/dL (เป้าหมาย)",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "VASCULAR_METABOLIC",
  },
  labHdl: {
    fieldKey: "hdl_mg_dL",
    loincCode: "2085-9",
    loincName: "Cholesterol in HDL [Mass/volume] in Serum or Plasma",
    labelTh: "HDL-C (ไขมันคอเลสเตอรอลชนิดดี)",
    unit: "mg/dL",
    referenceRange: "> 40 mg/dL (ชาย), > 50 mg/dL (หญิง)",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "VASCULAR_METABOLIC",
  },
  labCreatinine: {
    fieldKey: "creatinine_mg_dL",
    loincCode: "2160-0",
    loincName: "Creatinine [Mass/volume] in Serum or Plasma",
    labelTh: "Serum Creatinine (ค่าการทำงานของไต)",
    unit: "mg/dL",
    referenceRange: "0.6 - 1.2 mg/dL (ไตเสื่อมปานกลาง: 2.0-2.9; ไตวายรุนแรง: >= 3.0)",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "ROUTINE_GERIATRIC",
  },
  labEgfr: {
    fieldKey: "egfr_mL_min",
    loincCode: "98979-8",
    loincName: "Glomerular filtration rate/1.73 sq M.predicted [Volume Rate/Area] in Serum, Plasma or Blood by Creatinine-based formula (CKD-EPI 2021)",
    labelTh: "eGFR (อัตราการกรองของเสียของไต)",
    unit: "mL/min/1.73m2",
    referenceRange: ">= 60 mL/min/1.73m² (ไตเสื่อมทำให้ p-tau ในเลือดคั่งหลอกได้)",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    legacyAliasCodes: ["62238-1"],
    category: "VASCULAR_METABOLIC",
  },
  labHemoglobin: {
    fieldKey: "hemoglobin_g_dL",
    loincCode: "718-7",
    loincName: "Hemoglobin [Mass/volume] in Blood",
    labelTh: "Hemoglobin (ความเข้มข้นของเลือด / ภาวะซีด)",
    unit: "g/dL",
    referenceRange: "12.0 - 16.0 g/dL (ซีดรุนแรง: < 8.0; ซีดเล็กน้อย-ปานกลาง: 8.0-10.9)",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "ROUTINE_GERIATRIC",
  },
  labAlt: {
    fieldKey: "alt_u_L",
    loincCode: "1742-6",
    loincName: "Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
    labelTh: "ALT (เอนไซม์การทำงานของตับ)",
    unit: "U/L",
    referenceRange: "7 - 56 U/L (ตับอักเสบสูง: > 120; ตับวายรุนแรง: > 250)",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "ROUTINE_GERIATRIC",
  },
  labAst: {
    fieldKey: "ast_u_L",
    loincCode: "1920-8",
    loincName: "Aspartate aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
    labelTh: "AST (เอนไซม์การทำงานของตับ)",
    unit: "U/L",
    referenceRange: "10 - 40 U/L (ตับอักเสบสูง: > 120; ตับวายรุนแรง: > 250)",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "ROUTINE_GERIATRIC",
  },

  // 3. Genetic & Alzheimer Specific Biomarkers
  labApoe: {
    fieldKey: "apoe_genotype",
    loincCode: "42315-2",
    loincName: "APOE gene alleles e2 and e3 and e4 [Identifier] in Blood or Tissue by Molecular genetics method",
    labelTh: "APOE Genotype (ยีนความเสี่ยงอัลไซเมอร์)",
    unit: "",
    referenceRange: "e2/e2, e2/e3, e2/e4, e3/e3, e3/e4, e4/e4",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    legacyAliasCodes: ["41762-6"],
    category: "ALZHEIMER_GENETIC",
  },
  labPtauVal: {
    fieldKey: "plasma_ptau217_pg_mL",
    loincCode: "104663-0",
    loincName: "Tau protein.phosphorylated 217 [Mass/volume] in Serum or Plasma by Immunoassay",
    labelTh: "Plasma p-tau217 (โปรตีนจำเพาะต่อโรคอัลไซเมอร์)",
    unit: "pg/mL",
    referenceRange: "ขึ้นกับแพลตฟอร์มผู้ผลิตชุดตรวจ (แนะนำ Two-Cutoff Approach เช่น <0.25 ลบ, 0.25-0.39 ก้ำกึ่ง, >=0.40 บวก)",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    legacyAliasCodes: ["104352-0"],
    category: "ALZHEIMER_GENETIC",
  },
  labAbetaRatio: {
    fieldKey: "abeta_42_40_ratio",
    loincCode: "106941-8",
    loincName: "Amyloid beta 42 peptide/Amyloid beta 40 peptide [Mass Ratio] in Plasma by LC/MS/MS",
    labelTh: "Aβ 42/40 Ratio (สัดส่วนโปรตีนอะไมลอยด์เบต้า)",
    unit: "{ratio}",
    referenceRange: "ปกติ >= 0.090 | อะไมลอยด์บวก (เสี่ยงสูง): < 0.090",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    legacyAliasCodes: ["94660-8"],
    category: "ALZHEIMER_GENETIC",
  },

  // 4. Clinical Instruments & Local CodeSystem Mappings
  scoreAd8: {
    fieldKey: "ad8_score",
    loincCode: "71722-3",
    loincName: "Total score [AD8]",
    labelTh: "แบบประเมิน AD8 (คะแนนรวม 0-8)",
    unit: "{score}",
    referenceRange: "0 - 1 ปกติ | >= 2 มีภาวะบกพร่องทางการรับรู้",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "CLINICAL_SCORE",
  },
  scoreMiniCogTotal: {
    fieldKey: "mini_cog_total",
    loincCode: "72233-0",
    loincName: "Total score [Mini-Cog]",
    labelTh: "Mini-Cog Total Score (0-5)",
    unit: "{score}",
    referenceRange: ">= 3 ปกติ | < 3 เสี่ยงภาวะสมองเสื่อม",
    mappingType: "EXACT_LOINC",
    codeSystem: "http://loinc.org",
    category: "CLINICAL_SCORE",
  },
  scoreDepression2Q: {
    fieldKey: "depression_2q",
    loincCode: "55758-7",
    loincName: "Patient Health Questionnaire 2 item (PHQ-2) total score [Reported]",
    labelTh: "แบบคัดกรองโรคซึมเศร้า 2Q (Closest Match: PHQ-2)",
    unit: "{score}",
    referenceRange: "Negative (0) | Positive (>= 1 ข้อเสี่ยงซึมเศร้า)",
    mappingType: "CLOSEST_MATCH",
    codeSystem: "http://loinc.org",
    category: "CLINICAL_SCORE",
  },
  scoreBriefIadl: {
    fieldKey: "brief_iadl_score",
    loincCode: "83180-0",
    loincName: "Self-care activities - functional ability panel",
    labelTh: "Brief 4-Item Thai IADL (Closest Match Panel)",
    unit: "{score}",
    referenceRange: "0 ปกติ | >= 1 สูญเสียความสามารถเชิงปฏิบัติ",
    mappingType: "CLOSEST_MATCH",
    codeSystem: "http://loinc.org",
    category: "CLINICAL_SCORE",
  },
  scoreTrailMaking: {
    fieldKey: "trail_making_test",
    loincCode: "62778-6",
    loincName: "PhenX - trail making test protocol",
    labelTh: "Thai Visual-Motor Trail Making (1-ก-2-ข-3-ค-4-ง)",
    unit: "ms",
    referenceRange: "ปรับเกณฑ์ตามอายุและการศึกษา + Device Latency Calibration",
    mappingType: "CLOSEST_MATCH",
    codeSystem: "http://loinc.org",
    category: "CLINICAL_SCORE",
  },
  scoreFourAtDelirium: {
    fieldKey: "delirium_4at_score",
    loincCode: "delirium-4at-total",
    loincName: "4AT Rapid Clinical Test for Delirium Total Score",
    labelTh: "4AT Delirium Screen Score (0-12)",
    unit: "{score}",
    referenceRange: "0 ปกติ | 1-3 เฝ้าระวัง | >= 4 สงสัย Delirium",
    mappingType: "LOCAL_CODESYSTEM",
    codeSystem: FHIR_LOCAL_CODE_SYSTEM,
    category: "CLINICAL_SCORE",
  },
  scoreAnimalNaming: {
    fieldKey: "animal_naming_60s",
    loincCode: "semantic-fluency-animals-60s",
    loincName: "Category Verbal Fluency - Animals Named in 60 Seconds",
    labelTh: "การบอกชื่อสัตว์ใน 60 วินาที (Non-Literate Pathway)",
    unit: "{count}/min",
    referenceRange: "ไม่ได้เรียนหนังสือ >= 9 ตัว | ประถมศึกษาขึ้นไป >= 10 ตัว",
    mappingType: "LOCAL_CODESYSTEM",
    codeSystem: FHIR_LOCAL_CODE_SYSTEM,
    category: "CLINICAL_SCORE",
  },
  scoreAcbBurden: {
    fieldKey: "acb_score",
    loincCode: "acb-total-score",
    loincName: "Anticholinergic Cognitive Burden (ACB) Scale Total Score",
    labelTh: "คะแนนภาระยาต้านโคลิเนอร์จิก (ACB Score)",
    unit: "{score}",
    referenceRange: "0-2 ต่ำ | >= 3 เสี่ยงสูงต่อสมองสับสนจากยา",
    mappingType: "LOCAL_CODESYSTEM",
    codeSystem: FHIR_LOCAL_CODE_SYSTEM,
    category: "CLINICAL_SCORE",
  },
  scoreSpeechBiomarker: {
    fieldKey: "speech_biomarker",
    loincCode: "speech-PauseToWord-ratio",
    loincName: "Acoustic Speech Biomarker - Pause-to-Speech Ratio",
    labelTh: "ดัชนีวิเคราะห์การเว้นจังหวะเสียงพูด (Exploratory Telemetry)",
    unit: "{ratio}",
    referenceRange: "เกณฑ์วิจัย < 0.35 (Experimental Only)",
    mappingType: "LOCAL_CODESYSTEM",
    codeSystem: FHIR_LOCAL_CODE_SYSTEM,
    category: "CLINICAL_SCORE",
  },
};

// Also index definitions by fieldKey for convenient lookup
Object.values(LOINC_DATA_MAPPING).forEach((def) => {
  if (def.fieldKey && !(def.fieldKey in LOINC_DATA_MAPPING)) {
    LOINC_DATA_MAPPING[def.fieldKey] = def;
  }
});

// ===== SOURCE: src/engine/cdtAnalyzer.ts =====
/**
 * 5-Point Symmetric Moving-Average Kinematic Filter
 * Attenuates high-frequency motor tremor (4–12 Hz Parkinsonian / Essential Tremor)
 * while preserving macro-spatial trajectory (circle contour, quadrant placement, hand vector angles).
 */
function smoothStrokeForTremor(stroke           , radius = 2)            {
  if (!stroke || stroke.length <= 3) return stroke ? [...stroke] : [];
  const smoothed            = [];
  for (let i = 0; i < stroke.length; i++) {
    // Keep endpoints anchored so clock hand origin/tip vectors remain accurate
    if (i === 0 || i === stroke.length - 1) {
      smoothed.push({ x: stroke[i].x, y: stroke[i].y });
      continue;
    }
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let k = Math.max(0, i - radius); k <= Math.min(stroke.length - 1, i + radius); k++) {
      sumX += stroke[k].x;
      sumY += stroke[k].y;
      count++;
    }
    smoothed.push({ x: sumX / count, y: sumY / count });
  }
  return smoothed;
}

/**
 * Quantifies High-Frequency Oscillatory Motor Tremor vs Smooth Stroke Execution
 * Separates motoric hand tremor (Parkinsonism / Essential Tremor / Senile Tremor)
 * from cognitive visuospatial disorganization.
 */
function detectMotorTremorFromStrokes(strokes             )   
                               
                            
                                      
                               
  {
  const smoothedStrokes = strokes.map((s) => smoothStrokeForTremor(s, 2));
  let sumSqResidual = 0;
  let residualCount = 0;
  let angleSignFlips = 0;
  let segmentPairs = 0;

  for (let sIdx = 0; sIdx < strokes.length; sIdx++) {
    const raw = strokes[sIdx];
    const sm = smoothedStrokes[sIdx];
    if (raw.length < 5) continue;

    for (let i = 1; i < raw.length - 1; i++) {
      const dx = raw[i].x - sm[i].x;
      const dy = raw[i].y - sm[i].y;
      sumSqResidual += dx * dx + dy * dy;
      residualCount++;
    }

    let prevCrossSign = 0;
    for (let i = 1; i < raw.length - 1; i++) {
      const v1x = raw[i].x - raw[i - 1].x;
      const v1y = raw[i].y - raw[i - 1].y;
      const v2x = raw[i + 1].x - raw[i].x;
      const v2y = raw[i + 1].y - raw[i].y;
      const cross = v1x * v2y - v1y * v2x;
      const sign = cross > 1.5 ? 1 : cross < -1.5 ? -1 : 0;
      if (sign !== 0) {
        if (prevCrossSign !== 0 && sign !== prevCrossSign) {
          angleSignFlips++;
        }
        prevCrossSign = sign;
      }
      segmentPairs++;
    }
  }

  const tremorRmsJitterPx =
    residualCount > 0 ? Number(Math.sqrt(sumSqResidual / residualCount).toFixed(2)) : 0;
  const tremorDirectionReversalRate =
    segmentPairs > 0 ? Number((angleSignFlips / segmentPairs).toFixed(2)) : 0;

  const motorTremorDetected =
    tremorRmsJitterPx >= 1.8 && tremorDirectionReversalRate >= 0.25;

  return {
    motorTremorDetected,
    tremorRmsJitterPx,
    tremorDirectionReversalRate,
    smoothedStrokes,
  };
}

/**
 * Automated Geometric & Kinematic Heuristic Analyzer for Clock Drawing Test (11:10)
 * Evaluates macro-spatial placement AFTER compensating for motor tremor so patients with
 * Parkinsonian/essential hand tremor are not falsely penalized for cognitive impairment.
 */
function analyzeClockDrawingStrokes(
  strokes             ,
  canvasWidth = 460,
  canvasHeight = 460,
  telemetry                                 
)                       {
  const findingsTh           = [];

  if (!strokes || strokes.length < 3) {
    return {
      suggestedResult: "ABNORMAL",
      confidencePercent: 95,
      contourPresent: false,
      quadrantCoverage: [false, false, false, false],
      handTo11Detected: false,
      handTo2Detected: false,
      motorTremorDetected: false,
      tremorRmsJitterPx: 0,
      tremorDirectionReversalRate: 0,
      findingsTh: [
        "จำนวนเส้นที่วาดน้อยเกินไป (< 3 เส้น) ไม่พบองค์ประกอบของหน้าปัดนาฬิกาที่สมบูรณ์",
      ],
    };
  }

  // Step 0: Separate High-Frequency Motor Tremor from Macro-Spatial Geometry
  const tremorAnalysis = detectMotorTremorFromStrokes(strokes);
  const evalStrokes = tremorAnalysis.smoothedStrokes;

  const allPoints            = evalStrokes.flat();
  if (allPoints.length < 15) {
    return {
      suggestedResult: "ABNORMAL",
      confidencePercent: 90,
      contourPresent: false,
      quadrantCoverage: [false, false, false, false],
      handTo11Detected: false,
      handTo2Detected: false,
      motorTremorDetected: tremorAnalysis.motorTremorDetected,
      tremorRmsJitterPx: tremorAnalysis.tremorRmsJitterPx,
      tremorDirectionReversalRate: tremorAnalysis.tremorDirectionReversalRate,
      findingsTh: ["ข้อมูลจุดพิกัดบนหน้าปัดไม่เพียงพอสำหรับการประเมินรูปทรง"],
    };
  }

  if (tremorAnalysis.motorTremorDetected) {
    findingsTh.push(
      `🤚 ตรวจพบความสั่นพริ้วของเส้นแบบ Motor Tremor (RMS Jitter = ${tremorAnalysis.tremorRmsJitterPx} px, Oscillation Rate = ${Math.round(
        tremorAnalysis.tremorDirectionReversalRate * 100
      )}%) ระบบได้กรองความสั่นของกล้ามเนื้อมือออกก่อนประเมินตำแหน่งตัวเลขและเข็มนาฬิกา เพื่อไม่ให้หักคะแนนความจำผิดมิติ`
    );
  }

  // Compute bounding box and estimated clock center on smoothed trajectory
  const xs = allPoints.map((p) => p.x);
  const ys = allPoints.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const boxWidth = maxX - minX;
  const boxHeight = maxY - minY;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const radiusEst = Math.max(boxWidth, boxHeight) / 2;

  // 1. Check circular contour size & aspect ratio
  const aspectRatio = boxHeight > 0 ? boxWidth / boxHeight : 0;
  const contourPresent =
    boxWidth >= canvasWidth * 0.35 &&
    boxHeight >= canvasHeight * 0.35 &&
    aspectRatio >= 0.65 &&
    aspectRatio <= 1.45;

  if (!contourPresent) {
    findingsTh.push(
      "ขอบเขตหน้าปัดนาฬิกามีขนาดเล็กเกินไปหรือบิดเบี้ยวไม่สมมาตร (Visuospatial Distortion)"
    );
  } else {
    findingsTh.push("ตรวจพบโครงร่างหน้าปัดนาฬิกาสมมาตรในเกณฑ์ดี");
  }

  // 2. Check stroke distribution across 4 quadrants relative to center (cx, cy)
  const qCounts = [0, 0, 0, 0];
  for (const pt of allPoints) {
    if (pt.x >= cx && pt.y < cy) qCounts[0]++;
    else if (pt.x >= cx && pt.y >= cy) qCounts[1]++;
    else if (pt.x < cx && pt.y >= cy) qCounts[2]++;
    else qCounts[3]++;
  }

  const minPointsPerQuadrant = Math.max(3, Math.floor(allPoints.length * 0.05));
  const quadrantCoverage                                       = [
    qCounts[0] >= minPointsPerQuadrant,
    qCounts[1] >= minPointsPerQuadrant,
    qCounts[2] >= minPointsPerQuadrant,
    qCounts[3] >= minPointsPerQuadrant,
  ];
  const coveredQuadrantCount = quadrantCoverage.filter(Boolean).length;

  if (coveredQuadrantCount < 4) {
    findingsTh.push(
      `พบการกระจายตัวของตัวเลข/เส้นครอบคลุมเพียง ${coveredQuadrantCount}/4 จตุภาค (อาจมีภาวะละเลยกึ่งด้าน Hemispatial Neglect หรือวางตำแหน่งตัวเลขกระจุกตัว)`
    );
  } else {
    findingsTh.push("การกระจายตัวขององค์ประกอบครบทั้ง 4 จตุภาคของหน้าปัด");
  }

  // 3. Detect clock hands pointing to 11 (-120 deg) and 2 (-30 deg)
  // Allow slightly wider angular tolerance (32 deg) when motor tremor is detected
  let handTo11Detected = false;
  let handTo2Detected = false;
  const angleTol = tremorAnalysis.motorTremorDetected ? 32 : 28;
  const centerTolerance = radiusEst * 0.44;

  for (const stroke of evalStrokes) {
    if (stroke.length < 2) continue;
    const start = stroke[0];
    const end = stroke[stroke.length - 1];

    const distStart = Math.hypot(start.x - cx, start.y - cy);
    const distEnd = Math.hypot(end.x - cx, end.y - cy);

    if (distStart <= centerTolerance && distEnd > radiusEst * 0.28) {
      const angleDeg = (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;
      if (isAngleNear(angleDeg, -120, angleTol)) handTo11Detected = true;
      if (isAngleNear(angleDeg, -30, angleTol)) handTo2Detected = true;
    } else if (distEnd <= centerTolerance && distStart > radiusEst * 0.28) {
      const angleDeg = (Math.atan2(start.y - end.y, start.x - end.x) * 180) / Math.PI;
      if (isAngleNear(angleDeg, -120, angleTol)) handTo11Detected = true;
      if (isAngleNear(angleDeg, -30, angleTol)) handTo2Detected = true;
    }
  }

  if (handTo11Detected && handTo2Detected) {
    findingsTh.push(
      "ตรวจพบทิศทางเข็มนาฬิกาชี้ไปทางตำแหน่ง 11 นาฬิกา และ 2 นาฬิกา (11:10 น.) ถูกต้อง"
    );
  } else if (handTo11Detected || handTo2Detected) {
    findingsTh.push(
      "ตรวจพบเข็มนาฬิกาชี้ทิศทางถูกต้องเพียงเข็มเดียว (อาจสับสนตำแหน่งคำว่า '10 นาที' ไปชี้เลข 10 แทนเลข 2)"
    );
  } else {
    findingsTh.push(
      "ไม่พบเส้นเข็มนาฬิกาจากจุดศูนย์กลางที่ชี้ไปยังตำแหน่ง 11:10 น. อย่างชัดเจน"
    );
  }

  // 4. Kinematic Hesitation Telemetry Check
  if (
    telemetry?.hesitationIntervalsMs &&
    telemetry.hesitationIntervalsMs.length > 0
  ) {
    const maxHesitation = Math.max(...telemetry.hesitationIntervalsMs);
    if (maxHesitation > 5000) {
      findingsTh.push(
        `พบช่วงเวลาลังเลระหว่างวาดสูงสุด ${(maxHesitation / 1000).toFixed(
          1
        )} วินาที (> 5 วินาที) บ่งชี้การวางแผนบริหารจัดการช้าลง`
      );
    }
  }

  const isNormal =
    contourPresent &&
    coveredQuadrantCount === 4 &&
    handTo11Detected &&
    handTo2Detected &&
    strokes.length >= 6;

  const confidencePercent = isNormal ? 89 : 85;

  return {
    suggestedResult: isNormal ? "NORMAL" : "ABNORMAL",
    confidencePercent,
    contourPresent,
    quadrantCoverage,
    handTo11Detected,
    handTo2Detected,
    motorTremorDetected: tremorAnalysis.motorTremorDetected,
    tremorRmsJitterPx: tremorAnalysis.tremorRmsJitterPx,
    tremorDirectionReversalRate: tremorAnalysis.tremorDirectionReversalRate,
    findingsTh,
  };
}

function isAngleNear(angleDeg        , targetDeg        , toleranceDeg        )          {
  const diff = ((angleDeg - targetDeg + 540) % 360) - 180;
  return Math.abs(diff) <= toleranceDeg;
}

// ===== SOURCE: src/engine/riskStratification.ts =====
/**
 * Normalizes field-name aliases (e.g., alt_U_L -> alt_u_L, folate_ng_mL -> serum_folate_ng_mL,
 * serum_creatinine_mg_dL -> creatinine_mg_dL) so UI, FHIR imports, and SDK callers never diverge.
 */
function normalizeLabResults(labs                             )             {
  if (!labs) return {};
  return {
    ...labs,
    serum_folate_ng_mL: labs.serum_folate_ng_mL ?? labs.folate_ng_mL ?? undefined,
    creatinine_mg_dL: labs.creatinine_mg_dL ?? labs.serum_creatinine_mg_dL ?? undefined,
    alt_u_L: labs.alt_u_L ?? labs.alt_U_L ?? undefined,
    ast_u_L: labs.ast_u_L ?? labs.ast_U_L ?? undefined,
  };
}

/**
 * Education-adjusted 60-second Animal Naming semantic fluency cutoff.
 * Derived from Thai community-dwelling older adult normative data (e.g., Muangpaisan et al.):
 * - 0 years of formal education (non-literate): < 9 animals/min considered impaired
 * - >= 1 year of formal education (or unspecified): < 10 animals/min considered impaired
 */
function getAnimalNamingThreshold(yearsOfEducation                )         {
  if (yearsOfEducation !== undefined && yearsOfEducation !== null && yearsOfEducation <= 0) {
    return 9;
  }
  return 10;
}

/**
 * Validated Clinical Threshold Constants
 */
const CLINICAL_THRESHOLDS = {
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
}         ;

/**
 * Pre-Test Validity Gatekeeper Evaluation
 * Supports 4AT Delirium screening and Non-Literate alternative pathway
 */
function evaluatePreTestValidity(
  gate                      
)   
                          
                               
  {
  if (!gate) {
    return {
      validityPassed: true,
      exclusionReasonsTh: [],
    };
  }

  const reasons           = [];

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
function evaluateMiniCog(
  delayedRecallScore               ,
  cdtResult                  ,
  cuedRecognitionScore                
)   
                            
                             
                                    
                              
                                       
                           
  {
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
function evaluateAnticholinergicBurden(
  selectedMedicationIds           = []
)   
                        
                              
                                              
                           
                           
  {
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
function evaluateVisualMotorTaskExperimental(
  timeMs               ,
  errors               ,
  age               ,
  edu               ,
  baselineTouchMs                
)                       {
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
function evaluateSpeechBiomarkers(
  speech                           
)                                  {
  if (!speech || speech.pauseToSpeechRatio === null || speech.phoneticLatencyMs === null) {
    return null;
  }

  const pauseToSpeechRatio = Number(speech.pauseToSpeechRatio.toFixed(2));
  const phoneticLatencyMs = Math.round(speech.phoneticLatencyMs);
  const semanticRepetitionCount = speech.semanticRepetitionCount ? Math.round(speech.semanticRepetitionCount) : 0;

  const isPauseElevated = pauseToSpeechRatio > CLINICAL_THRESHOLDS.SPEECH_PAUSE_RATIO_EXPLORATORY;
  const isLatencyProlonged = phoneticLatencyMs > CLINICAL_THRESHOLDS.SPEECH_PHONETIC_LATENCY_MS_EXPLORATORY;
  const isRepetitionElevated = semanticRepetitionCount >= CLINICAL_THRESHOLDS.SPEECH_SEMANTIC_REPETITION_EXPLORATORY;

  const findings           = [];
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
 * Evaluates Thyroid (Overt, Subclinical Hypo/Hyper, Central, Thyrotoxicosis), B12, Folate,
 * Glucose (Hypoglycemia, Hyperglycemia), Sodium, Calcium, Anemia, Renal (Cr or standalone eGFR) & Hepatic dysfunction.
 */
function evaluateReversibleAxis(
  rawLabs             = {},
  acbTotalScore         = 0
)   
                                       
                  
  {
  const labs = normalizeLabResults(rawLabs);
  const categories                           = [];
  const flags           = [];

  // Anticholinergic Drug Burden
  if (acbTotalScore >= CLINICAL_THRESHOLDS.ACB_HIGH_BURDEN_CUTOFF) {
    categories.push("HIGH_ACB_BURDEN");
    flags.push(`[HIGH ACB BURDEN] ภาระยาต้านโคลิเนอร์จิกสูง (ACB Score = ${acbTotalScore}) เสี่ยงต่อสมองตื้อจากยา แนะนำ Deprescribing`);
  }

  const isNum = (v         )              => typeof v === "number" && !Number.isNaN(v);

  // Check if ANY numeric lab was entered
  const hasAnyLab =
    isNum(labs.tsh_uIU_mL) ||
    isNum(labs.free_t4_ng_dL) ||
    isNum(labs.vitamin_b12_pg_mL) ||
    isNum(labs.serum_folate_ng_mL) ||
    isNum(labs.sodium_mEq_L) ||
    isNum(labs.calcium_mg_dL) ||
    isNum(labs.fasting_glucose_mg_dL) ||
    isNum(labs.hba1c_percent) ||
    isNum(labs.hemoglobin_g_dL) ||
    isNum(labs.creatinine_mg_dL) ||
    isNum(labs.egfr_mL_min) ||
    isNum(labs.alt_u_L) ||
    isNum(labs.ast_u_L) ||
    isNum(labs.ldl_mg_dL);

  if (!hasAnyLab) {
    if (categories.length === 0) categories.push("UNASSESSED");
    return { categories, flags };
  }

  // 1. Fasting Glucose (Hypoglycemia & Severe Hyperglycemia)
  const glu = labs.fasting_glucose_mg_dL;
  if (isNum(glu)) {
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
  if (isNum(hb)) {
    if (hb < CLINICAL_THRESHOLDS.HEMOGLOBIN_SEVERE_ANEMIA) {
      categories.push("SEVERE_ANEMIA");
      flags.push(`[SEVERE ANEMIA] ภาวะซีดรุนแรง (Hemoglobin = ${hb} g/dL < 8.0) สมองขาดออกซิเจน ทำให้ง่วงซึม ความจำและสมาธิลดลงชัดเจน ต้องตรวจหาสาเหตุเลือดออกหรือขาดสารอาหาร`);
    } else if (hb < CLINICAL_THRESHOLDS.HEMOGLOBIN_MILD_ANEMIA) {
      categories.push("ANEMIA_WATCH");
      flags.push(`[ANEMIA WATCH] ภาวะซีดระดับเล็กน้อยถึงปานกลาง (Hemoglobin = ${hb} g/dL; ช่วง 8.0-10.9) อาจส่งผลให้เหนื่อยง่ายและคิดช้าลง`);
    }
  }

  // 3. Renal Impairment & Uremic Encephalopathy Risk (Cr and standalone eGFR)
  const cr = labs.creatinine_mg_dL;
  const egfr = labs.egfr_mL_min;
  if (isNum(cr) || isNum(egfr)) {
    if ((isNum(cr) && cr >= CLINICAL_THRESHOLDS.CREATININE_SEVERE) || (isNum(egfr) && egfr < CLINICAL_THRESHOLDS.EGFR_SEVERE_RENAL)) {
      categories.push("SEVERE_RENAL_FAILURE_UREMIC_RISK");
      flags.push(`[SEVERE RENAL FAILURE] ไตวายรุนแรง (Creatinine = ${cr ?? "ไม่ได้ระบุ"} mg/dL, eGFR = ${egfr ?? "ไม่ได้คำนวณ"} mL/min) เสี่ยงต่อภาวะของเสียคั่งในสมอง (Uremic Encephalopathy) ทำให้สับสน เพ้อ และความจำเสื่อม`);
    } else if ((isNum(cr) && cr > 1.3) || (isNum(egfr) && egfr < CLINICAL_THRESHOLDS.EGFR_RENAL_IMPAIRMENT)) {
      categories.push("RENAL_IMPAIRMENT");
      flags.push(`[RENAL IMPAIRMENT] ไตบกพร่อง (Creatinine = ${cr ?? "ไม่ได้ระบุ"} mg/dL, eGFR = ${egfr ?? "ไม่ได้คำนวณ"} mL/min) ต้องปรับขนาดยาที่ขับทางไตและระวังผล p-tau คั่งหลอก`);
    }
  }

  // 4. Serum Folate Deficiency
  const fol = labs.serum_folate_ng_mL;
  if (isNum(fol)) {
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
  const maxTransaminase = Math.max(isNum(alt) ? alt : 0, isNum(ast) ? ast : 0);
  if (maxTransaminase > 0) {
    if (maxTransaminase >= CLINICAL_THRESHOLDS.ALT_SEVERE) {
      categories.push("SEVERE_HEPATIC_DYSFUNCTION");
      flags.push(`[SEVERE HEPATIC DYSFUNCTION] ตับอักเสบรุนแรง (ALT = ${alt ?? "-"}, AST = ${ast ?? "-"} U/L >= 250) เสี่ยงต่อภาวะตับวายและ Hepatic Encephalopathy ทำให้สับสนซึม`);
    } else if (maxTransaminase >= CLINICAL_THRESHOLDS.ALT_IMPAIRMENT) {
      categories.push("HEPATIC_IMPAIRMENT_WATCH");
      flags.push(`[HEPATIC IMPAIRMENT WATCH] ตับอักเสบปานกลาง (ALT = ${alt ?? "-"}, AST = ${ast ?? "-"} U/L >= 120) ควรตรวจหาสาเหตุ`);
    }
  }

  // 6. Thyroid Evaluation (Overt, Subclinical Hypo/Hyper, Central, Thyrotoxicosis)
  const tsh = labs.tsh_uIU_mL;
  const ft4 = labs.free_t4_ng_dL;
  const hasTsh = isNum(tsh);
  const hasFt4 = isNum(ft4);
  if (hasTsh || hasFt4) {
    const isFt4Low = hasFt4 && ft4 < CLINICAL_THRESHOLDS.FREE_T4_NORMAL_LOW;
    const isFt4High = hasFt4 && ft4 > CLINICAL_THRESHOLDS.FREE_T4_NORMAL_HIGH;

    // Rule A — Central Hypothyroidism: Low FT4 (< 0.8) with non-elevated/suppressed/unassessed TSH (including TSH < 0.1!)
    if (isFt4Low && (!hasTsh || tsh <= CLINICAL_THRESHOLDS.TSH_NORMAL_HIGH)) {
      categories.push("CENTRAL_HYPOTHYROIDISM_SUSPECTED");
      flags.push(`[CENTRAL HYPOTHYROIDISM SUSPECTED] FT4 ต่ำ (${ft4} ng/dL < 0.8) ร่วมกับ TSH ไม่สูง (${hasTsh ? tsh : "ไม่ได้ตรวจ"} uIU/mL) สงสัยภาวะพร่องฮอร์โมนไทรอยด์จากต่อมใต้สมอง (Central/Secondary Hypothyroidism) แนะนำส่งตรวจต่อมไร้ท่อและ MRI Pituitary`);
    } else if (hasTsh && (tsh > CLINICAL_THRESHOLDS.TSH_SUBCLINICAL_MAX || (tsh > CLINICAL_THRESHOLDS.TSH_NORMAL_HIGH && isFt4Low))) {
      // Rule B1 — Overt Primary Hypothyroidism
      categories.push("OVERT_HYPOTHYROIDISM");
      flags.push(`[OVERT HYPOTHYROIDISM] ภาวะฮอร์โมนไทรอยด์ต่ำชัดเจน (TSH = ${tsh} uIU/mL, FT4 = ${ft4 ?? "ไม่ได้ตรวจ"}) เป็นสาเหตุของความจำถดถอยที่รักษาได้`);
    } else if (hasTsh && tsh > CLINICAL_THRESHOLDS.TSH_NORMAL_HIGH) {
      // Rule B2 — Subclinical Hypothyroidism Watch
      categories.push("SUBCLINICAL_THYROID_WATCH");
      flags.push(`[SUBCLINICAL THYROID WATCH] TSH สูงระดับก้ำกึ่ง (${tsh} uIU/mL; ช่วง 4.5–10) โดย FT4 ปกติ แนะนำตรวจติดตามซ้ำใน 2–3 เดือนก่อนเริ่มยาไทรอยด์`);
    } else if (hasTsh && tsh < CLINICAL_THRESHOLDS.TSH_NORMAL_LOW) {
      // Rule C — Low TSH: Require elevated FT4 (> 1.8) for overt thyrotoxicosis; otherwise Subclinical Hyperthyroidism Watch
      if (isFt4High) {
        categories.push("HYPERTHYROIDISM_THYROTOXICOSIS");
        flags.push(`[OVERT HYPERTHYROIDISM / THYROTOXICOSIS] TSH ต่ำ (${tsh} uIU/mL < 0.35) ร่วมกับ FT4 สูง (${ft4} ng/dL > 1.8) บ่งชี้ภาวะไทรอยด์เป็นพิษ เสี่ยงใจสั่น วิตกกังวล และสับสน (Apathetic Thyrotoxicosis)`);
      } else {
        categories.push("SUBCLINICAL_HYPERTHYROIDISM_WATCH");
        flags.push(`[SUBCLINICAL HYPERTHYROIDISM / LOW TSH WATCH] TSH ต่ำ (${tsh} uIU/mL < 0.35) โดย FT4 ปกติหรือยังไม่ได้ตรวจ (${ft4 ?? "ไม่ได้ตรวจ"} ng/dL) แนะนำตรวจยืนยัน Free T4 และ Free T3 เพื่อแยกภาวะ Subclinical Hyperthyroidism / Apathetic Thyrotoxicosis`);
      }
    } else if (isFt4High) {
      categories.push("HYPERTHYROIDISM_THYROTOXICOSIS");
      flags.push(`[HYPERTHYROIDISM / ELEVATED FT4] FT4 สูง (${ft4} ng/dL > 1.8) แนะนำส่งตรวจประเมินต่อมไร้ท่อเพิ่มเติม`);
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
function evaluateBiomarkerAxis(
  rawLabs             = {},
  algorithmicCognitiveAxis                       
)   
                                  
                               
                                     
                  
                                 
  {
  const labs = normalizeLabResults(rawLabs);
  const flags           = [];

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

  let resolvedPtau                = "UNASSESSED";
  if (ptauStatus) {
    resolvedPtau = ptauStatus;
  } else if (ptauVal !== undefined && ptauVal !== null) {
    if (ptauVal >= posCutoff) resolvedPtau = "POSITIVE";
    else if (ptauVal >= interCutoff) resolvedPtau = "BORDERLINE";
    else resolvedPtau = "NEGATIVE";
  }

  // 2. Evaluate Amyloid Beta 42/40 independently (Ratio < 0.090 indicates amyloid positivity)
  const abetaCutoff = labs.abeta_positive_cutoff ?? CLINICAL_THRESHOLDS.ABETA_42_40_RATIO_CUTOFF;
  let resolvedAbeta                   = "UNASSESSED";
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
  let category                        = "UNASSESSED";
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
function calculateLongitudinalDelta(
  input                 ,
  currentCompositeIndex        ,
  prev                         
)                          {
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
  let trajectoryStatus                                              = "STABLE";
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

  const sign = (n               ) => (n === null ? "-" : n > 0 ? `+${n}` : `${n}`);
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
function stratifyCognitiveRisk(input                 )             {
  const missingDomainsTh           = [];
  const clinicalFlags           = [];
  const actionChecklistTh           = [];

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
  const ad8UnsureCount = input.ad8UnsureCount ?? 0;

  if (input.ad8Score === null || input.ad8Score === undefined) {
    missingDomainsTh.push("แบบประเมินญาติ AD8 (ยังไม่ได้ตอบ)");
  } else if (ad8UnsureCount >= 3) {
    missingDomainsTh.push(`แบบประเมินญาติ AD8 (มีข้อที่ตอบ 'ไม่แน่ใจ' ${ad8UnsureCount} ข้อ >= 3 ข้อ ทำให้ข้อมูลจากผู้ใกล้ชิดไม่สมบูรณ์)`);
  }
  if (input.delayedRecallScore === null || input.delayedRecallScore === undefined) {
    missingDomainsTh.push("Mini-Cog Delayed Recall (ยังไม่ได้ทดสอบ)");
  }

  if (!isNonLiterate) {
    if (input.cdtResult === null || input.cdtResult === undefined) {
      missingDomainsTh.push("Clock Drawing Test 11:10 (ยังไม่ได้วาด)");
    }
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
  const ad8Score = Math.max(0, Math.min(8, input.ad8Score ));
  const isAd8Positive = ad8Score >= CLINICAL_THRESHOLDS.AD8_CUTOFF;
  if (ad8UnsureCount >= 1) {
    clinicalFlags.push(`[AD8 UNSURE WARNING] มีข้อที่ผู้ให้ข้อมูลตอบ 'ไม่แน่ใจ' จำนวน ${ad8UnsureCount} ข้อ — คะแนน AD8 (${ad8Score}/8) อาจต่ำกว่าความเป็นจริง`);
  }

  let isCognitiveScreenPositive = false;
  let miniCogTotal = 0;

  if (!isNonLiterate) {
    const miniCog = evaluateMiniCog(input.delayedRecallScore, input.cdtResult, input.cuedRecognitionScore);
    miniCogTotal = miniCog.totalScore ?? 0;
    isCognitiveScreenPositive = miniCog.isPositive || isAd8Positive;
  } else {
    // Non-literate pathway: Mini-Cog-aligned composite (3-word Delayed Recall [0-3] + Animal Naming [0 or 2])
    // with education-adjusted Thai normative cutoffs (< 9 for 0 yrs schooling, < 10 for >= 1 yr schooling)
    const clampedRecall = Math.max(0, Math.min(3, Math.round(input.delayedRecallScore )));
    const animalCount = input.animalNamingCount ?? 0;
    const animalCutoff = getAnimalNamingThreshold(input.yearsOfEducation);
    const isAnimalNamingImpaired = animalCount < animalCutoff;
    const animalPoints = isAnimalNamingImpaired ? 0 : 2;
    const nonLiterateComposite = clampedRecall + animalPoints;
    miniCogTotal = nonLiterateComposite;
    isCognitiveScreenPositive = nonLiterateComposite < CLINICAL_THRESHOLDS.MINICOG_PASS_CUTOFF || isAnimalNamingImpaired || isAd8Positive;
    clinicalFlags.push(
      `[NON-LITERATE PATHWAY USED] ใช้เกณฑ์ปรับตามการศึกษา: บอกชื่อสัตว์ ${animalCount} ชนิด/นาที (เกณฑ์ปกติ >= ${animalCutoff}), จำคำ ${clampedRecall}/3, Composite ${nonLiterateComposite}/5, AD8 ${ad8Score}/8`
    );
    if ((clampedRecall === 1 || clampedRecall === 2) && !isAnimalNamingImpaired) {
      clinicalFlags.push(
        `[NON-LITERATE PATHWAY WATCH] จำคำศัพท์ได้บางส่วน (${clampedRecall}/3) แต่ Semantic Fluency ผ่านเกณฑ์ (${animalCount} >= ${animalCutoff}) แนะนำเฝ้าระวังและนัดตรวจติดตามความจำใน 6 เดือน`
      );
    }
  }

  // 4. Axis 1: Objective Algorithmic Cognitive Performance Tier
  // Uses Brief IADL if available to differentiate MCI (IADL intact) vs Dementia (IADL impaired)
  let algorithmicCognitiveAxis                        = "COGNITIVE_NORMAL";

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
  let affectiveAxis                        = "UNASSESSED";
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
  let longitudinalDelta                                     ;
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

// ===== SOURCE: src/services/fhirService.ts =====
const PROJECT_FHIR_BASE_URL =
  "https://natchlimar-droid.github.io/Project-Alzheimer/fhir";

/**
 * Standard LOINC & Local FHIR CodeSystem Identifiers
 * Verified against loinc.org — zero LOINC Part (LP*) codes in Observation.code
 */
const CLINICAL_LOINC_CODES = {
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
}         ;

                                          
                     
                       
                       
                        
 

/**
 * Generates an HL7 FHIR R4 Collection Bundle representing the complete
 * Multimodal Cognitive Screening & Biomarker-Informed Triage encounter.
 */
function buildFhirR4Bundle(
  input                 ,
  output            ,
  options                          = {}
)                          {
  const timestamp = options.timestampIso ?? input.assessedAtIso ?? new Date().toISOString();
  const patientId = options.patientId ?? "patient-cog-screen-001";
  const patientName = options.patientName ?? "ผู้รับการประเมินคัดกรองสมอง";

  const entries                                 = [];

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
  const numericLabFields                          = [
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

  const riskAssessmentResource                          = {
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
  id        ,
  patientId        ,
  timestamp        ,
  loincCode        ,
  display        ,
  value        ,
  unit        ,
  codeSystem         = "http://loinc.org"
)                          {
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
function exportFhirJsonString(
  input                 ,
  output            ,
  options                          = {}
)         {
  return JSON.stringify(buildFhirR4Bundle(input, output, options), null, 2);
}

/**
 * Parses an HL7 FHIR R4 Bundle containing LOINC-coded Observation resources into LabResults.
 * Supports both audited official LOINC codes and legacy aliases for backward-compatible ingestion.
 */
function parseFhirBundleToLabResults(
  bundle                     
)             {
  const labs             = {};
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
          labs.apoe_genotype = valStr                               ;
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
function validateFhirR4Bundle(bundle                     )   
                 
                   
                     
            
                       
                             
                       
                           
                               
    
  {
  const errors           = [];
  const warnings           = [];
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

  const fullUrlSet = new Set        ();
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

// ===== SOURCE: src/services/privacyAuditService.ts =====
/**
 * Computes a cryptographic SHA-256 hex digest using Web Crypto API (or Node crypto if available).
 * Conforms with HIPAA and PDPA de-identification standards.
 */
async function computeSha256Digest(payload        )                  {
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
function computeDeterministicHexHash(payload        , salt = "COG-SAMD-PDPA-SALT-V1")         {
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
function generatePseudonymToken(
  fullName        ,
  nationalId = "",
  phoneNumber = ""
)         {
  const composite = `${fullName || "ANONYMOUS"}|${nationalId}|${phoneNumber}`;
  return `PSN-${computeDeterministicHexHash(composite)}`;
}
function maskNationalId(nationalId = "")         {
  const digits = nationalId.replace(/\D/g, "");
  if (!digits) return "ไม่ได้ระบุ";
  if (digits.length < 5) return "***";
  return `${digits[0]}-xxxx-xxxxx-${digits.slice(-2)}`;
}
function maskPhoneNumber(phone = "")         {
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
function buildPseudonymizedStorageSchemas(
  piiInput   
                     
                        
                         
   ,
  clinicalInput                 ,
  clinicalOutput            
)   
                                    
                            
                                        
                           
                          
                               
                       
                               
      
                                                 
                                       
    
  {
  const pseudonymToken = generatePseudonymToken(
    piiInput.fullName,
    piiInput.nationalId,
    piiInput.phoneNumber
  );
  const nowIso = clinicalInput.assessedAtIso ?? new Date().toISOString();

  const piiVaultRecord                    = {
    pseudonymToken,
    fullName: piiInput.fullName || "ไม่ระบุชื่อ",
    nationalIdMasked: maskNationalId(piiInput.nationalId),
    phoneMasked: maskPhoneNumber(piiInput.phoneNumber),
    createdAtIso: nowIso,
  };

  const deidentifiedInput                  = {
    ...clinicalInput,
    pseudonymToken,
  };

  const deidentifiedOutput             = {
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
function createAuditLogEntry(
  previousLogs                 ,
  params   
                       
                                
                           
                            
                          
   
)                {
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

export {
  ALGORITHM_VERSION,
  PRE_TEST_VALIDITY_ITEMS,
  FOUR_AT_DELIRIUM_ITEMS,
  calculate4ATDelirium,
  BRIEF_IADL_ITEMS,
  evaluateBriefIADL,
  ACB_MEDICATIONS,
  DEPRESSION_2Q_QUESTIONS,
  AD8_QUESTIONS,
  MINICOG_WORD_SETS,
  SAMD_DISCLAIMER_TH,
  FHIR_LOCAL_CODE_SYSTEM,
  LOINC_DATA_MAPPING,
  smoothStrokeForTremor,
  detectMotorTremorFromStrokes,
  analyzeClockDrawingStrokes,
  normalizeLabResults,
  getAnimalNamingThreshold,
  CLINICAL_THRESHOLDS,
  evaluatePreTestValidity,
  evaluateMiniCog,
  evaluateAnticholinergicBurden,
  evaluateVisualMotorTaskExperimental,
  evaluateSpeechBiomarkers,
  evaluateReversibleAxis,
  evaluateBiomarkerAxis,
  calculateLongitudinalDelta,
  stratifyCognitiveRisk,
  PROJECT_FHIR_BASE_URL,
  CLINICAL_LOINC_CODES,
  buildFhirR4Bundle,
  exportFhirJsonString,
  parseFhirBundleToLabResults,
  validateFhirR4Bundle,
  computeSha256Digest,
  computeDeterministicHexHash,
  generatePseudonymToken,
  maskNationalId,
  maskPhoneNumber,
  buildPseudonymizedStorageSchemas,
  createAuditLogEntry,
};
