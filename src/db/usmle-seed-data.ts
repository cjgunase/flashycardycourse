/**
 * USMLE Example Deck Seed Data
 * 30 flashcards covering various medical topics with varying proficiency levels
 * Distribution: ~10 Beginner, ~10 Intermediate, ~10 Advanced
 */

export interface SeedCard {
    question: string;
    answer: string;
    confidenceLevel: 1 | 2 | 3; // 1: Beginner, 2: Intermediate, 3: Advanced
}

export const EXAMPLE_DECK_TITLE = "USMLE Study Guide - Example Deck";
export const EXAMPLE_DECK_DESCRIPTION = "A comprehensive example deck with 30 high-yield USMLE questions across multiple medical specialties. Use this to explore the app's features!";

export const usmleCards: SeedCard[] = [
    // BEGINNER LEVEL (1) - 10 cards
    {
        question: "What are the four chambers of the heart?",
        answer: "The heart has four chambers:\n- Right atrium\n- Right ventricle\n- Left atrium\n- Left ventricle\n\nThe right side receives deoxygenated blood and pumps it to the lungs. The left side receives oxygenated blood from the lungs and pumps it to the body.",
        confidenceLevel: 1,
    },
    {
        question: "Define hypertension and state the blood pressure threshold.",
        answer: "Hypertension is persistently elevated blood pressure.\n\nCurrent threshold (2017 ACC/AHA guidelines):\n- Stage 1: Systolic 130-139 mmHg OR Diastolic 80-89 mmHg\n- Stage 2: Systolic ≥140 mmHg OR Diastolic ≥90 mmHg\n\nElevated BP: Systolic 120-129 mmHg AND Diastolic <80 mmHg",
        confidenceLevel: 1,
    },
    {
        question: "What is the difference between type 1 and type 2 diabetes mellitus?",
        answer: "Type 1 Diabetes:\n- Autoimmune destruction of pancreatic beta cells\n- Absolute insulin deficiency\n- Usually onset in childhood/adolescence\n- Requires insulin therapy\n\nType 2 Diabetes:\n- Insulin resistance + relative insulin deficiency\n- Usually adult onset (but increasing in youth)\n- Associated with obesity\n- Managed with lifestyle, oral meds, and/or insulin",
        confidenceLevel: 1,
    },
    {
        question: "List the signs of inflammation (5 cardinal signs).",
        answer: "The 5 cardinal signs of inflammation:\n1. Rubor (redness)\n2. Calor (heat)\n3. Tumor (swelling)\n4. Dolor (pain)\n5. Functio laesa (loss of function)\n\nFirst 4 described by Celsus; 5th added by Virchow.",
        confidenceLevel: 1,
    },
    {
        question: "What is the normal platelet count range?",
        answer: "Normal platelet count: 150,000-400,000 per μL (or 150-400 × 10⁹/L)\n\nThrombocytopenia: <150,000/μL\nThrombocytosis: >400,000/μL\n\nSpontaneous bleeding risk increases significantly when platelets <20,000/μL.",
        confidenceLevel: 1,
    },
    {
        question: "What are the ABCs of trauma management?",
        answer: "Primary survey in trauma (ATLS):\n\nA - Airway maintenance with cervical spine protection\nB - Breathing and ventilation\nC - Circulation with hemorrhage control\nD - Disability (neurological status)\nE - Exposure/Environmental control\n\nAddress life-threatening conditions as you identify them.",
        confidenceLevel: 1,
    },
    {
        question: "Define shock and list the four main types.",
        answer: "Shock: Inadequate tissue perfusion leading to cellular hypoxia and organ dysfunction.\n\nFour main types:\n1. Hypovolemic (fluid loss)\n2. Cardiogenic (pump failure)\n3. Distributive (vasodilation: septic, anaphylactic, neurogenic)\n4. Obstructive (mechanical obstruction: PE, tamponade, tension pneumothorax)",
        confidenceLevel: 1,
    },
    {
        question: "What is the Apgar score and when is it assessed?",
        answer: "Apgar score assesses newborn status at 1 and 5 minutes after birth.\n\nFive components (0-2 points each, max 10):\nA - Appearance (color)\nP - Pulse (heart rate)\nG - Grimace (reflex irritability)\nA - Activity (muscle tone)\nR - Respiration (breathing effort)\n\nScore 7-10: Normal\nScore 4-6: Moderately abnormal\nScore 0-3: Low, needs immediate intervention",
        confidenceLevel: 1,
    },
    {
        question: "What is the mechanism of action of aspirin?",
        answer: "Aspirin (acetylsalicylic acid) irreversibly inhibits cyclooxygenase (COX-1 and COX-2) enzymes.\n\nEffects:\n- Inhibits prostaglandin synthesis\n- Reduces inflammation, pain, and fever\n- Prevents platelet aggregation (antiplatelet effect)\n\nAntiplatelet effect lasts for the life of the platelet (~7-10 days) due to irreversible inhibition.",
        confidenceLevel: 1,
    },
    {
        question: "What is the Glasgow Coma Scale score indicating severe head injury?",
        answer: "GCS ≤8 indicates severe head injury (coma).\n\nGCS classification:\n- 13-15: Mild head injury\n- 9-12: Moderate head injury\n- 3-8: Severe head injury\n\nGCS ≤8 is often described as \"intubate\" - patients may not be able to protect their airway.",
        confidenceLevel: 1,
    },

    // INTERMEDIATE LEVEL (2) - 10 cards
    {
        question: "Describe the pathophysiology of acute coronary syndrome (ACS).",
        answer: "ACS pathophysiology:\n\n1. Atherosclerotic plaque rupture or erosion\n2. Platelet activation and aggregation\n3. Thrombus formation\n4. Partial or complete coronary artery occlusion\n5. Myocardial ischemia/infarction\n\nSpectrum:\n- Unstable angina: Ischemia without necrosis\n- NSTEMI: Partial occlusion, subendocardial infarction\n- STEMI: Complete occlusion, transmural infarction\n\nBiomarkers (troponin) elevated in NSTEMI/STEMI, not in unstable angina.",
        confidenceLevel: 2,
    },
    {
        question: "Compare nephrotic vs nephritic syndrome.",
        answer: "Nephrotic Syndrome:\n- Proteinuria >3.5 g/day\n- Hypoalbuminemia\n- Edema\n- Hyperlipidemia\n- Lipiduria (oval fat bodies)\nCauses: Minimal change, FSGS, membranous nephropathy, diabetic nephropathy\n\nNephritic Syndrome:\n- Hematuria (RBC casts)\n- Hypertension\n- Oliguria\n- Proteinuria (<3.5 g/day)\n- Azotemia\nCauses: Post-strep GN, IgA nephropathy, rapidly progressive GN",
        confidenceLevel: 2,
    },
    {
        question: "What is the Rome IV criteria for irritable bowel syndrome (IBS)?",
        answer: "Rome IV Criteria for IBS:\n\nRecurrent abdominal pain, on average ≥1 day/week in the last 3 months, with symptom onset ≥6 months prior, associated with ≥2 of:\n\n1. Related to defecation\n2. Change in stool frequency\n3. Change in stool form/appearance\n\nSubtypes:\n- IBS-C (constipation predominant)\n- IBS-D (diarrhea predominant)\n- IBS-M (mixed)\n- IBS-U (unclassified)",
        confidenceLevel: 2,
    },
    {
        question: "Explain the pathophysiology of diabetic ketoacidosis (DKA).",
        answer: "DKA Pathophysiology:\n\n1. Absolute insulin deficiency → cells can't use glucose\n2. Counter-regulatory hormones ↑ (glucagon, cortisol, catecholamines)\n3. Hepatic gluconeogenesis and glycogenolysis → hyperglycemia\n4. Lipolysis → free fatty acids\n5. Hepatic ketogenesis → ketones (β-hydroxybutyrate, acetoacetate)\n6. Metabolic acidosis (anion gap)\n7. Osmotic diuresis → dehydration, electrolyte loss\n\nTriad: Hyperglycemia, ketosis, metabolic acidosis\n\nClassic presentation: Polyuria, polydipsia, Kussmaul breathing, fruity breath",
        confidenceLevel: 2,
    },
    {
        question: "What are the components of CURB-65 score for pneumonia severity?",
        answer: "CURB-65 score predicts mortality in community-acquired pneumonia (1 point each):\n\nC - Confusion (new onset)\nU - Urea >7 mmol/L (BUN >19 mg/dL)\nR - Respiratory rate ≥30/min\nB - Blood pressure: Systolic <90 mmHg OR Diastolic ≤60 mmHg\n65 - Age ≥65 years\n\nScore interpretation:\n0-1: Low risk, outpatient treatment\n2: Moderate risk, consider hospital admission\n3-5: High risk, hospital admission, consider ICU",
        confidenceLevel: 2,
    },
    {
        question: "Describe the mechanism and ECG findings of Wolff-Parkinson-White (WPW) syndrome.",
        answer: "WPW Syndrome:\n\nMechanism:\n- Accessory pathway (Bundle of Kent) bypasses AV node\n- Allows ventricular pre-excitation\n- Creates substrate for re-entrant tachycardia (AVRT)\n\nECG findings:\n- Short PR interval (<120 ms)\n- Delta wave (slurred QRS upstroke)\n- Wide QRS complex\n- Secondary ST-T changes\n\nComplication: Risk of supraventricular tachycardia (SVT)\n\nNote: Avoid AV nodal blockers (adenosine, beta-blockers, CCBs) in AF with WPW → can precipitate VF",
        confidenceLevel: 2,
    },
    {
        question: "What are the diagnostic criteria for systemic inflammatory response syndrome (SIRS) and sepsis?",
        answer: "SIRS (≥2 criteria):\n- Temp >38°C or <36°C\n- HR >90 bpm\n- RR >20/min or PaCO₂ <32 mmHg\n- WBC >12,000 or <4,000/mm³ or >10% bands\n\nSepsis (updated Sepsis-3 definition):\n- Life-threatening organ dysfunction due to dysregulated host response to infection\n- qSOFA ≥2: SBP ≤100, RR ≥22, altered mental status\n- Or SOFA score increase ≥2\n\nSeptic shock:\n- Sepsis + vasopressors needed to maintain MAP ≥65 + lactate >2 mmol/L despite adequate fluid resuscitation",
        confidenceLevel: 2,
    },
    {
        question: "Compare the features of Crohn's disease vs Ulcerative colitis.",
        answer: "Crohn's Disease:\n- Any GI location (mouth to anus)\n- Transmural inflammation\n- Skip lesions\n- Fistulas, strictures, abscesses\n- Cobblestone appearance\n- Granulomas on biopsy\n\nUlcerative Colitis:\n- Colon only (continuous from rectum)\n- Mucosal/submucosal inflammation only\n- Continuous involvement\n- Pseudopolyps\n- Bloody diarrhea more common\n- Crypt abscesses on biopsy\n- Higher colon cancer risk\n\nBoth: Extraintestinal manifestations (arthritis, uveitis, erythema nodosum)",
        confidenceLevel: 2,
    },
    {
        question: "What is the mechanism of warfarin and how is it monitored?",
        answer: "Warfarin Mechanism:\n- Inhibits vitamin K epoxide reductase\n- Prevents reduction of vitamin K\n- Decreases synthesis of factors II, VII, IX, X and proteins C & S\n\nMonitoring:\n- INR (International Normalized Ratio)\n- Target INR varies by indication:\n  • 2-3: DVT/PE, AF, mechanical bioprosthetic valves\n  • 2.5-3.5: Mechanical mitral valves, recurrent thromboembolism\n\nReversal:\n- Vitamin K (slow, 12-24 hours)\n- PCC (prothrombin complex concentrate) or FFP (rapid)\n\nNote: Protein C has shortest half-life → transient hypercoagulable state → bridge with heparin",
        confidenceLevel: 2,
    },
    {
        question: "Describe the Ranson criteria for acute pancreatitis severity.",
        answer: "Ranson Criteria (11 total):\n\nAt admission (5 criteria):\n- Age >55 years\n- WBC >16,000/mm³\n- Glucose >200 mg/dL\n- LDH >350 IU/L\n- AST >250 IU/L\n\nWithin 48 hours (6 criteria):\n- Hematocrit drop >10%\n- BUN rise >5 mg/dL\n- Calcium <8 mg/dL\n- PaO₂ <60 mmHg\n- Base deficit >4 mEq/L\n- Fluid sequestration >6L\n\nMortality:\n0-2: <1%\n3-4: 15%\n5-6: 40%\n>6: Nearly 100%",
        confidenceLevel: 2,
    },

    // ADVANCED LEVEL (3) - 10 cards
    {
        question: "Explain the pathophysiology and management of hepatorenal syndrome (HRS).",
        answer: "Hepatorenal Syndrome Pathophysiology:\n\n1. Advanced cirrhosis → splanchnic vasodilation\n2. Effective arterial hypovolemia\n3. Activation of RAAS, SNS, ADH\n4. Renal vasoconstriction → ↓GFR\n5. Functional renal failure (kidneys structurally normal)\n\nTypes:\n- Type 1 HRS: Rapid (doubling Cr in <2 weeks), poor prognosis\n- Type 2 HRS: Slower, associated with refractory ascites\n\nDiagnostic criteria:\n- Cirrhosis with ascites\n- Cr >1.5 mg/dL\n- No improvement after 2 days albumin and volume expansion\n- No shock, nephrotoxins, or parenchymal disease\n\nTreatment:\n- Vasoconstrictors (midodrine + octreotide, or terlipressin)\n- Albumin\n- Liver transplant (definitive)",
        confidenceLevel: 3,
    },
    {
        question: "Describe the pathophysiology of acute respiratory distress syndrome (ARDS) and the Berlin Definition criteria.",
        answer: "ARDS Pathophysiology:\n\n1. Injury to alveolar-capillary membrane (direct or indirect)\n2. Inflammatory cascade activation\n3. Increased capillary permeability\n4. Protein-rich alveolar edema (non-cardiogenic)\n5. Surfactant dysfunction\n6. Alveolar collapse, V/Q mismatch\n7. Severe hypoxemia\n\nBerlin Definition:\n- Timing: Within 1 week of insult\n- Chest imaging: Bilateral opacities not fully explained by effusions/collapse\n- Origin: Not fully explained by cardiac failure/fluid overload\n- Oxygenation (on PEEP ≥5):\n  • Mild: PaO₂/FiO₂ 200-300\n  • Moderate: PaO₂/FiO₂ 100-200\n  • Severe: PaO₂/FiO₂ <100\n\nManagement: Lung-protective ventilation (TV 6 mL/kg IBW), PEEP, prone positioning (severe cases)",
        confidenceLevel: 3,
    },
    {
        question: "What are the mechanisms and clinical features of tumor lysis syndrome (TLS)?",
        answer: "Tumor Lysis Syndrome:\n\nMechanism:\n- Rapid tumor cell lysis (chemo, radiation, spontaneous)\n- Massive release of intracellular contents\n\nLaboratory findings:\n- Hyperuricemia (purine metabolism)\n- Hyperkalemia (↑K⁺)\n- Hyperphosphatemia (↑PO₄³⁻)\n- Hypocalcemia (Ca²⁺ binds PO₄³⁻)\n- ↑LDH\n- Acute kidney injury\n\nClinical consequences:\n- AKI (uric acid nephropathy)\n- Cardiac arrhythmias (hyperkalemia)\n- Seizures (hypocalcemia)\n- Muscle cramps, tetany\n\nProphylaxis:\n- IV hydration\n- Allopurinol or rasburicase (reduce uric acid)\n- Monitor electrolytes\n- Avoid nephrotoxins\n\nHigh-risk: Burkitt lymphoma, ALL, high tumor burden",
        confidenceLevel: 3,
    },
    {
        question: "Explain the pathophysiology and ECG progression of acute pericarditis.",
        answer: "Acute Pericarditis Pathophysiology:\n- Inflammation of pericardial sac\n- Causes: Viral (most common), post-MI (Dressler's), uremia, autoimmune, malignancy, radiation\n\nClassic presentation:\n- Sharp, pleuritic chest pain\n- Worse supine, better leaning forward\n- Pericardial friction rub (pathognomonic)\n\nECG Stages:\nStage 1: Diffuse ST elevation (concave up), PR depression\nStage 2: ST normalization, T wave flattening\nStage 3: Diffuse T wave inversion\nStage 4: Normalization (or chronic changes)\n\nKey ECG features:\n- Diffuse ST elevation (not localized like MI)\n- PR depression (specific for pericarditis)\n- Ratio: ST elevation (mm) in V6 / T wave amplitude (mm) in V6 >0.24 suggests pericarditis\n\nComplications: Pericardial effusion, tamponade (rare)",
        confidenceLevel: 3,
    },
    {
        question: "Describe the light criteria for differentiating exudative vs transudative pleural effusions.",
        answer: "Light's Criteria:\n\nExudate if ≥1 criterion met:\n1. Pleural fluid protein / serum protein >0.5\n2. Pleural fluid LDH / serum LDH >0.6\n3. Pleural fluid LDH >2/3 upper limit of normal serum LDH\n\nTransudate: None of the above criteria met\n\nExudative causes:\n- Pneumonia (parapneumonic)\n- Malignancy\n- TB\n- Pulmonary embolism\n- Pancreatitis\n- Autoimmune (SLE, RA)\n\nTransudative causes:\n- Heart failure (most common)\n- Cirrhosis\n- Nephrotic syndrome\n- Hypoalbuminemia\n\nSensitivity ~98%, Specificity ~80% for exudates",
        confidenceLevel: 3,
    },
    {
        question: "What is the mechanism and treatment of malignant hyperthermia?",
        answer: "Malignant Hyperthermia:\n\nMechanism:\n- Genetic disorder (RYR1 or CACNA1S mutation)\n- Defective ryanodine receptor\n- Triggered by volatile anesthetics (halothane, sevoflurane) and succinylcholine\n- Uncontrolled Ca²⁺ release from sarcoplasmic reticulum\n- Hypermetabolic crisis in skeletal muscle\n\nClinical features:\n- Rapid ↑temp (can rise 1°C every 5 min)\n- Muscle rigidity (especially masseter)\n- Tachycardia, tachypnea\n- Hypercarbia (early sign)\n- Rhabdomyolysis (↑CK, myoglobinuria)\n- Metabolic acidosis\n- Hyperkalemia, arrhythmias\n\nTreatment:\n- STOP triggering agents immediately\n- Dantrolene 2.5 mg/kg IV (repeat until symptoms resolve)\n- 100% O₂, hyperventilation\n- Cooling measures\n- Treat hyperkalemia, acidosis\n- Monitor/treat rhabdomyolysis (aggressive hydration)\n\nPrevent: Family history → avoid triggers, use non-depolarizing muscle relaxants",
        confidenceLevel: 3,
    },
    {
        question: "Explain the diagnostic approach to adrenal insufficiency and the cosyntropin stimulation test.",
        answer: "Adrenal Insufficiency:\n\nPrimary (Addison's disease):\n- Adrenal gland destruction\n- ↓Cortisol + ↓Aldosterone\n- ↑ACTH (loss of negative feedback)\n- Hyperpigmentation (ACTH cross-reacts with melanocyte receptors)\n\nSecondary:\n- Pituitary/hypothalamic dysfunction\n- ↓ACTH → ↓Cortisol\n- Aldosterone preserved (RAAS intact)\n- No hyperpigmentation\n\nCosyntropin Stimulation Test:\n1. Check baseline cortisol and ACTH\n2. Give synthetic ACTH (cosyntropin 250 mcg IV/IM)\n3. Check cortisol at 30 and 60 minutes\n\nInterpretation:\n- Normal: Cortisol rises >18-20 mcg/dL\n- Primary AI: Blunted response, HIGH baseline ACTH\n- Secondary AI: May have blunted response, LOW baseline ACTH\n\nNote: ACTH level differentiates primary vs secondary\n\nAcute treatment: Hydrocortisone + fluids + dextrose",
        confidenceLevel: 3,
    },
    {
        question: "Describe the pathophysiology of thyroid storm and its management.",
        answer: "Thyroid Storm Pathophysiology:\n- Acute, life-threatening thyrotoxicosis\n- Excessive circulating thyroid hormones\n- Precipitants: Infection, trauma, surgery, iodine load, med non-compliance\n\nClinical features:\n- High fever (>40°C)\n- Tachycardia/AF\n- Hypertension → hypotension\n- Altered mental status, agitation, delirium\n- GI symptoms (N/V/D)\n- Tremor, hyperreflexia\n\nBurch-Wartofsky Score ≥45 → thyroid storm likely\n\nManagement (6 steps, in order):\n1. **Beta-blocker** (propranolol preferred - also blocks T4→T3 conversion)\n2. **Thionamide** (PTU preferred or methimazole) - blocks synthesis\n3. **Iodine** (SSKI or Lugol's) - blocks release (give 1 hour AFTER thionamide)\n4. **Corticosteroids** (dexamethasone/hydrocortisone) - blocks T4→T3 conversion\n5. **Supportive care** (cooling, fluids, treat precipitant)\n6. Consider plasmapheresis/dialysis (severe cases)\n\nNote: PTU preferred (pregnancy, storm) as it also inhibits peripheral conversion",
        confidenceLevel: 3,
    },
    {
        question: "What is the pathophysiology of hypertrophic obstructive cardiomyopathy (HOCM) and its management?",
        answer: "HOCM Pathophysiology:\n- Genetic (sarcomere protein mutations, often MYH7, MYBPC3)\n- Asymmetric septal hypertrophy\n- Systolic anterior motion (SAM) of mitral valve\n- LV outflow tract obstruction\n- Diastolic dysfunction\n\nClinical:\n- Dyspnea, angina, syncope (exertional)\n- Sudden cardiac death (arrhythmias)\n- Systolic murmur: ↑ with Valsalva, standing (↓preload)\n                   ↓ with squatting, handgrip (↑preload/afterload)\n\nDiagnostics:\n- Echo: Septal thickness ≥15mm, SAM, LVOT obstruction\n- ECG: LVH, deep Q waves, T wave inversion\n\nManagement:\n- Beta-blockers or CCBs (verapamil) - 1st line\n- Avoid: Vasodilators, diuretics, digoxin (worsen obstruction)\n- ICD for high-risk SCD patients\n- Septal reduction: Myectomy or alcohol ablation (refractory symptoms)\n\nFamily screening: Echo + ECG for 1st-degree relatives",
        confidenceLevel: 3,
    },
    {
        question: "Explain the pathophysiology and treatment of serotonin syndrome.",
        answer: "Serotonin Syndrome:\n\nPathophysiology:\n- Excessive serotonergic activity in CNS and periphery\n- Causes: SSRI/SNRI overdose, drug interactions (MAOIs + SSRIs, tramadol + SSRIs), linezolid\n\nClinical triad:\n1. Mental status changes (agitation, confusion)\n2. Autonomic hyperactivity (hyperthermia, tachycardia, hypertension, diaphoresis, mydriasis)\n3. Neuromuscular abnormalities (hyperreflexia, clonus, rigidity, tremor)\n\nHunter Criteria (diagnosis):\nSerotonergic agent + one of:\n- Spontaneous clonus, OR\n- Inducible clonus + agitation/diaphoresis, OR\n- Ocular clonus + agitation/diaphoresis, OR\n- Tremor + hyperreflexia, OR\n- Hypertonia + temp >38°C + ocular/inducible clonus\n\nTreatment:\n- STOP offending agents\n- Supportive care (cooling, fluids, benzos for agitation/rigidity)\n- Cyproheptadine (5HT antagonist) - moderate to severe cases\n- Avoid physical restraints (↑heat production)\n\nDifferential: Neuroleptic malignant syndrome (lead-pipe rigidity, antipsychotics)",
        confidenceLevel: 3,
    },
];
