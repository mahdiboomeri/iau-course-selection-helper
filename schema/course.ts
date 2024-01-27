import { z } from "zod";

export const day = z.enum(
  ["sat", "sun", "mon", "tues", "wed", "thurs", "fri"],
  { invalid_type_error: "روز اشتباهه" }
);

const timeRegex = /^(?:0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
const hour = z
  .string()
  .regex(timeRegex, { message: "لطفا تایم رو به فرمت درست وارد کن: 00:00" })
  .superRefine((val, ctx) => {
    const [hour] = val.split(":");

    if (Number(hour) < 7 || Number(hour) >= 21) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ساعت باید بین 7 صبح و 9 شب باشه (7 تا 21)",
      });
    }
  });
export const course = z.object({
  prof: z.string({ required_error: "نام استاد ضروریه" }),
  course_id: z
    .string()
    .min(1, { message: "این فیلد ضروریه" })
    .regex(/^[0-9]+$/, { message: "کد درس فقط باید دارای عدد باشه." }),

  class_id: z
    .string()
    .min(1, { message: "این فیلد ضروریه" })
    .regex(/^[0-9]+$/, { message: "کد ارائه فقط باید دارای عدد باشه." }),
  day: day,
  start_at: hour,
  end_at: hour,
});
