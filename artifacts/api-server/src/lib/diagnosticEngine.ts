export interface SymptomDefinition {
  id: string;
  label: string;
  description?: string;
}

export interface SymptomCategory {
  category: string;
  symptoms: SymptomDefinition[];
}

export interface DiseaseRule {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  requiredSymptoms?: string[];
  triageLevel: "emergency" | "seek_doctor" | "monitor" | "self_care";
  triageDescription: string;
  selfCareAdvice: string[];
  whenToSeeDoctor: string;
  commonIn?: string;
  prevalence?: string;
}

export interface MatchedCondition {
  disease: string;
  confidence: number;
  matchedSymptoms: string[];
  triageLevel: string;
  triageDescription: string;
  selfCareAdvice: string[];
  whenToSeeDoctor: string;
  commonIn?: string;
}

export interface DiagnosisResult {
  sessionId?: number | null;
  topCondition: MatchedCondition;
  otherConditions: MatchedCondition[];
  generalAdvice: string;
  disclaimer: string;
  analyzedAt: string;
}

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    category: "Fever & Temperature",
    symptoms: [
      { id: "high_fever", label: "High fever (above 38°C/100.4°F)", description: "Sudden high temperature" },
      { id: "low_grade_fever", label: "Low-grade fever (37-38°C)", description: "Mild persistent warmth" },
      { id: "chills", label: "Chills and shivering", description: "Uncontrollable shaking or cold feeling" },
      { id: "night_sweats", label: "Night sweats", description: "Excessive sweating at night" },
    ],
  },
  {
    category: "Head & Neurological",
    symptoms: [
      { id: "headache", label: "Headache", description: "Pain in the head" },
      { id: "severe_headache", label: "Severe headache", description: "Intense throbbing or pressure in the head" },
      { id: "dizziness", label: "Dizziness or lightheadedness", description: "Feeling faint or unsteady" },
      { id: "confusion", label: "Confusion or disorientation", description: "Difficulty thinking clearly" },
      { id: "blurred_vision", label: "Blurred vision", description: "Difficulty seeing clearly" },
      { id: "stiff_neck", label: "Stiff neck", description: "Difficulty moving the neck" },
      { id: "pain_behind_eyes", label: "Pain behind the eyes", description: "Deep aching pain behind or around the eyes" },
    ],
  },
  {
    category: "Respiratory",
    symptoms: [
      { id: "cough", label: "Cough", description: "Dry or productive cough" },
      { id: "productive_cough", label: "Cough with phlegm/mucus", description: "Wet cough bringing up mucus" },
      { id: "sore_throat", label: "Sore throat", description: "Pain or irritation in the throat" },
      { id: "runny_nose", label: "Runny or blocked nose", description: "Nasal congestion or discharge" },
      { id: "shortness_of_breath", label: "Shortness of breath", description: "Difficulty breathing or catching breath" },
      { id: "chest_pain", label: "Chest pain or tightness", description: "Pressure, pain, or discomfort in chest" },
      { id: "sneezing", label: "Sneezing", description: "Frequent sneezing" },
    ],
  },
  {
    category: "Digestive & Stomach",
    symptoms: [
      { id: "nausea", label: "Nausea", description: "Feeling like you might vomit" },
      { id: "vomiting", label: "Vomiting", description: "Actually being sick" },
      { id: "diarrhea", label: "Diarrhea", description: "Loose or watery stools" },
      { id: "watery_diarrhea", label: "Profuse watery diarrhea", description: "Very frequent, large amounts of liquid stool" },
      { id: "stomach_pain", label: "Stomach or abdominal pain", description: "Pain or cramps in the belly area" },
      { id: "burning_stomach", label: "Burning stomach pain", description: "Burning or gnawing pain in the upper stomach, often worse when hungry" },
      { id: "lower_right_pain", label: "Pain in lower right abdomen", description: "Sharp or aching pain on the lower right side of the belly" },
      { id: "loss_of_appetite", label: "Loss of appetite", description: "Not feeling like eating" },
      { id: "bloating", label: "Bloating", description: "Feeling of fullness or swelling in the belly" },
      { id: "constipation", label: "Constipation", description: "Difficulty passing stool" },
      { id: "anal_itching", label: "Anal or rectal itching", description: "Persistent itching around the back passage" },
    ],
  },
  {
    category: "Body & Muscles",
    symptoms: [
      { id: "body_aches", label: "Body aches and pains", description: "General muscle or body pain" },
      { id: "joint_pain", label: "Joint pain", description: "Pain in joints like knees, elbows, or wrists" },
      { id: "fatigue", label: "Extreme tiredness or fatigue", description: "Feeling very weak or exhausted" },
      { id: "muscle_weakness", label: "Muscle weakness", description: "Difficulty using or moving muscles" },
      { id: "back_pain", label: "Back pain", description: "Pain in the upper or lower back" },
      { id: "severe_joint_pain", label: "Severe joint or bone pain", description: "Intense, debilitating pain in joints or bones" },
    ],
  },
  {
    category: "Skin",
    symptoms: [
      { id: "rash", label: "Skin rash", description: "Redness, spots, or blotches on skin" },
      { id: "itching", label: "Itching", description: "Strong urge to scratch skin" },
      { id: "jaundice", label: "Yellow skin or eyes (jaundice)", description: "Yellowing of skin or whites of eyes" },
      { id: "pale_skin", label: "Pale or very light skin", description: "Skin looks unusually white or washed out" },
      { id: "swelling", label: "Swelling of limbs", description: "Puffy or swollen hands, feet, or legs" },
      { id: "face_swelling", label: "Swollen face or hands", description: "Face, hands, or around the eyes noticeably puffed up" },
      { id: "skin_warmth", label: "Skin feels hot and red to touch", description: "A specific area of skin is hot, red, and painful when pressed" },
    ],
  },
  {
    category: "Urinary & Reproductive",
    symptoms: [
      { id: "painful_urination", label: "Pain when urinating", description: "Burning or stinging when passing urine" },
      { id: "frequent_urination", label: "Frequent urination", description: "Needing to urinate much more than usual" },
      { id: "dark_urine", label: "Dark or discoloured urine", description: "Urine looks brown, orange, or very dark" },
      { id: "blood_in_urine", label: "Blood in urine", description: "Urine looks pink, red, or has visible blood" },
    ],
  },
  {
    category: "Other",
    symptoms: [
      { id: "weight_loss", label: "Unexplained weight loss", description: "Losing weight without trying" },
      { id: "excessive_thirst", label: "Excessive thirst", description: "Feeling thirsty all the time" },
      { id: "excessive_hunger", label: "Excessive hunger", description: "Feeling hungry very frequently" },
      { id: "cold_extremities", label: "Cold hands or feet", description: "Hands and feet feel unusually cold" },
      { id: "ear_pain", label: "Ear pain", description: "Pain inside one or both ears" },
      { id: "eye_redness", label: "Red or itchy eyes", description: "Eyes look red or feel irritated" },
      { id: "eye_discharge", label: "Eye discharge or crusting", description: "Sticky or crusty discharge from one or both eyes" },
    ],
  },
];

