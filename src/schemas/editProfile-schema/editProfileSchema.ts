import { number, z } from "zod";

const educations = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  date: z.string().min(1, 'Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  id: z.number().optional(),
});

const experiences = z.object({
  companyName: z.string().min(1, 'Company Name is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().min(1, 'End Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  description: z.string().min(1, 'Description is required'),
  id: z.number().optional(),
});
const skills = z.object({
  value: z.number(), label: z.string()
})

export const editProfileSchema = z.object({
  profileType: z.string().optional(),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Email is required'),
  about: z.string().min(1, 'About is required'),
  profilePicture: z.object({
    key: z.string(),
    fileUrl: z.string()
  }).optional(),
  // mobile: z.string().min(10, 'Mobile number must be at least 10 digits').regex(/^\d+$/, 'Mobile number must contain only numbers').max(12, 'Mobile number must not exceed 12 digits'),
  // password: z.string().min(8, { message: "Password must be at least 8 characters long" })
  // .max(16, { message: "Password must be no more than 16 characters long" })
  // .refine((value) => /[A-Z]/.test(value), {
  //   message: "Password must include at least one uppercase letter",
  // })
  // .refine((value) => /[a-z]/.test(value), {
  //   message: "Password must include at least one lowercase letter",
  // })
  // .refine((value) => /\d/.test(value), {
  //   message: "Password must include at least one digit",
  // })
  // .refine((value) => /[^A-Za-z0-9]/.test(value), {
  //   message: "Password must include at least one special character",
  // }),
  // confirmPassword: z.string().min(8, 'Re-entered password must match'),
  userType: z.string(),
  skills: z.array(skills).min(1, 'Skills is required'),
  education: z.array(educations),
  experience: z.array(experiences),
  educationIdsToDelete: z.array(z.number()),
  experienceIdsToDelete: z.array(z.number()),
  disabilityDetail: z.string().optional(),
  address: z.object({
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    street: z.string(),
    country: z.string(),
    longitude: z.string(),
    latitude: z.string(),
    address: z.string()
  }).optional()
}).superRefine((data, ctx) => 
  {
  // if (data.confirmPassword !== data.password) {
  //   ctx.addIssue({
  //     code: z.ZodIssueCode.custom,
  //     message: "Passwords don't match",
  //     path: ["confirmPassword"],
  //   });
  // }
});
