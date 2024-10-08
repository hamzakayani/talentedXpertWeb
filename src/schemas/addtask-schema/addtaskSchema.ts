import {z} from "zod"

const interviewQuestions = z.object({
    question: z.string(),
});

export const addtaskSchema = z.object({
    name : z.string().min(1, 'Add task Name'),
    amount : z.string().min(1, 'Please add amount'),
    details : z.string().min(1,'Add details'),
    startDate: z.string().min(1, 'Required'),
    endDate: z.string().min(1, 'Required'),
    amountType: z.string().min(1, 'Required'), 
    categoryId: z.string(),
    industryId: z.string(),
    taskType: z.string(), 
    status: z.string(), 
    documents: z.string().optional(), 
    interviewQuestions: z.array(interviewQuestions),
    city: z.string().min(1, 'Required'),
    state: z.string().min(1, 'Required'),
    zip: z.string().min(1, 'Required'),
    street: z.string(),
    country: z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
    addInterview : z.boolean(),
    requesterProfileId: z.string()

})
