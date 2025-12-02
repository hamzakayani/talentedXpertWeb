import {z} from "zod"

export const contactUsSchema = z.object({
    firstName: z.string().min(1, "First Name is required").regex(/^[a-zA-Z\s]+$/, "Special characters are not allowed"),
    lastName: z.string().min(1, "Last Name is required").regex(/^[a-zA-Z\s]+$/, "Special characters are not allowed"),
    email: z.string().email("Email is required"),
    comments: z.string().min(5,"Comments must be at least 5 characters long").max(500, "Comments cannot exceed 500 characters"),
})