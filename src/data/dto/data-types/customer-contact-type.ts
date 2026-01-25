import * as z from "zod";

export const customerContactTypeDtoSchema = z.enum([
  "EMAIL",
  "PHONE",
  "WHATSAPP",
  "INSTAGRAM",
  "FACEBOOK",
  "TIKTOK",
  "OTHER",
]);

export type CustomerContactTypeDto = z.infer<
  typeof customerContactTypeDtoSchema
>;
