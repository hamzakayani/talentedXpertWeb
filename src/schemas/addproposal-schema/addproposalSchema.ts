import {z} from "zod"
const interviewAnswers = z.object({
    answer: z.string(),
    questionId: z.number()
});
const docs = z.object({
    key: z.string(),
    fileUrl: z.string()
});
export const addproposalSchema = z.object({
    details: z.string().min(1,"you must fill out details"),
    amount: z.string().min(1,'Add amount'),
    status: z.string(),
    expertProfileId: z.string(),
    teamId: z.string(),
    taskId: z.string(),
    answers: z.array(interviewAnswers),
    documents: z.array(docs)
})