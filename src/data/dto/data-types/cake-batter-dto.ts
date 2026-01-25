import * as z from "zod";

export const cakeBatterDtoSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type CakeBatterDto = z.infer<typeof cakeBatterDtoSchema>;
