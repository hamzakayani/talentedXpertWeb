import {z} from "zod"

const interviewQuestions = z.object({
    question: z.string(),
  });

export const addtaskSchema = z.object({
    name : z.string().min(1, 'Add task Name'),
    amount : z.number().min(1, 'Required'),
    taskDetails : z.string().min(1,'Add details'),
    startDate: z.string().datetime(), 
    endDate: z.string().datetime(),
    amountType: z.enum(['FIXED', 'HOURLY']), 
    categoryId: z.string(),
    industryId: z.string(),
    taskType: z.enum(['ONLINE', 'OFFLINE']), 
    status: z.enum(['POSTED', 'CLOSED', 'IN_PROGRESS']), 
    documents: z.string().optional(), 
    interviewQuestions: z.array(interviewQuestions),
    city: z.string().min(1, 'Required'),
    state: z.string().min(1, 'Required'),
    zip: z.string().min(1, 'Required'),
    street: z.string(),
    country: z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
    addInterview : z.boolean(),

})
