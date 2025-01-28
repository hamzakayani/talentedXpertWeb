import { profile } from "node:console";
import { z } from "zod";

export const basicInfoSchema = z
  .object({
    profileType: z.string().min(2, "Select your type"),
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.string().email("Email is required"),
    profilePicture: z.object({
      key: z.string().optional(),
      fileUrl: z.string().optional()
    }).optional(),
    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^\d+$/, "Mobile number must contain only numbers")
      .max(12, "Mobile number must not exceed 12 digits"),
    password: z.string().superRefine((value, ctx) => {
      const errors: string[] = [];

      if (value.length < 8) {
        errors.push("- Password must be at least 8 characters long");
      }
      if (!/[A-Z]/.test(value)) {
        errors.push("- 1 uppercase letter");
      }
      if (!/[a-zA-Z]/.test(value)) {
        errors.push("- 1 alphabet");
      }
      if (!/[^A-Za-z0-9]/.test(value)) {
        errors.push("- 1 special character");
      }

      if (errors.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: errors.join("\n"),
        });
      }
    }),
    confirmPassword: z.string().min(8, "Re-entered password must match"),
    userType: z.string(),
    isAdmin: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
  });

const education = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  date: z
    .string()
    .min(1, "Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

const skill = z.object({
  value: z.number(),
  label: z.string(),
});

export const educationSchema = z.object({
  education: z.array(education),
});

export const additionalInfoSchema = z
  .object({
    about: z.string().min(1, "About is required"),
    skills: z.array(skill).min(1, "Skills are required"),
    isPromoted: z.string().optional(),
    disabilityDetail: z.string().optional(),
    isDisabled: z.boolean(),
  })
  .refine(
    (data) => !data.isDisabled || (data.isDisabled && data.disabilityDetail),
    {
      message: "Disability detail is required",
      path: ["disabilityDetail"],
    }
  );

export const signupSchema = z.intersection(
  z.intersection(basicInfoSchema, educationSchema),
  additionalInfoSchema
);
