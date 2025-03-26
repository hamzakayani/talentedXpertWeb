import { z } from "zod";

const notBeforeToday = (date: string) => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

export const addtaskSchema = z
  .object({
    name: z.string().min(1, "Add task Name"),
    amount: z.string().min(1, "Please add amount"),
    details: z.string().min(1, "Add details"),
    startDate: z
      .string()
      .min(1, "Add start date")
      .refine((date) => notBeforeToday(date), { message: "Start date cannot be earlier than today" }),
    endDate: z
      .string()
      .min(1, "Add end date")
      .refine((date) => notBeforeToday(date), { message: "End date cannot be earlier than today" }),
    amountType: z.string().min(1, "Add amount type"),
    category: z.string().min(1, "Category is required"),
    subCategory: z
      .array(
        z.object({
          value: z.number(),
          label: z.string(),
        }).optional()
      )
      .min(1, "Sub-category is required"),
    taskType: z.string().min(1, "Select Task Location"),
    status: z.string(),
    documents: z.array(
      z.object({
        key: z.string(),
        fileUrl: z.string(),
      })
    ),
    interviewQuestions: z.array(
      z.object({
        id: z.number().optional(),
        question: z.string(),
        type: z.string(),
        options: z.array(z.string()),
      })
    ),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    street: z.string(),
    country: z.string(),
    address: z.string(),
    longitude: z.string(),
    latitude: z.string(),
    requesterProfileId: z.string(),
    promoted: z.string(),
    categoryIdsToDelete: z.array(z.number()),
    questionIdsToDelete: z.array(z.number()),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate >= startDate; 
    },
    {
      message: "End date cannot be earlier than start date",
      path: ["endDate"], 
    }
  );