const DISEASE_RULES: DiseaseRule[] = [
  {
    id: "malaria",
    name: "Malaria",
    description: "A mosquito-borne disease common in tropical regions, caused by Plasmodium parasites.",
    symptoms: ["high_fever", "chills", "headache", "body_aches", "fatigue", "nausea", "vomiting", "joint_pain", "night_sweats", "pale_skin", "jaundice"],
    requiredSymptoms: ["high_fever", "chills"],
    triageLevel: "seek_doctor",
    triageDescription: "Malaria requires prompt medical attention. Please visit a clinic or hospital for a blood test.",
    selfCareAdvice: [
      "Rest as much as possible in a cool environment",
      "Drink plenty of clean water or oral rehydration salts to stay hydrated",
      "Take paracetamol (not aspirin) to manage fever",
      "Use a net to prevent further mosquito bites",
      "Do not self-medicate with antimalarials without a confirmed diagnosis",
    ],
    whenToSeeDoctor: "Go to a clinic immediately for a malaria rapid test. If you have a very high fever, confusion, or cannot keep fluids down, go to the emergency room.",
    commonIn: "Common throughout Nigeria and sub-Saharan Africa, especially during and after rainy season.",
    prevalence: "Very common",
  },
  {
    id: "typhoid",
    name: "Typhoid Fever",
    description: "A bacterial infection caused by Salmonella typhi, spread through contaminated food and water.",
    symptoms: ["high_fever", "headache", "stomach_pain", "diarrhea", "constipation", "fatigue", "loss_of_appetite", "body_aches", "nausea", "rash", "confusion"],
    requiredSymptoms: ["high_fever", "fatigue"],
    triageLevel: "seek_doctor",
    triageDescription: "Typhoid fever requires antibiotics prescribed by a doctor. Do not delay seeking care.",
    selfCareAdvice: [
      "Drink only clean, boiled or treated water",
      "Eat small, easily digestible meals if you can",
      "Rest and avoid strenuous activity",
      "Maintain good hand hygiene — wash hands before eating and after using the toilet",
      "Avoid sharing utensils or food with others",
    ],
    whenToSeeDoctor: "See a doctor as soon as possible to get a Widal test or blood culture for confirmation and to receive the appropriate antibiotics.",
    commonIn: "Common in areas with poor sanitation. Widespread in many parts of Nigeria.",
    prevalence: "Very common",
  },
  {
    id: "flu",
    name: "Influenza (Flu)",
    description: "A contagious respiratory illness caused by influenza viruses, affecting the nose, throat, and lungs.",
    symptoms: ["high_fever", "low_grade_fever", "body_aches", "headache", "fatigue", "cough", "sore_throat", "runny_nose", "chills", "sneezing"],
    triageLevel: "monitor",
    triageDescription: "Most flu cases can be managed at home with rest and fluids. Monitor your symptoms closely.",
    selfCareAdvice: [
      "Rest and stay home — this helps you recover and prevents spreading it to others",
      "Drink plenty of fluids — water, herbal tea, or clear broth",
      "Take paracetamol or ibuprofen to reduce fever and body aches",
      "Keep warm and comfortable",
      "Eat light, nutritious meals when you can",
    ],
    whenToSeeDoctor: "See a doctor if your fever is very high and lasts more than 3 days, you have difficulty breathing, or you have an underlying health condition.",
    commonIn: "Common year-round, with peaks during harmattan season in Nigeria.",
    prevalence: "Very common",
  },
  {
    id: "common_cold",
    name: "Common Cold",
    description: "A mild viral infection of the upper respiratory tract caused by rhinoviruses.",
    symptoms: ["runny_nose", "sore_throat", "sneezing", "cough", "low_grade_fever", "headache", "fatigue"],
    triageLevel: "self_care",
    triageDescription: "A cold is mild and usually clears up on its own within 7-10 days with rest and fluids.",
    selfCareAdvice: [
      "Rest as much as possible",
      "Drink warm fluids — herbal teas, warm water with honey and ginger",
      "Gargle with warm salt water to soothe a sore throat",
      "Use a nasal saline spray if your nose is very blocked",
      "Avoid smoking and dusty environments",
    ],
    whenToSeeDoctor: "See a doctor if symptoms last more than 10 days, you develop a high fever, or you have ear pain or difficulty breathing.",
    commonIn: "Common throughout the year in Nigeria.",
    prevalence: "Very common",
  },
  {
    id: "hypertension",
    name: "High Blood Pressure (Hypertension)",
    description: "A condition where blood pressure in the arteries is persistently elevated, putting strain on the heart.",
    symptoms: ["severe_headache", "dizziness", "blurred_vision", "chest_pain", "shortness_of_breath", "fatigue", "nausea"],
    requiredSymptoms: ["severe_headache"],
    triageLevel: "seek_doctor",
    triageDescription: "High blood pressure symptoms can indicate a hypertensive crisis. Please seek medical attention promptly.",
    selfCareAdvice: [
      "Sit or lie down calmly and breathe slowly — do not panic",
      "Avoid salty, fatty foods and reduce salt intake",
      "Limit or avoid alcohol",
      "Do not take someone else's blood pressure medication",
      "Check your blood pressure at a pharmacy if possible",
    ],
    whenToSeeDoctor: "See a doctor today. If you have a very severe headache, chest pain, or difficulty breathing alongside dizziness, go to the emergency room immediately.",
    commonIn: "Very common in Nigerian adults over 40, and increasingly in younger people.",
    prevalence: "Common",
  },
  {
    id: "gastroenteritis",
    name: "Gastroenteritis (Stomach Infection)",
    description: "An intestinal infection causing inflammation of the stomach and intestines, usually from contaminated food or water.",
    symptoms: ["vomiting", "diarrhea", "stomach_pain", "nausea", "fatigue", "low_grade_fever", "bloating", "loss_of_appetite"],
    requiredSymptoms: ["vomiting", "diarrhea"],
    triageLevel: "monitor",
    triageDescription: "Most cases resolve within a few days. The biggest risk is dehydration — drink fluids constantly.",
    selfCareAdvice: [
      "Drink oral rehydration salts (ORS) or homemade solution (1 litre water + 6 teaspoons sugar + half teaspoon salt)",
      "Take small sips of fluid every few minutes, especially if vomiting",
      "Avoid solid food until vomiting stops, then try plain foods like bread, rice, or banana",
      "Avoid dairy, fatty foods, and spicy foods until fully recovered",
      "Wash hands frequently and avoid preparing food for others",
    ],
    whenToSeeDoctor: "Go to a clinic if you cannot keep any fluids down for more than 24 hours, there is blood in your stool, you have a high fever, or you feel very weak and confused.",
    commonIn: "Common in Nigeria, especially during rainy season or after eating from street food vendors.",
    prevalence: "Very common",
  },
  {
    id: "urinary_tract_infection",
    name: "Urinary Tract Infection (UTI)",
    description: "A bacterial infection affecting any part of the urinary system, most commonly the bladder and urethra.",
    symptoms: ["painful_urination", "frequent_urination", "dark_urine", "blood_in_urine", "stomach_pain", "low_grade_fever", "fatigue", "back_pain"],
    requiredSymptoms: ["painful_urination"],
    triageLevel: "seek_doctor",
    triageDescription: "UTIs need antibiotic treatment. Please see a doctor or pharmacist for a prescription.",
    selfCareAdvice: [
      "Drink plenty of clean water — aim for 8 or more glasses a day",
      "Avoid holding urine — use the toilet when you need to",
      "Wipe from front to back after using the toilet",
      "Avoid sugary drinks, alcohol, and caffeine which irritate the bladder",
      "Do not use douches or perfumed soaps near the genital area",
    ],
    whenToSeeDoctor: "See a doctor or pharmacist promptly to get a urine test and appropriate antibiotics. If you have back pain, fever, or feel very unwell, go to a clinic today.",
    commonIn: "Common in women of all ages across Nigeria.",
    prevalence: "Common",
  },
  {
    id: "malaria_severe",
    name: "Severe Malaria (Possible)",
    description: "A life-threatening form of malaria involving organ dysfunction or neurological symptoms.",
    symptoms: ["high_fever", "confusion", "chills", "jaundice", "vomiting", "shortness_of_breath", "pale_skin"],
    requiredSymptoms: ["high_fever", "confusion"],
    triageLevel: "emergency",
    triageDescription: "These symptoms could indicate severe malaria, which is a medical emergency.",
    selfCareAdvice: [
      "Go to the emergency room immediately — do not wait",
      "Have someone accompany you if possible",
      "Do not take antimalarials without medical supervision",
    ],
    whenToSeeDoctor: "Go to the nearest emergency room or hospital immediately. This is a medical emergency.",
    commonIn: "Nigeria — particularly in rural and peri-urban areas during or after malaria season.",
    prevalence: "Medical emergency",
  },
  {
    id: "meningitis",
    name: "Meningitis (Possible)",
    description: "Inflammation of the membranes surrounding the brain and spinal cord, which can be life-threatening.",
    symptoms: ["severe_headache", "stiff_neck", "high_fever", "confusion", "vomiting", "rash", "blurred_vision"],
    requiredSymptoms: ["severe_headache", "stiff_neck"],
    triageLevel: "emergency",
    triageDescription: "A combination of stiff neck, severe headache, and fever can indicate meningitis — a medical emergency.",
    selfCareAdvice: [
      "Go to the nearest hospital emergency room immediately",
      "Do not take any medication before being seen by a doctor",
      "Inform the hospital staff of all your symptoms including stiff neck",
    ],
    whenToSeeDoctor: "Go to an emergency room right now. Do not wait. Meningitis can be life-threatening within hours.",
    commonIn: "Occurs across Nigeria, with periodic outbreaks in the meningitis belt of northern Nigeria.",
    prevalence: "Less common but serious",
  },
  {
    id: "diabetes",
    name: "Possible Diabetes Symptoms",
    description: "Diabetes is a chronic condition where blood sugar levels are too high due to insulin problems.",
    symptoms: ["excessive_thirst", "excessive_hunger", "frequent_urination", "fatigue", "blurred_vision", "weight_loss", "dizziness", "swelling"],
    requiredSymptoms: ["excessive_thirst", "frequent_urination"],
    triageLevel: "seek_doctor",
    triageDescription: "These symptoms are consistent with undiagnosed or poorly controlled diabetes. Please see a doctor for a blood sugar test.",
    selfCareAdvice: [
      "Reduce your intake of sugary drinks, white rice, bread, and processed foods",
      "Increase physical activity — even short walks help",
      "Eat regular balanced meals and avoid skipping meals",
      "Monitor your weight and keep a note of your symptoms to share with your doctor",
      "Avoid self-medicating",
    ],
    whenToSeeDoctor: "See a doctor soon for a fasting blood glucose test. If you feel very unwell, dizzy, or confused, go to a clinic today.",
    commonIn: "Increasingly common in Nigeria — type 2 diabetes affects millions of adults.",
    prevalence: "Common",
  },
  {
    id: "hepatitis",
    name: "Possible Hepatitis",
    description: "Inflammation of the liver, often caused by viral infections (Hepatitis A, B, C) or alcohol.",
    symptoms: ["jaundice", "fatigue", "stomach_pain", "loss_of_appetite", "nausea", "dark_urine", "vomiting", "joint_pain"],
    requiredSymptoms: ["jaundice"],
    triageLevel: "seek_doctor",
    triageDescription: "Yellow eyes or skin alongside fatigue and stomach pain may indicate hepatitis. Please seek medical evaluation.",
    selfCareAdvice: [
      "Rest and avoid alcohol completely",
      "Eat small, easily digestible meals",
      "Drink plenty of clean water",
      "Avoid sharing razors, needles, or toothbrushes",
      "Do not take paracetamol without medical advice as it can worsen liver damage",
    ],
    whenToSeeDoctor: "See a doctor today for liver function tests and hepatitis screening. If you have severe pain or cannot keep fluids down, go to the emergency room.",
    commonIn: "Hepatitis B is endemic in Nigeria, affecting a significant portion of the population.",
    prevalence: "Common",
  },
  {
    id: "anemia",
    name: "Possible Anaemia",
    description: "A condition where you don't have enough red blood cells to carry adequate oxygen to your body's tissues.",
    symptoms: ["fatigue", "pale_skin", "dizziness", "shortness_of_breath", "cold_extremities", "headache", "muscle_weakness"],
    requiredSymptoms: ["fatigue", "pale_skin"],
    triageLevel: "monitor",
    triageDescription: "These symptoms suggest possible anaemia. A simple blood test can confirm this.",
    selfCareAdvice: [
      "Eat iron-rich foods: red meat, leafy green vegetables (ugwu, spinach), beans, fish",
      "Eat foods high in vitamin C alongside iron-rich foods to improve absorption",
      "Rest when you feel tired — do not push yourself",
      "Avoid tea or coffee directly after meals as they reduce iron absorption",
      "Consider visiting a pharmacy for iron supplements after a doctor's recommendation",
    ],
    whenToSeeDoctor: "See a doctor for a full blood count (FBC) test. If you feel faint, have chest pain, or are very pale, seek care promptly.",
    commonIn: "Common in Nigeria, especially in women of childbearing age, children, and people with malaria history.",
    prevalence: "Common",
  },
  {
    id: "peptic_ulcer",
    name: "Peptic Ulcer Disease",
    description: "A sore or ulcer that develops on the lining of the stomach or upper small intestine, often caused by the H. pylori bacteria or overuse of pain medications.",
    symptoms: ["burning_stomach", "stomach_pain", "nausea", "bloating", "loss_of_appetite", "vomiting", "fatigue", "weight_loss"],
    requiredSymptoms: ["burning_stomach"],
    triageLevel: "seek_doctor",
    triageDescription: "Stomach ulcer symptoms require medical assessment to confirm diagnosis and rule out complications.",
    selfCareAdvice: [
      "Eat small, regular meals — do not skip meals or eat on an empty stomach for long",
      "Avoid spicy foods, fried foods, alcohol, and painkillers like ibuprofen or aspirin",
      "Drink plenty of clean water",
      "Avoid lying down immediately after eating — wait at least an hour",
      "Reduce stress where possible, as stress can worsen ulcer pain",
    ],
    whenToSeeDoctor: "See a doctor for proper testing and treatment. Go to the emergency room immediately if you vomit blood or notice very dark or tarry stools.",
    commonIn: "Very common in Nigeria, often linked to H. pylori infection and use of over-the-counter pain medication.",
    prevalence: "Very common",
  },
  {
    id: "intestinal_worms",
    name: "Intestinal Worm Infestation",
    description: "Parasitic worms (roundworm, tapeworm, hookworm) living in the gut, spread through contaminated food, water, or soil.",
    symptoms: ["anal_itching", "stomach_pain", "weight_loss", "fatigue", "loss_of_appetite", "bloating", "nausea"],
    requiredSymptoms: ["anal_itching"],
    triageLevel: "monitor",
    triageDescription: "Worm infections are common and treatable. A single dose of deworming medication usually clears the infection.",
    selfCareAdvice: [
      "Deworm with mebendazole or albendazole — available at most pharmacies without prescription",
      "Wash hands thoroughly with soap before eating and after using the toilet",
      "Drink only clean, treated or boiled water",
      "Wash fruits and vegetables well before eating",
      "Avoid walking barefoot on soil",
    ],
    whenToSeeDoctor: "See a doctor or pharmacist for deworming medication. If symptoms are severe, you lose a lot of weight, or you see worms in your stool, seek medical attention.",
    commonIn: "Very common in Nigeria, especially in children and in communities with limited access to clean water and sanitation.",
    prevalence: "Very common",
  },
  {
    id: "dengue_fever",
    name: "Dengue Fever (Possible)",
    description: "A mosquito-borne viral infection causing severe flu-like symptoms, increasingly reported in West Africa.",
    symptoms: ["high_fever", "severe_joint_pain", "pain_behind_eyes", "headache", "rash", "body_aches", "nausea", "fatigue", "eye_redness"],
    requiredSymptoms: ["high_fever", "severe_joint_pain"],
    triageLevel: "seek_doctor",
    triageDescription: "Dengue can become serious quickly. Please seek medical evaluation promptly.",
    selfCareAdvice: [
      "Rest completely and stay in a cool environment",
      "Drink plenty of fluids — water, coconut water, or ORS — to prevent dehydration",
      "Take paracetamol for fever and pain — do NOT take ibuprofen or aspirin as they can cause bleeding",
      "Use mosquito repellent and sleep under a net to prevent further bites",
      "Monitor for warning signs: severe abdominal pain, vomiting blood, or bleeding from gums",
    ],
    whenToSeeDoctor: "See a doctor today for a dengue test. Go to the emergency room immediately if you develop severe abdominal pain, blood in vomit, or difficulty breathing.",
    commonIn: "Increasingly reported in urban Nigeria, particularly Lagos and other coastal areas with high mosquito density.",
    prevalence: "Emerging — becoming more common",
  },
  {
    id: "sickle_cell_crisis",
    name: "Sickle Cell Crisis (Possible)",
    description: "Severe pain episodes caused by sickle-shaped red blood cells blocking blood flow, common in those with sickle cell disease.",
    symptoms: ["severe_joint_pain", "chest_pain", "pale_skin", "fatigue", "jaundice", "shortness_of_breath", "dizziness", "swelling"],
    requiredSymptoms: ["severe_joint_pain", "pale_skin"],
    triageLevel: "seek_doctor",
    triageDescription: "A sickle cell pain crisis needs prompt medical management. Do not try to manage severe pain at home alone.",
    selfCareAdvice: [
      "Rest in a comfortable position and keep warm — cold temperatures can worsen a crisis",
      "Drink lots of fluids to keep blood flowing",
      "Take your regular prescribed pain medication if you have it",
      "Avoid physical overexertion, cold water, and stress which can trigger crises",
      "If you have oxygen at home and are prescribed to use it, do so now",
    ],
    whenToSeeDoctor: "See a doctor today. If pain is very severe, you have chest pain, fever, or difficulty breathing, go to the emergency room immediately.",
    commonIn: "Nigeria has the highest number of sickle cell disease patients in the world, estimated at 2-3% of the population.",
    prevalence: "Very common",
  },
  {
    id: "appendicitis",
    name: "Appendicitis (Possible)",
    description: "Inflammation of the appendix, causing severe abdominal pain that typically starts around the navel and moves to the lower right abdomen.",
    symptoms: ["lower_right_pain", "nausea", "vomiting", "low_grade_fever", "high_fever", "loss_of_appetite", "stomach_pain"],
    requiredSymptoms: ["lower_right_pain"],
    triageLevel: "emergency",
    triageDescription: "Pain in the lower right abdomen with fever and nausea may indicate appendicitis — a medical emergency requiring surgery.",
    selfCareAdvice: [
      "Go to the nearest hospital or emergency room immediately — do not wait",
      "Do not eat or drink anything until you have been seen by a doctor",
      "Do not take pain medication before being assessed — it can mask symptoms",
      "Do not apply heat to the abdomen",
    ],
    whenToSeeDoctor: "Go to the emergency room immediately. Appendicitis requires urgent surgery. A ruptured appendix can be fatal.",
    commonIn: "Occurs across all age groups in Nigeria. Delays in seeking care are a major cause of complications.",
    prevalence: "Common — medical emergency",
  },
  {
    id: "cholera",
    name: "Cholera (Possible)",
    description: "A severe bacterial infection of the small intestine causing extreme diarrhea and vomiting, spread through contaminated water or food.",
    symptoms: ["watery_diarrhea", "vomiting", "fatigue", "muscle_weakness", "dizziness", "stomach_pain"],
    requiredSymptoms: ["watery_diarrhea", "vomiting"],
    triageLevel: "emergency",
    triageDescription: "Profuse watery diarrhea and vomiting together can cause life-threatening dehydration within hours.",
    selfCareAdvice: [
      "Start oral rehydration salts (ORS) immediately — drink continuously, a sip at a time",
      "If ORS is not available, make a home solution: 1 litre of clean water + 6 teaspoons of sugar + half teaspoon of salt",
      "Go to hospital as soon as possible for IV fluids and antibiotics",
      "Do not share any utensils or toilet facilities with others while sick",
      "Wash hands constantly with soap and water",
    ],
    whenToSeeDoctor: "Go to the emergency room immediately. Cholera can kill within hours if dehydration is severe. This is a medical emergency.",
    commonIn: "Occurs periodically in Nigeria, especially after floods or in areas with poor water treatment. Major outbreaks have been declared in multiple states.",
    prevalence: "Outbreak-prone — emergency condition",
  },
  {
    id: "skin_infection",
    name: "Skin Infection (Cellulitis)",
    description: "A bacterial infection of the skin and the tissues beneath it, causing redness, warmth, swelling, and pain in the affected area.",
    symptoms: ["skin_warmth", "swelling", "rash", "low_grade_fever", "high_fever", "fatigue", "itching"],
    requiredSymptoms: ["skin_warmth"],
    triageLevel: "seek_doctor",
    triageDescription: "Skin infections can spread quickly and require antibiotic treatment. Please see a doctor.",
    selfCareAdvice: [
      "Keep the affected area clean with clean water and mild soap",
      "Do not squeeze, pop, or cut the infected area",
      "Cover with a clean bandage to prevent spreading",
      "Elevate the affected limb if possible to reduce swelling",
      "Do not share towels or clothing with others while infected",
    ],
    whenToSeeDoctor: "See a doctor today for antibiotic treatment. Go to the emergency room if the redness is spreading rapidly, you have a high fever, or you feel very unwell.",
    commonIn: "Common in Nigeria, often starting from minor cuts, insect bites, or skin conditions that get infected.",
    prevalence: "Common",
  },
  {
    id: "conjunctivitis",
    name: "Conjunctivitis (Pink Eye)",
    description: "Inflammation of the clear membrane covering the white of the eye, usually caused by bacteria or viruses. Highly contagious.",
    symptoms: ["eye_redness", "eye_discharge", "itching", "low_grade_fever", "headache"],
    requiredSymptoms: ["eye_redness", "eye_discharge"],
    triageLevel: "monitor",
    triageDescription: "Most cases of pink eye clear up within a week with proper hygiene and eye care.",
    selfCareAdvice: [
      "Clean the eye gently with a clean, damp cloth — wipe from inner to outer corner",
      "Do not rub or touch your eyes — this spreads the infection",
      "Wash hands frequently with soap and water",
      "Do not share towels, pillowcases, or eye makeup with anyone",
      "Avoid wearing contact lenses until eyes are fully healed",
    ],
    whenToSeeDoctor: "See a pharmacist for antibiotic eye drops if there is yellow discharge. See a doctor if vision is affected, pain is severe, or symptoms do not improve after 5 days.",
    commonIn: "Extremely common in Nigeria — epidemics of 'Apollo' conjunctivitis occur regularly, especially in schools and crowded areas.",
    prevalence: "Very common",
  },
];

