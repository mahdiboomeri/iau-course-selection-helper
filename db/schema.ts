import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey(),
  course_id: text("course_id"),
  class_id: text("class_id"),
  prof: text("prof"),
  day: text("day").$type<Days>(),
  start_at: text("start_at"),
  end_at: text("end_at"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const course = sqliteTable("course", {
  id: integer("id").primaryKey(),
  course_id: text("course_id"),
  name: text("name"),
})