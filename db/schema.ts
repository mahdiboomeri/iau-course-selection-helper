import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const dataUsage = sqliteTable("courses", {
  id: integer("id").primaryKey(),
  prof: text("prof"),
  day: text("day").$type<"sat" | 'sun' | 'mon' | 'tues' | 'wed' | 'thurs' | 'fri'>(),
  start_at: text("start_at"),
  end_at: text("end_at"),
  exam_date: integer("exam_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});