export function getSymptomCategories(): SymptomCategory[] {
  return SYMPTOM_CATEGORIES;
}

export function getDiseases(): DiseaseRule[] {
  return DISEASE_RULES;
}

function calculateConfidence(rule: DiseaseRule, inputSymptoms: string[]): number {
  const matched = rule.symptoms.filter((s) => inputSymptoms.includes(s));
  if (matched.length === 0) return 0;

  if (rule.requiredSymptoms) {
    const hasRequired = rule.requiredSymptoms.every((s) => inputSymptoms.includes(s));
    if (!hasRequired) return 0;
  }

  const baseScore = matched.length / rule.symptoms.length;
  const inputCoverage = matched.length / inputSymptoms.length;
  const confidence = Math.min(0.95, (baseScore * 0.7 + inputCoverage * 0.3));
  return Math.round(confidence * 100) / 100;
}

export function analyzeSymptoms(
  inputSymptoms: string[],
  age?: number | null,
  gender?: string | null,
  durationDays?: number | null
): {
  topCondition: MatchedCondition;
  otherConditions: MatchedCondition[];
  generalAdvice: string;
  disclaimer: string;
} {
  const scored = DISEASE_RULES.map((rule) => {
    const confidence = calculateConfidence(rule, inputSymptoms);
    const matchedSymptoms = rule.symptoms.filter((s) => inputSymptoms.includes(s));
    const matchedLabels = matchedSymptoms.map((id) => {
      for (const cat of SYMPTOM_CATEGORIES) {
        const sym = cat.symptoms.find((s) => s.id === id);
        if (sym) return sym.label;
      }
      return id;
    });

    return {
      disease: rule.name,
      confidence,
      matchedSymptoms: matchedLabels,
      triageLevel: rule.triageLevel,
      triageDescription: rule.triageDescription,
      selfCareAdvice: rule.selfCareAdvice,
      whenToSeeDoctor: rule.whenToSeeDoctor,
      commonIn: rule.commonIn,
    };
  })
    .filter((r) => r.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);

  const top = scored[0] ?? {
    disease: "No specific condition matched",
    confidence: 0,
    matchedSymptoms: [],
    triageLevel: "monitor",
    triageDescription: "Your symptoms don't clearly match a specific condition in our database. Please monitor them.",
    selfCareAdvice: [
      "Rest and stay hydrated",
      "Monitor how your symptoms change over the next 24-48 hours",
      "If symptoms worsen or new ones appear, seek medical attention",
    ],
    whenToSeeDoctor: "See a doctor if your symptoms are getting worse, have lasted more than 3 days, or you feel very unwell.",
  };

  const others = scored.slice(1, 4);

  let generalAdvice =
    "Based on your symptoms, we have put together some guidance below. Remember to stay hydrated, get rest, and monitor how you feel.";

  if (inputSymptoms.includes("high_fever") || inputSymptoms.includes("low_grade_fever")) {
    generalAdvice +=
      " For fever, paracetamol is generally safe for adults — take it as directed on the packaging.";
  }

  if (durationDays && durationDays > 5) {
    generalAdvice +=
      " Your symptoms have lasted several days, which increases the importance of seeing a healthcare provider.";
  }

  const disclaimer =
    "This advisory is for informational purposes only and does not replace a professional medical diagnosis. Always consult a qualified healthcare provider for proper evaluation and treatment. In an emergency, go to your nearest hospital immediately.";

  return { topCondition: top, otherConditions: others, generalAdvice, disclaimer };
}
