import * as z from "zod";

export const eventTypeDtoSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type EventTypeDto = z.infer<typeof eventTypeDtoSchema>;

export type ProjectTypes =
  | "WEDDING"
  | "ANNIVERSARY"
  | "BIRTHDAY"
  | "DEBUTANTE"
  | "CORPORATE"
  | "OTHER";

export const eventTypeCodes: ProjectTypes[] = [
  "WEDDING",
  "ANNIVERSARY",
  "BIRTHDAY",
  "DEBUTANTE",
  "CORPORATE",
  "OTHER",
];

export const eventTypeNames: { [key in ProjectTypes]: string } = {
  WEDDING: "Casamento",
  ANNIVERSARY: "Bodas",
  BIRTHDAY: "Aniversário",
  DEBUTANTE: "Debutante",
  CORPORATE: "Corporativo",
  OTHER: "Outro",
};
