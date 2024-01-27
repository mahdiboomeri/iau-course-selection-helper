import { course as courseSchema } from "@/schema/course";
import { db } from "../utls/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'development') return {
    success: false
  }
  
  const rawBody = await readBody(event);
  const parsedBody = courseSchema.safeParse(rawBody);

  if (!parsedBody.success) {
    return createError({
      statusCode: 400,
      message: "دیتای اشتباه.",
    });
  }

  const { data: body } = parsedBody;

  const theClass = await db
    .select()
    .from(courses)
    .where(eq(courses.class_id, body.class_id));

  if (theClass[1]) {
    return createError({
      statusCode: 400,
      message: "کد ارائه تکراریه.",
    });
  }

  await db.insert(courses).values({
    class_id: body.class_id,
    course_id: body.course_id,
    createdAt: new Date(),
    day: body.day,
    end_at: body.end_at,
    start_at: body.start_at,
    prof: body.prof,
  });

  return {
    success: true,
  };
});
