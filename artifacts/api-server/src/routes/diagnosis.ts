import { Router } from "express";
import { db, symptomSessionsTable } from "@workspace/db";
import { getSymptomCategories, getDiseases, analyzeSymptoms, SYMPTOM_CATEGORIES } from "../lib/diagnosticEngine";
import { openai } from "@workspace/integrations-openai-ai-server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

function resolveSymptomLabels(ids: string[]): string[] {
  return ids.map((id) => {
    for (const cat of SYMPTOM_CATEGORIES) {
      const sym = cat.symptoms.find((s) => s.id === id);
      if (sym) return sym.label;
    }
    return id.replace(/_/g, " ");
  });
}

const geminiResponseSchema = {
  type: "object",
  properties: {
    primary_advisory: {
      type: "string",
      description: "Name of the top probable condition (from the approved list of 20)."
    },
    secondary_advisory: {
      type: "string",
      nullable: true,
      description: "Name of the second probable condition (or null if none)."
    },
    confidence_score: {
      type: "integer",
      description: "Integer from 1 to 100 representing percentage match."
    },
    triage_level: {
      type: "string",
      enum: ["Self-Care Recommended", "Visit a Clinic Soon", "Seek Immediate Medical Attention"],
      description: "Must be exactly one of: 'Self-Care Recommended', 'Visit a Clinic Soon', or 'Seek Immediate Medical Attention'."
    },
    triage_color_code: {
      type: "string",
      enum: ["green", "amber", "red"],
      description: "green for Self-Care, amber for Clinic, red for Immediate."
    },
    first_aid_steps: {
      type: "array",
      items: {
        type: "string"
      },
      description: "List of clear, actionable first-aid advice steps."
    },
    disclaimer: {
      type: "string",
      description: "Disclaimer text."
    }
  },
  required: [
    "primary_advisory",
    "secondary_advisory",
    "confidence_score",
    "triage_level",
    "triage_color_code",
    "first_aid_steps",
    "disclaimer"
  ]
};

function mapTriageLevelToFrontend(triageLevel: string): "emergency" | "seek_doctor" | "monitor" | "self_care" {
  switch (triageLevel) {
    case "Seek Immediate Medical Attention":
      return "emergency";
    case "Visit a Clinic Soon":
      return "seek_doctor";
    case "Self-Care Recommended":
    default:
      return "self_care";
  }
}

