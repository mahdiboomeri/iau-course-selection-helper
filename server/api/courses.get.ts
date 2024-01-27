import { db } from "../utls/db";
import { courses } from "@/db/schema";

export default defineEventHandler(async () => {
  return await db.select().from(courses).all();
});
