import { z } from "zod";

export const classes = z.object({
  name: z.string({ required_error: "نام درس ضروریه" }),
  course_id: z
    .string()
    .min(1, { message: "این فیلد ضروریه" })
    .regex(/^[0-9]+$/, { message: "کد درس فقط باید دارای عدد باشه." }),
});