async function aiEnhancedAnalysis(
  symptoms: string[],
  age: number | null | undefined,
  gender: string | null | undefined,
  durationDays: number | null | undefined,
  ruleBasedResult: ReturnType<typeof analyzeSymptoms>
): Promise<ReturnType<typeof analyzeSymptoms>> {
  if (!genAI) {
    throw new Error("Gemini API is not configured. GEMINI_API_KEY is missing.");
  }

  const symptomLabels = resolveSymptomLabels(symptoms);
  const candidateConditions = [ruleBasedResult.topCondition, ...ruleBasedResult.otherConditions]
    .map((c) => `- ${c.disease} (rule confidence: ${Math.round(c.confidence * 100)}%, triage: ${c.triageLevel})`)
    .join("\n");

  const patientContext = [
    age ? `Age: ${age}` : null,
    gender ? `Gender: ${gender}` : null,
    durationDays ? `Duration: ${durationDays} days` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const systemPrompt = `Gemini-Powered Health Advisory Engine System Architecture & Your Role
You are Gemini, operating as the core AI reasoning and diagnostic engine for a Mobile-Friendly Web-Based Diagnosis Advisory System.  You sit at the center of the following tech stack:
Frontend: React.js (collects user symptoms, demographics, and symptom duration).  
Backend: Node.js (acts as the API gateway, orchestrates database logs, and securely passes user payloads to you via the Gemini API).  
Database: PostgreSQL (stores session histories, user demographics, and your JSON outputs).  

Your Objective:
The backend will send you a JSON payload containing a user's self-reported symptoms, age, gender, and symptom duration. You must analyze this data, strictly constrain your reasoning to the West African/Nigerian epidemiological context, and return a structured JSON response containing the probable condition, confidence score, triage level, and first-aid advice.

Strict Diagnostic Scope (The 20 Conditions)
You are rigidly constrained to analyzing symptoms against only the following 20 conditions. If a user's symptoms strongly suggest a condition outside this list, default to a safe, generic triage recommendation (e.g., "Unidentified Viral/Bacterial Infection") and immediately recommend visiting a clinic.
- Mosquito-Borne & Infectious: Malaria, Severe Malaria, Typhoid Fever, Dengue Fever, Hepatitis.
- Gastrointestinal: Gastroenteritis, Cholera, Peptic Ulcer Disease, Intestinal Worm Infestation.
- Chronic & Genetic: High Blood Pressure (Hypertension), Diabetes, Sickle Cell Crisis, Anaemia.
- Respiratory & Neurological: Influenza (Flu), Common Cold, Meningitis.
- Localized Infections: Urinary Tract Infection (UTI), Skin Infection (Cellulitis), Conjunctivitis (Pink Eye), Appendicitis.

Processing Logic & Triage Rules
When evaluating the user's payload, apply the following clinical safety guardrails:
- Endemic Weighting: Weight symptoms heavily toward endemic diseases (e.g., fever + chills + body ache = prioritize Malaria or Typhoid over a generic cold).
- Ambiguity Handling: If symptoms overlap (e.g., early Malaria vs. Typhoid), explicitly mention both and elevate the triage level to encourage clinical testing.
- Triage Assignment:
  * "Self-Care Recommended": Only for highly probable, mild conditions (e.g., Common Cold, mild GI upset).
  * "Visit a Clinic Soon": For moderate issues requiring standard testing or prescription meds (e.g., Malaria, UTI, Typhoid).
  * "Seek Immediate Medical Attention": For red-flag symptoms (e.g., confusion, severe dehydration, stiff neck, acute abdominal pain indicating Severe Malaria, Cholera, Meningitis, or Appendicitis).
- No Prescribing: Never advise the purchase or ingestion of specific prescription medications (e.g., "Take Ciprofloxacin"). Limit advice to symptom management (e.g., ORS, hydration, rest, paracetamol for fever).

You must respond ONLY with valid JSON conforming to the requested schema.`;

  const userPrompt = JSON.stringify({
    symptoms: symptomLabels,
    age: age ?? null,
    gender: gender ?? null,
    durationDays: durationDays ?? null,
    ruleBasedCandidates: candidateConditions
  });

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nUser Payload:\n${userPrompt}` }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: geminiResponseSchema as any,
    }
  });

  const content = result.response.text();
  if (!content) throw new Error("Empty response from Gemini");

  const parsed = JSON.parse(content);

  const mappedTopCondition = {
    disease: parsed.primary_advisory,
    confidence: parsed.confidence_score / 100,
    matchedSymptoms: symptomLabels,
    triageLevel: mapTriageLevelToFrontend(parsed.triage_level),
    triageDescription: parsed.triage_level,
    selfCareAdvice: parsed.first_aid_steps,
    whenToSeeDoctor: parsed.triage_level === "Seek Immediate Medical Attention"
      ? "Seek immediate medical attention at the nearest emergency room."
      : parsed.triage_level === "Visit a Clinic Soon"
      ? "Please visit a clinic soon for testing and professional evaluation."
      : "Monitor your symptoms and seek care if they worsen.",
  };

  const mappedOtherConditions = parsed.secondary_advisory
    ? [
        {
          disease: parsed.secondary_advisory,
          confidence: Math.round(parsed.confidence_score * 0.7) / 100,
          matchedSymptoms: [] as string[],
          triageLevel: "monitor",
          triageDescription: "Plausible alternative condition.",
          selfCareAdvice: [] as string[],
          whenToSeeDoctor: "",
        }
      ]
    : [];

  if (
    ruleBasedResult.topCondition.triageLevel === "emergency" &&
    mappedTopCondition.triageLevel !== "emergency"
  ) {
    mappedTopCondition.triageLevel = "emergency";
    mappedTopCondition.triageDescription = "Seek Immediate Medical Attention";
  }

  return {
    topCondition: mappedTopCondition,
    otherConditions: mappedOtherConditions,
    generalAdvice: parsed.first_aid_steps.join(" "),
    disclaimer: parsed.disclaimer || ruleBasedResult.disclaimer,
  };
}

router.get("/diagnosis/symptoms", async (_req, res): Promise<void> => {
  const categories = getSymptomCategories();
  res.json(categories);
});

router.get("/diagnosis/diseases", async (_req, res): Promise<void> => {
  const diseases = getDiseases().map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    commonSymptoms: d.symptoms.slice(0, 6),
    triageLevel: d.triageLevel,
    prevalence: d.prevalence ?? null,
  }));
  res.json(diseases);
});

router.post("/diagnosis/analyze", async (req, res): Promise<void> => {
  const { symptoms, age, gender, durationDays, saveSession } = req.body;

  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    res.status(400).json({ error: "Please select at least one symptom" });
    return;
  }

  const session = req.session as { userId?: number };

  if (saveSession === true && !session.userId) {
    res.status(401).json({ error: "Authentication required to save session history" });
    return;
  }

  const ruleResult = analyzeSymptoms(symptoms, age, gender, durationDays);

  let finalResult = ruleResult;
  try {
    finalResult = await aiEnhancedAnalysis(symptoms, age, gender, durationDays, ruleResult);
  } catch (err) {
    // Silently fall back to rule-based result if AI fails
  }

  let sessionId: number | null = null;

  if (saveSession !== false && session.userId) {
    try {
      const [saved] = await db
        .insert(symptomSessionsTable)
        .values({
          userId: session.userId,
          symptoms,
          age: age ?? null,
          gender: gender ?? null,
          durationDays: durationDays ?? null,
          topCondition: finalResult.topCondition.disease,
          triageLevel: finalResult.topCondition.triageLevel,
          result: finalResult as unknown as Record<string, unknown>,
        })
        .returning();
      sessionId = saved.id;
    } catch {
      // Non-critical — continue without saving
    }
  }

  res.json({
    sessionId,
    topCondition: finalResult.topCondition,
    otherConditions: finalResult.otherConditions,
    generalAdvice: finalResult.generalAdvice,
    disclaimer: finalResult.disclaimer,
    analyzedAt: new Date().toISOString(),
  });
});

export default router;
