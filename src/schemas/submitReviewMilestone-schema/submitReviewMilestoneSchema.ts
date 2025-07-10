import { z } from "zod";

export const milestotneReviewSchema = z.object({
  rating: z.number().min(1, { message: "Rating is required and must be at least 1" }).max(5),
  review: z.string().min(1, { message: "Review is required" }),
  taskId: z.number(),
  milestoneId: z.number(),
  weeklyMilestoneId: z.number().optional(),
  reviewerProfileId: z.number(),
  revieweeProfileId: z.number(),
  revieweeTeamId: z.number(),
});