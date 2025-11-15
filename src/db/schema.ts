import { integer, pgTable, varchar, text, timestamp, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Decks table - each user can have multiple decks
export const decksTable = pgTable("decks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cards table - each deck contains multiple flashcards
export const cardsTable = pgTable("cards", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deckId: integer("deck_id")
    .notNull()
    .references(() => decksTable.id, { onDelete: "cascade" }),
  question: text().notNull(),
  answer: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Spaced repetition fields
  lastReviewedAt: timestamp("last_reviewed_at"),
  nextDueAt: timestamp("next_due_at"),
  easeFactor: real("ease_factor").default(2.5), // SM-2 algorithm default
  reviewCount: integer("review_count").default(0).notNull(),
});

// Define relations
export const decksRelations = relations(decksTable, ({ many }) => ({
  cards: many(cardsTable),
}));

export const cardsRelations = relations(cardsTable, ({ one }) => ({
  deck: one(decksTable, {
    fields: [cardsTable.deckId],
    references: [decksTable.id],
  }),
}));

// Sample data for medical students
export const sampleDecks = [
  {
    clerkUserId: "sample_user",
    title: "Acute Medicine",
    description: "Emergency and acute care scenarios for final year medical students",
  },
  {
    clerkUserId: "sample_user",
    title: "Cardiology",
    description: "Cardiovascular system, ECG interpretation, and cardiac emergencies",
  },
  {
    clerkUserId: "sample_user",
    title: "Clinical Skills",
    description: "Essential clinical examination and diagnostic criteria",
  },
];

export const sampleCards = [
  // Acute Medicine cards
  {
    question: "List the Sepsis Six",
    answer: "1. Give high-flow oxygen\n2. Take blood cultures\n3. Give IV antibiotics\n4. Give IV fluid resuscitation\n5. Check lactate\n6. Measure urine output\n\nThese should be completed within 1 hour of identifying sepsis.",
  },
  {
    question: "What are the diagnostic criteria for SIRS (Systemic Inflammatory Response Syndrome)?",
    answer: "At least 2 of the following:\n- Temperature >38°C or <36°C\n- Heart rate >90 bpm\n- Respiratory rate >20/min or PaCO2 <4.3 kPa\n- WBC >12,000/mm³ or <4,000/mm³ or >10% immature bands",
  },
  {
    question: "Red flags for cauda equina syndrome",
    answer: "- Bilateral sciatica\n- Saddle anaesthesia\n- Bladder/bowel dysfunction (urinary retention, overflow incontinence, loss of anal tone)\n- Progressive motor weakness in legs\n- Reduced anal tone on PR examination\n\nRequires urgent MRI and neurosurgical referral.",
  },
  {
    question: "What is the Glasgow Coma Scale (GCS) scoring system?",
    answer: "Eyes (4): Spontaneous(4), To speech(3), To pain(2), None(1)\n\nVerbal (5): Oriented(5), Confused(4), Inappropriate words(3), Incomprehensible sounds(2), None(1)\n\nMotor (6): Obeys commands(6), Localizes pain(5), Withdraws from pain(4), Flexion to pain(3), Extension to pain(2), None(1)\n\nTotal score: 3-15 (15 = fully conscious)",
  },
  // Cardiology cards
  {
    question: "ECG features of hyperkalaemia?",
    answer: "Progressive changes as K+ rises:\n- Tall tented T waves (earliest sign)\n- Prolonged PR interval\n- Flattened/absent P waves\n- Widened QRS complex\n- Sine wave pattern (severe, pre-arrest)\n\nTreatment is urgent if ECG changes present.",
  },
  {
    question: "What are the ECG criteria for left ventricular hypertrophy (LVH)?",
    answer: "Sokolow-Lyon criteria (most common):\nS wave in V1 + R wave in V5 or V6 ≥35mm\n\nOther features:\n- R wave in aVL ≥11mm\n- Left axis deviation\n- ST depression and T wave inversion in lateral leads (strain pattern)\n- Prolonged QRS duration (>120ms)",
  },
  {
    question: "List the reversible causes of cardiac arrest (4 H's and 4 T's)",
    answer: "4 H's:\n- Hypoxia\n- Hypovolaemia\n- Hyper/hypokalaemia (and metabolic disorders)\n- Hypothermia\n\n4 T's:\n- Thrombosis (coronary or pulmonary)\n- Tension pneumothorax\n- Tamponade (cardiac)\n- Toxins",
  },
  {
    question: "What is the CHADS₂VASc score used for?",
    answer: "Risk stratification for stroke in atrial fibrillation to guide anticoagulation.\n\nC - Congestive heart failure (1)\nH - Hypertension (1)\nA₂ - Age ≥75 (2)\nD - Diabetes (1)\nS₂ - Prior Stroke/TIA/thromboembolism (2)\nV - Vascular disease (1)\nA - Age 65-74 (1)\nSc - Sex category (female) (1)\n\nScore ≥2: Consider anticoagulation\nScore 0 (male) or 1 (female): No anticoagulation",
  },
  // Clinical Skills cards
  {
    question: "Diagnostic criteria for pre-eclampsia",
    answer: "New hypertension after 20 weeks gestation (≥140/90 mmHg) PLUS one or more:\n\n- Proteinuria (≥0.3g/24hr or PCR ≥30mg/mmol)\n- Maternal organ dysfunction:\n  • Renal (creatinine ≥90μmol/L)\n  • Liver (elevated transaminases, RUQ pain)\n  • Neurological (severe headache, visual disturbances, clonus, stroke)\n  • Haematological (thrombocytopenia <150, DIC, haemolysis)\n- Uteroplacental dysfunction (fetal growth restriction)",
  },
  {
    question: "What are the features of lower motor neuron (LMN) vs upper motor neuron (UMN) lesions?",
    answer: "LMN:\n- Weakness\n- Hypotonia (reduced tone)\n- Hyporeflexia/areflexia\n- Muscle wasting\n- Fasciculations\n\nUMN:\n- Weakness\n- Hypertonia (increased tone/spasticity)\n- Hyperreflexia\n- Extensor plantar response (Babinski sign)\n- No muscle wasting (early)\n- Clonus may be present",
  },
  {
    question: "What is Virchow's triad for thrombosis?",
    answer: "Three factors that contribute to thrombosis:\n\n1. Endothelial injury (e.g., trauma, surgery, inflammation)\n2. Venous stasis (e.g., immobility, long flights, post-op)\n3. Hypercoagulability (e.g., malignancy, pregnancy, OCP, thrombophilia)\n\nPresence of these factors increases DVT/PE risk.",
  },
  {
    question: "List the cranial nerves and their main functions",
    answer: "I - Olfactory: Smell\nII - Optic: Vision\nIII - Oculomotor: Eye movement, pupil constriction\nIV - Trochlear: Eye movement (superior oblique)\nV - Trigeminal: Facial sensation, mastication\nVI - Abducens: Eye movement (lateral rectus)\nVII - Facial: Facial expression, taste\nVIII - Vestibulocochlear: Hearing, balance\nIX - Glossopharyngeal: Taste, swallowing\nX - Vagus: Parasympathetic, phonation\nXI - Accessory: Shoulder shrug, head turn\nXII - Hypoglossal: Tongue movement",
  },
];
