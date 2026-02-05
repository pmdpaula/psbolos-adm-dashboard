import * as z from "zod";

export const collaboratorContactTypeDtoSchema = z.enum([
  "EMAIL",
  "PHONE",
  "WHATSAPP",
  "INSTAGRAM",
  "FACEBOOK",
  "TIKTOK",
  "OTHER",
]);

export type CollaboratorContactTypeDto = z.infer<
  typeof collaboratorContactTypeDtoSchema
>;
