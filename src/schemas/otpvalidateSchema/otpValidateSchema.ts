import {z} from "zod"

export const OtpValidateSchema = z.object({
    otp: z.string().length(5, "Please enter a 5-digit code").regex(/^\d{5}$/, "OTP must be a 5-digit number"),
})