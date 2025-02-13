import { number, z } from "zod";
const wordLimit = 200;
const educations = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  date: z.string().min(1, 'Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  id: z.number().optional(),
}).optional();

const experiences = z.object({
  companyName: z.string().min(1, 'Company Name is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().min(1, 'End Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  description: z.string().min(1, 'Description is required'),
  id: z.number().optional(),
}).optional();

const skills = z.object({
  value: z.number(), label: z.string()
}).optional()

export const editProfileSchema = z.object({
  profileType: z.string().optional(),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  organizationName : z.string(),
  organizationType : z.string(),
  email: z.string().email('Email is required'),
  about: z.string().min(1, "About is required").refine(
        (value) => value.trim().split(/\s+/).filter(Boolean).length <= wordLimit,
        { message: `About must not exceed ${wordLimit} words` }
      ),
  profilePicture: z.object({
    key: z.string().optional(),
    fileUrl: z.string().optional()
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
  disability: z.boolean().optional(),
  isPromoted: z.string().optional(),
  education: z.array(educations),
  experience: z.array(experiences),
  educationIdsToDelete: z.array(z.number()),
  experienceIdsToDelete: z.array(z.number()).optional(),
  skillsIdsToDelete:  z.array(z.number()).optional(),
  disabilityDetail: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
 
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    street: z.string().optional(),
    country: z.string().optional(),
    longitude: z.string().optional(),
    latitude: z.string().optional(),
    address: z.string().optional(),
  
}).refine(
  (data) => !data.disability || (data.disability && data.disabilityDetail),
  {
    message: "Disability detail is required",
    path: ["disabilityDetail"],
  }
);
// .superRefine((data, ctx) => 
//   {
//   // if (data.confirmPassword !== data.password) {
//   //   ctx.addIssue({
//   //     code: z.ZodIssueCode.custom,
//   //     message: "Passwords don't match",
//   //     path: ["confirmPassword"],
//   //   });
//   // }
// });
