import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z.number().min(0).max(5),
  comments: z.string().optional(), 
  taskId: z.number(), 
  reviewerProfileId: z.number(), 
  revieweeProfileId: z.number(), 
});
