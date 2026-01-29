import { number, z } from "zod";
const wordLimit = 200;
const educations = z.object({
  institution: z.string().optional(),
  degree: z.string().optional(),
  date: z.string().optional().refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), 'Invalid date format'),
  id: z.number().optional(),
});

// const experiences = z.object({
//   companyName: z.string().min(1, 'Company Name is required'),
//   role: z.string().min(1, 'Role is required'),
//   startDate: z.string().min(1, 'Start Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
//   endDate: z.string().min(1, 'End Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
//   description: z.string().min(1, 'Description is required'),
//   present: z.boolean().optional(),
//   id: z.number().optional(),
// }).optional();

const experiences = z.object({
  companyName: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().optional().refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), "Invalid date format"),
  endDate: z.string().optional().refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), "Invalid date format"),
  description: z.string().optional(),
  isPresent: z.boolean().optional(),
  id: z.number().optional(),
}).superRefine((data, ctx) => {
  // If startDate and endDate are provided, validate endDate is after startDate
  if (data.startDate && data.endDate && !data.isPresent) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be after start date",
        code: z.ZodIssueCode.custom,
      });
    }
  }
});




const skills = z.object({
  value: z.number().min(1, 'Skill value must be at least 1'), label: z.string()
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
  mobile: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true; // Optional field
      // Basic validation for international phone numbers
      return /^\+[1-9]\d{1,14}$/.test(value);
    }, "Please enter a valid international phone number"),
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
  skills: z.array(skills).optional(),
  disability: z.boolean().optional(),
  isPromoted: z.string().optional(),
  education: z.array(educations).optional(),
  experience: z.array(experiences).optional(),
  // education: z.array(educations).min(1, 'At least one education entry is required'),
  // experience: z.array(experiences).min(1, 'At least one experience entry is required'),
  educationIdsToDelete: z.array(z.number()),
  experienceIdsToDelete: z.array(z.number()).optional(),
  skillsIdsToDelete:  z.array(z.number()).optional(),
  disabilityDetail: z.string().optional(),
  title: z.string().min(1, 'Profile title is required'),
 
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    street: z.string().optional(),
    country: z.string().optional(),
    longitude: z.string().optional(),
    latitude: z.string().optional(),
    address: z.string().optional(),
  // city: z.string().min(1, 'City is required'),
  // state: z.string().min(1, 'State is required'),
  // zip: z.string().min(1, 'Zip is required'),
  // street: z.string().min(1, 'Street is required'),
  // country: z.string().min(1, 'Country is required'),
  // longitude: z.string().min(1, 'Longitude is required'),
  // latitude: z.string().min(1, 'Latitude is required'),
  // address: z.string().min(1, 'Address is required'),
  
});
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
