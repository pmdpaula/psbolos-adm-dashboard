import * as z from "zod";

import { customerDtoSchema } from "./customer-dto";
import { collaboratorTypeDtoSchema } from "./data-types/collaborator-type-dto";

export const collaborationDtoSchema = z.object({
  collaborationId: z.cuid2().optional(),
  customerId: z.cuid2({ message: "Obrigatório" }),
  collaboratorTypeCode: z.string({ message: "Obrigatório" }),
  projectId: z.cuid2({ message: "Obrigatório" }),
  userId: z.cuid2().optional().nullable(),
  role: z.string().optional().nullable(),
});

export type CollaborationDto = z.infer<typeof collaborationDtoSchema>;

export const collaborationFormSchema = z.object({
  customerId: z.cuid2({ message: "Obrigatório" }),
  collaboratorTypeCode: z.string({ message: "Obrigatório" }),
});

export type CollaborationForm = z.infer<typeof collaborationFormSchema>;

export const collaborationFullSchema = z.object({
  collaborationId: z.cuid2().optional(),
  customerId: z.cuid2({ message: "Obrigatório" }),
  collaboratorType: collaboratorTypeDtoSchema,
  projectId: z.cuid2({ message: "Obrigatório" }),
  userId: z.cuid2().optional().nullable(),
  role: z.string().optional().nullable(),
  customer: customerDtoSchema.optional(),
});

export type CollaborationFull = z.infer<typeof collaborationFullSchema>;
