import {z} from "zod"
export const inviteTeamSchema = z.object({
    teamId: z.string().min(1,"you must select Team"),
    memberId: z.string().min(1,"you must add member"),
})