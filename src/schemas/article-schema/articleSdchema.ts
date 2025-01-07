import {z} from "zod"

const docs = z.object({
    key: z.string(),
    fileUrl: z.string()
}).optional();
export const articleSchema = z.object({
    description: z.string().min(1,"you must add description"),
    title: z.string(),
    profileId: z.number(),
    documents: z.array(docs).optional(),
    image: z.array(docs).optional()
})