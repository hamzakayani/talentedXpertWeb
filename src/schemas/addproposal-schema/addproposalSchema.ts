import {z} from "zod"
export const addproposalSchema = z.object({
    details: z.string().min(1,"you must fill out details"),
    amount: z.string().min(1,'Add amount'),
    status: z.string(),
    expertProfileId: z.string(),
    teamId: z.string(),
    taskId: z.string()
})