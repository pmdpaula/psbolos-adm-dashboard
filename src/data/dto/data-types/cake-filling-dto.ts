import * as z from "zod";

export const cakeFillingDtoSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type CakeFillingDto = z.infer<typeof cakeFillingDtoSchema>;
