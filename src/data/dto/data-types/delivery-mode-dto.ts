import * as z from "zod";

export const deliveryModeDtoSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type DeliveryModeDto = z.infer<typeof deliveryModeDtoSchema>;
