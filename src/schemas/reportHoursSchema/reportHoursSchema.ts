import { z } from "zod"

export const reportHoursSchema = z.object({

  startTime: z.string(),
  endTime: z.string(),
  duration: z.number(),
  comment: z.string(),
  TEProfileId: z.number(),
  taskId: z.number()
})