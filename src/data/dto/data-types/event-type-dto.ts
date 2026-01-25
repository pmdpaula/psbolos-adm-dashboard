import * as z from "zod";

export const eventTypeDtoSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type EventTypeDto = z.infer<typeof eventTypeDtoSchema>;
