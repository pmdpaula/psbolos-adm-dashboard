import * as z from "zod";

export const collaboratorTypeDtoSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type CollaboratorTypeDto = z.infer<typeof collaboratorTypeDtoSchema>;
