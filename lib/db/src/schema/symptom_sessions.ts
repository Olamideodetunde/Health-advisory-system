import { pgTable, serial, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const symptomSessionsTable = pgTable("symptom_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  symptoms: text("symptoms").array().notNull(),
  age: integer("age"),
  gender: text("gender"),
  durationDays: integer("duration_days"),
  topCondition: text("top_condition").notNull(),
  triageLevel: text("triage_level").notNull(),
  result: jsonb("result").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSymptomSessionSchema = createInsertSchema(symptomSessionsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertSymptomSession = z.infer<typeof insertSymptomSessionSchema>;
export type SymptomSession = typeof symptomSessionsTable.$inferSelect;
