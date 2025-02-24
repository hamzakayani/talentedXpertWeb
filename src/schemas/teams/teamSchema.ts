import {z} from "zod"
export const teamSchema = z.object({
    teamName: z.string().min(1,"Please Add Team Name"),
    teamMembers: z.array(z.string()).min(1,"Select Member")
})