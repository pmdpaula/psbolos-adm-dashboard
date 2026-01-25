export type CollaboratorType =
  | "PLANNER"
  | "CONTRACTOR"
  | "SUPPLIER"
  | "TRANSPORTER"
  | "OTHER";

export const collaboratorTypeLabels: Record<CollaboratorType, string> = {
  PLANNER: "Planejador",
  CONTRACTOR: "Contratante",
  SUPPLIER: "Fornecedor",
  TRANSPORTER: "Transportador",
  OTHER: "Outro",
};

export const collaboratorTypeOptions = Object.entries(
  collaboratorTypeLabels,
).map(([code, name]) => ({
  code,
  name,
}));
