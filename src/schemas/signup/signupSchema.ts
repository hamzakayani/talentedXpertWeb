import { z } from "zod";

// Step 1: Basic Information Schema
export const basicInfoSchema = z.object({
  profileType: z.string().min(1, 'Select your type'),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email format'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Re-entered password must match'),
  userType: z.string(),
  isAdmin: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.confirmPassword !== data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["confirmPassword"], // Field where the error will appear
    });
  }
});

// Step 3: Educational Information Schema
const educations = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  date: z.string().min(1, 'Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
});

export const educationSchema = z.object({
  education: z.array(educations)
});

// Step 2: Additional Information Schema
export const additionalInfoSchema = z.object({
  about: z.string().min(1, 'About is required'),
  skills: z.string().min(1, 'Skills is required'),
  disabilityDetail: z.string().optional(),
  isDisabled: z.boolean(),
});

// Combined schema array for multi-step validation
export const signupSchema = z.union([
  basicInfoSchema,
  educationSchema,
  additionalInfoSchema,
]);