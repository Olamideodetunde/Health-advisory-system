import { Router } from "express";
import { db, symptomSessionsTable } from "@workspace/db";
import { eq, desc, isNull, or } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/sessions/stats", requireAuth, async (req, res): Promise<void> => {
  const session = req.session as { userId?: number };
  const userId = session.userId!;

  const sessions = await db
    .select()
    .from(symptomSessionsTable)
    .where(eq(symptomSessionsTable.userId, userId))
    .orderBy(desc(symptomSessionsTable.createdAt));

  const totalSessions = sessions.length;

  const triageBreakdown: Record<string, number> = {};
  const conditionCounts: Record<string, number> = {};

  for (const s of sessions) {
    triageBreakdown[s.triageLevel] = (triageBreakdown[s.triageLevel] ?? 0) + 1;
    conditionCounts[s.topCondition] = (conditionCounts[s.topCondition] ?? 0) + 1;
  }

  const topConditions = Object.entries(conditionCounts)
    .map(([condition, count]) => ({ condition, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentSession = sessions[0] ?? null;

  res.json({
    totalSessions,
    triageBreakdown,
    topConditions,
    recentSession: recentSession
      ? {
          ...recentSession,
          symptoms: recentSession.symptoms,
          createdAt: recentSession.createdAt.toISOString(),
        }
      : null,
  });
});

router.get("/sessions", requireAuth, async (req, res): Promise<void> => {
  const session = req.session as { userId?: number };
  const userId = session.userId!;

  const sessions = await db
    .select()
    .from(symptomSessionsTable)
    .where(eq(symptomSessionsTable.userId, userId))
    .orderBy(desc(symptomSessionsTable.createdAt));

  res.json(
    sessions.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
    }))
  );
});

router.get("/sessions/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid session ID" });
    return;
  }

  const session = req.session as { userId?: number };
  const userId = session.userId!;

  const [found] = await db
    .select()
    .from(symptomSessionsTable)
    .where(eq(symptomSessionsTable.id, id));

  if (!found) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  if (found.userId !== null && found.userId !== userId) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.json({
    ...found,
    createdAt: found.createdAt.toISOString(),
  });
});

export default router;
