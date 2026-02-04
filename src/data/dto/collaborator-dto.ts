import { z } from "zod";

import { collaboratorContactTypeType } from "@/lib/collaborator-contact-type";

export const collaboratorDtoSchema = z.object({
  id: z.cuid2().optional(),

  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres.").max(100),

  registerNumber: z
    .string()
    .nullable()
    .or(z.literal("")) // Permite string vazia como valor válido
    .transform((val) => (val === "" ? null : val))
    .refine((val) => {
      if (!val) return true; // Permite null
      return /^\d+$/.test(val) && (val.length === 11 || val.length === 14);
    }, "O número de registro deve ter 11 (CPF) ou 14 (CNPJ) caracteres e conter apenas dígitos."),

  contactType1: z
    .enum(Object.values(collaboratorContactTypeType) as [string, ...string[]])
    .nullable()
    // .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),

  contact1: z
    .string()
    .nullable()
    // .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),

  contactType2: z
    .enum(Object.values(collaboratorContactTypeType) as [string, ...string[]])
    .nullable()
    // .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),

  contact2: z
    .string()
    .nullable()
    // .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),

  address: z.string().max(200).nullable().or(z.literal("")),
  city: z.string().max(100).nullable().or(z.literal("")),
  state: z.string().max(100).nullable().or(z.literal("")),
  zipCode: z
    .string()
    .regex(/^\d+$/, "O CEP deve conter apenas dígitos.")
    .max(20)
    .nullable()
    .or(z.literal("")), // Permite string vazia como valor válido
  country: z.string().max(100).nullable().or(z.literal("")),
});

export type CollaboratorDto = z.infer<typeof collaboratorDtoSchema>;
