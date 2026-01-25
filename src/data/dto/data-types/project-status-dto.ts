import * as z from "zod";

export const projectStatusDtoSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type ProjectStatusDto = z.infer<typeof projectStatusDtoSchema>;
