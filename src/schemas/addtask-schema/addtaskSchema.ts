import { z } from "zod"

const interviewQuestions = z.object({
    id: z.number().optional(),
    question: z.string(),
});
const category = z.object({
    value: z.number(), label: z.string()
  }).optional()

const docs = z.object({
    key: z.string(),
    fileUrl: z.string()
});


export const addtaskSchema = z.object({
    name : z.string().min(1, 'Add task Name'),
    amount : z.string().min(1, 'Please add amount'),
    details : z.string().min(1,'Add details'),
    startDate: z.string().min(1, 'Add start date'),
    endDate: z.string().min(1, 'Add end date'),
    amountType: z.string().min(1, 'Add amount type'), 
    category: z.string().min(1, "Category is required"),
    subCategory: z.array(category).min(1, 'Sub-category is required'),
    // industryId: z.string(),
    taskType: z.string().min(1,'Select Task Location'), 
    status: z.string(), 
    documents: z.array(docs), 
    interviewQuestions: z.array(interviewQuestions),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    street: z.string(),
    country: z.string(),
    address: z.string(),
    // addInterview : z.boolean(),
    requesterProfileId: z.string(),
    promoted: z.string(),
    // disability : z.string(),
    categoryIdsToDelete: z.array(z.number()),
    questionIdsToDelete: z.array(z.number()),

})
