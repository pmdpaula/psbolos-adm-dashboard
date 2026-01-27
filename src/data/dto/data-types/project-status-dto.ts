import * as z from "zod";

import type { PaletteColorKey } from "@/theme/baseTheme";

export const projectStatusDtoSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type ProjectStatusDto = z.infer<typeof projectStatusDtoSchema>;

export type ProjectTypes =
  | "PRODUCING"
  | "PLANNING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export const projectStatusCodes: ProjectTypes[] = [
  "PRODUCING",
  "PLANNING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

type ProjectStatusDefinitionType = {
  code: string;
  name: string;
  options: ProjectTypes[];
};

export const projectStatusDefinition: ProjectStatusDefinitionType[] = [
  {
    code: "WORKING",
    name: "Em produção",
    options: ["PRODUCING", "CONFIRMED"],
  },
  {
    code: "PLANNING",
    name: "Em planejamento",
    options: ["PLANNING"],
  },
  {
    code: "COMPLETED",
    name: "Concluído",
    options: ["COMPLETED"],
  },
  {
    code: "CANCELLED",
    name: "Cancelado",
    options: ["CANCELLED"],
  },
];

export function defineDetailsForProjectStatus(statusCode: string): {
  color: PaletteColorKey;
  icon: string;
} {
  switch (statusCode.toUpperCase()) {
    case "PRODUCING":
      return {
        color: "info",
        icon: "build_circle",
      };
    case "PLANNING":
      return {
        color: "primary",
        icon: "event_note",
      };
    case "CONFIRMED":
      return {
        color: "success",
        icon: "check_circle",
      };
    case "COMPLETED":
      return {
        color: "secondary",
        icon: "task_alt",
      };
    case "CANCELLED":
      return {
        color: "error",
        icon: "cancel",
      };
    default:
      return {
        color: "warning",
        icon: "help_outline",
      };
  }
}
