import {z} from "zod"
export const LoginSchema = z.object({
    email: z.string({
        errorMap: () => ({ message: "Email address is required"})
    }).min(1).email(),
    password: z.string({
        errorMap: () => ({ message: "Password is required"})
    }).min(1),
    rememberMe: z.boolean(),
    loginAs: z.string({
        errorMap: () => ({ message: "you must select a role"})
    }).min(1)
})