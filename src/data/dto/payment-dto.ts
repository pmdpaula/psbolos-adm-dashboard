import z from "zod";

export const createPaymentDtoSchema = z.object({
  projectId: z.cuid2().optional(),

  amount: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseFloat(val);
      }
      return val;
    },
    z
      .number({ error: "O preço deve ser um número." })
      .positive({ message: "O preço não pode ser negativo." }),
  ),

  paidDate: z.date({ error: "A data do pagamento é obrigatória." }),

  note: z.string().nullable().optional(),
});

export type CreatePaymentDto = z.infer<typeof createPaymentDtoSchema>;

export const paymentDtoSchema = z.object({
  id: z.cuid2().optional(),
  ...createPaymentDtoSchema.shape,
});

export type PaymentDto = z.infer<typeof paymentDtoSchema>;
