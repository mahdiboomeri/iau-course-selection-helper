import { classes } from "@/schema/class";
import { db } from "../utls/db";
import { course } from "@/db/schema";

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'development') return {
    success: false
  }
  const rawBody = await readBody(event);
  const parsedBody = classes.safeParse(rawBody);

  if (!parsedBody.success) {
    return createError({
      statusCode: 400,
      message: "دیتای اشتباه.",
    });
  }

  const { data: body } = parsedBody;

  await db.insert(course).values({
    course_id: body.course_id,
    name: body.name,
  });

  return {
    success: true,
  };
});
