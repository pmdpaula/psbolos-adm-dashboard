import * as z from "zod";

import { eventTypeDtoSchema } from "@/data/dto/data-types/event-type-dto";

import { customerDtoSchema } from "./customer-dto";
import { cakeBatterDtoSchema } from "./data-types/cake-batter-dto";
import { cakeFillingDtoSchema } from "./data-types/cake-filling-dto";
import { collaboratorTypeDtoSchema } from "./data-types/collaborator-type-dto";
import { deliveryModeDtoSchema } from "./data-types/delivery-mode-dto";
import { projectStatusDtoSchema } from "./data-types/project-status-dto";

// export const createProjectDtoSchema = z.object({
//   name: z
//     .string()
//     .min(2, "O nome do projeto deve ser único e ter pelo menos 2 caracteres.")
//     .max(100),

//   description: z
//     .string()
//     .max(500, "A descrição deve ter no máximo 500 caracteres."),

//   eventTypeCode: z.string({
//     error: "O tipo de evento é obrigatório e deve ser um dos valores válidos.",
//   }),

//   eventDate: z.iso.date({
//     error: "A data do evento é obrigatória e deve ser uma data válida.",
//   }),

//   localName: z
//     .string()
//     .max(100, { error: "O nome do local deve ter no máximo 100 caracteres." })
//     .nullable()
//     .or(z.literal("")),

//   deliveryModeCode: z.string({
//     error: "Escolher um dos valores.",
//   }),

//   shippingCost: z.preprocess(
//     (val) => {
//       if (typeof val === "string") {
//         return parseFloat(val);
//       }
//       return val;
//     },
//     z
//       .number({ error: "O custo de entrega deve ser um número." })
//       .min(0, "O custo de entrega não pode ser negativo."),
//   ),
//   address: z.string().max(200).nullable().or(z.literal("")),

//   city: z
//     .string({
//       error: "A cidade é obrigatória e deve ter no máximo 100 caracteres.",
//     })
//     .max(100)
//     .nullable(),

//   state: z
//     .string({
//       error: "O estado é obrigatório e deve ter no máximo 100 caracteres.",
//     })
//     .max(100)
//     .nullable(),

//   statusCode: z.string({
//     error: "Escolher um dos valores.",
//   }),
// });

export const createProjectDtoSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres.").max(100),

  description: z.string(),

  eventTypeCode: z.string({
    message:
      "O tipo de evento é obrigatório e deve ser uma das opções possíveis.",
  }),

  eventDate: z.string({ message: "A data do evento é obrigatória." }),

  localName: z.string().optional().nullable(),

  deliveryModeCode: z.string({ message: "O modo de entrega é obrigatório." }),

  address: z
    .string({ message: "O endereço é obrigatório." })
    .optional()
    .nullable(),

  city: z.string({ message: "A cidade é obrigatória." }).optional().nullable(),

  state: z.string({ message: "O estado é obrigatório." }).optional().nullable(),

  shippingCost: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseFloat(val);
      }
      return val;
    },
    z
      .number({ message: "O valor da entrega é obrigatório." })
      .min(0, "O valor da entrega não pode ser negativo."),
  ),

  statusCode: z.string({
    message: "O status é obrigatório e deve ser uma das opções possíveis.",
  }),
});

export type CreateProjectDto = z.infer<typeof createProjectDtoSchema>;

export const projectDtoSchema = z.object({
  id: z.cuid2(),
  ...createProjectDtoSchema.shape,
});

export type ProjectDto = z.infer<typeof projectDtoSchema>;

export const projectFullDataDtoSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  description: z.string().nullable(),
  eventType: eventTypeDtoSchema,
  eventDate: z.iso.date(),
  localName: z.string().nullable().or(z.literal("")),
  deliveryMode: deliveryModeDtoSchema,
  shippingCost: z.number().min(0),
  address: z.string().nullable().or(z.literal("")),
  city: z.string().nullable(),
  state: z.string().nullable(),
  status: projectStatusDtoSchema,

  customersInProject: z.array(
    z.object({
      id: z.cuid2(),
      role: z.string(),
      collaboratorType: collaboratorTypeDtoSchema,
      customer: customerDtoSchema,
    }),
  ),
  cakes: z.array(
    z.object({
      id: z.cuid2(),
      description: z.string(),
      tiers: z.number(),
      price: z.number(),
      imageUrl: z.url().nullable().optional(),
      referenceUrl: z.url().nullable().optional(),
      batter: cakeBatterDtoSchema,
      filling1: cakeFillingDtoSchema,
      filling2: cakeFillingDtoSchema,
      filling3: cakeFillingDtoSchema,
      projectId: z.cuid2(),
    }),
  ),
  payments: z.array(
    z.object({
      id: z.cuid2(),
      amount: z.number(),
      paidDate: z.iso.date(),
      note: z.string().nullable(),
      projectId: z.cuid2(),
    }),
  ),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
});

export type ProjectFullDataDto = z.infer<typeof projectFullDataDtoSchema>;
