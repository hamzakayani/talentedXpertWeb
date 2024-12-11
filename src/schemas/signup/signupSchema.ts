import { z } from "zod";


export const basicInfoSchema = z.object({
  profileType: z.string().min(2, 'Select your type'),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Email is required'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits').regex(/^\d+$/, 'Mobile number must contain only numbers').max(12, 'Mobile number must not exceed 12 digits'),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" })
  .max(16, { message: "Password must be no more than 16 characters long" })
  .refine((value) => /[A-Z]/.test(value), {
    message: "Password must include at least one uppercase letter",
  })
  .refine((value) => /[a-z]/.test(value), {
    message: "Password must include at least one lowercase letter",
  })
  .refine((value) => /\d/.test(value), {
    message: "Password must include at least one digit",
  })
  .refine((value) => /[^A-Za-z0-9]/.test(value), {
    message: "Password must include at least one special character",
  }),
  confirmPassword: z.string().min(8, 'Re-entered password must match'),
  userType: z.string(),
  isAdmin: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.confirmPassword !== data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["confirmPassword"], 
    });
  }
});

const educations = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  date: z.string().min(1, 'Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
});

export const educationSchema = z.object({
  education: z.array(educations)
});

export const additionalInfoSchema = z.object({
  about: z.string().min(1, 'About is required'),
  skills: z.string().min(1, 'Skills is required'),
  disabilityDetail: z.string().optional(),
  isDisabled: z.boolean(),
});


export const signupSchema = z.union([
  basicInfoSchema,
  educationSchema,
  additionalInfoSchema,
]);