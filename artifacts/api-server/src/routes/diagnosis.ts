import { Router } from "express";
import { db, symptomSessionsTable } from "@workspace/db";
import { getSymptomCategories, getDiseases, analyzeSymptoms, SYMPTOM_CATEGORIES } from "../lib/diagnosticEngine";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

function resolveSymptomLabels(ids: string[]): string[] {
  return ids.map((id) => {
    for (const cat of SYMPTOM_CATEGORIES) {
      const sym = cat.symptoms.find((s) => s.id === id);
      if (sym) return sym.label;
    }
    return id.replace(/_/g, " ");
  });
}

async function aiEnhancedAnalysis(
  symptoms: string[],
  age: number | null | undefined,
  gender: string | null | undefined,
  durationDays: number | null | undefined,
  ruleBasedResult: ReturnType<typeof analyzeSymptoms>
): Promise<ReturnType<typeof analyzeSymptoms>> {
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

  const systemPrompt = `You are a clinical decision support tool designed specifically for patients in Nigeria and underserved West African communities. 
Your role is to analyze reported symptoms and provide accurate, compassionate, and actionable health guidance.

You must:
- Prioritise conditions common in Nigeria and sub-Saharan Africa (malaria, typhoid, sickle cell, hypertension, hepatitis B, gastroenteritis, UTIs, anaemia, meningitis, diabetes)
- Account for local context: limited healthcare access, common self-medication risks, seasonal patterns (rainy season malaria, harmattan respiratory issues), food/water contamination, and endemic diseases
- Use plain, calm, non-alarming language that patients without medical training can understand
- Provide specific, practical self-care steps relevant to the local context (e.g. oral rehydration salts, paracetamol availability, community health workers)
- Be appropriately conservative with triage — when in doubt, lean toward recommending professional evaluation
- Never fabricate test results or diagnoses — only suggest possibilities based on symptoms
- Consider overlapping conditions (e.g. malaria can present like typhoid, and both can coexist)

IMPORTANT: You must respond ONLY with valid JSON in exactly this structure — no markdown, no explanation, no extra text:
{
  "topCondition": {
    "disease": "string — full condition name",
    "confidence": number between 0.0 and 0.95,
    "matchedSymptoms": ["array of symptom labels that pointed to this condition"],
    "triageLevel": "emergency" | "seek_doctor" | "monitor" | "self_care",
    "triageDescription": "string — 1-2 sentences explaining the urgency level to a patient",
    "selfCareAdvice": ["array of 4-6 specific, actionable advice items in plain language"],
    "whenToSeeDoctor": "string — clear guidance on when and why to seek care",
    "commonIn": "string — epidemiological context for Nigeria"
  },
  "otherConditions": [
    {
      "disease": "string",
      "confidence": number,
      "matchedSymptoms": [],
      "triageLevel": "emergency" | "seek_doctor" | "monitor" | "self_care",
      "triageDescription": "string",
      "selfCareAdvice": [],
      "whenToSeeDoctor": "string",
      "commonIn": "string"
    }
  ],
  "generalAdvice": "string — 2-3 sentences of practical general advice",
  "disclaimer": "This advisory is for informational purposes only and does not replace a professional medical diagnosis. Always consult a qualified healthcare provider for proper evaluation and treatment. In an emergency, go to your nearest hospital immediately."
}

The otherConditions array should contain 2-3 other plausible conditions (not the top one). If fewer alternatives are plausible, return fewer.`;

  const userPrompt = `Patient profile: ${patientContext || "Not provided"}

Reported symptoms:
${symptomLabels.map((s) => `- ${s}`).join("\n")}

Rule-based engine candidate conditions:
${candidateConditions}

Based on these symptoms and the Nigerian health context, provide your clinical assessment. Be especially thoughtful about the triage level — err on the side of caution for vulnerable patients. Return only valid JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 2048,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from AI");

  const parsed = JSON.parse(content);

  if (
    !parsed.topCondition ||
    !parsed.topCondition.disease ||
    !parsed.topCondition.triageLevel ||
    !Array.isArray(parsed.topCondition.selfCareAdvice)
  ) {
    throw new Error("Invalid AI response structure");
  }

  if (
    ruleBasedResult.topCondition.triageLevel === "emergency" &&
    parsed.topCondition.triageLevel !== "emergency"
  ) {
    parsed.topCondition.triageLevel = "emergency";
  }

  return {
    topCondition: parsed.topCondition,
    otherConditions: Array.isArray(parsed.otherConditions) ? parsed.otherConditions : [],
    generalAdvice: parsed.generalAdvice || ruleBasedResult.generalAdvice,
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

  const ruleResult = analyzeSymptoms(symptoms, age, gender, durationDays);

  let finalResult = ruleResult;
  try {
    finalResult = await aiEnhancedAnalysis(symptoms, age, gender, durationDays, ruleResult);
  } catch {
    // Silently fall back to rule-based result if AI fails
  }

  const session = req.session as { userId?: number };
  let sessionId: number | null = null;

  if (saveSession !== false) {
    try {
      const [saved] = await db
        .insert(symptomSessionsTable)
        .values({
          userId: session.userId ?? null,
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
