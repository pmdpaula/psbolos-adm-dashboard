import z from "zod";

export const createCakeDtoSchema = z.object({
  projectId: z.cuid2().optional(),

  description: z.string({ error: "A descrição é obrigatória." }).min(6, {
    error: "A descrição é obrigatória. Mínimo de 6 caracteres.",
  }),

  slices: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseInt(val);
      }
      return val;
    },
    z
      .number({ error: "O número de fatias deve ser um número." })
      .min(1, { error: "O número de fatias deve ser no mínimo 1." }),
  ),

  tiers: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseInt(val);
      }
      return val;
    },
    z
      .number({ error: "O número de andares deve ser um número." })
      .min(1, { error: "O número de andares deve ser no mínimo 1." }),
  ),

  price: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseFloat(val);
      }
      return val;
    },
    z
      .number({ error: "O preço deve ser um número." })
      .min(0, { message: "O preço não pode ser negativo." }),
  ),

  // imageUrl: z.url().nullable().optional(),

  // referenceUrl: z.url().nullable().optional(),

  batterCode: z.preprocess(
    (val) => {
      if (val === "") {
        return {
          error: "A massa é obrigatória e deve ser uma das opções possíveis.",
        };
      }
      return val;
    },
    z.string({
      error: "A massa é obrigatória e deve ser uma das opções possíveis.",
    }),
  ),

  fillingCode1: z.preprocess(
    (val) => {
      if (val === "") {
        return {
          error:
            "O recheio 1 é obrigatório e deve ser uma das opções possíveis.",
        };
      }
      return val;
    },
    z.string({
      error: "O recheio 1 é obrigatório e deve ser uma das opções possíveis.",
    }),
  ),

  fillingCode2: z.preprocess(
    (val) => {
      if (val === "") {
        return {
          error:
            "O recheio 2 é obrigatório e deve ser uma das opções possíveis.",
        };
      }
      return val;
    },
    z.string({
      error: "O recheio 2 é obrigatório e deve ser uma das opções possíveis.",
    }),
  ),

  fillingCode3: z.preprocess(
    (val) => {
      if (val === "") {
        return {
          error:
            "O recheio 3 é obrigatório e deve ser uma das opções possíveis.",
        };
      }
      return val;
    },
    z.string({
      error: "O recheio 3 é obrigatório e deve ser uma das opções possíveis.",
    }),
  ),
});

export type CreateCakeDto = z.infer<typeof createCakeDtoSchema>;

export const cakeDtoSchema = z.object({
  id: z.cuid2(),
  ...createCakeDtoSchema.shape,
});

export type CakeDto = z.infer<typeof cakeDtoSchema>;
