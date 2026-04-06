import { Router } from "express";
import { db, symptomSessionsTable } from "@workspace/db";
import { getSymptomCategories, getDiseases, analyzeSymptoms } from "../lib/diagnosticEngine";

const router = Router();

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

  const result = analyzeSymptoms(symptoms, age, gender, durationDays);

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
          topCondition: result.topCondition.disease,
          triageLevel: result.topCondition.triageLevel,
          result: result as unknown as Record<string, unknown>,
        })
        .returning();
      sessionId = saved.id;
    } catch {
      // Non-critical — continue without saving
    }
  }

  res.json({
    sessionId,
    topCondition: result.topCondition,
    otherConditions: result.otherConditions,
    generalAdvice: result.generalAdvice,
    disclaimer: result.disclaimer,
    analyzedAt: new Date().toISOString(),
  });
});

export default router;
