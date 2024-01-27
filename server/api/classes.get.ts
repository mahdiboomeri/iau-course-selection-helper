import { db } from "../utls/db";
import { course } from "@/db/schema";

export default defineEventHandler(async () => {
  return await db.select().from(course).all();
});
