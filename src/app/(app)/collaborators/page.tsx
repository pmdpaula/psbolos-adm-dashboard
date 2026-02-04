"use client";

import { CollaboratorProvider } from "./CollaboratorContext";
import { CollaboratorDataTable } from "./CollaboratorDataTable";
// import { FormCollaborator } from "./form-collaborator/FormCollaborator";

export type ActionFormProps = "create" | "edit" | "delete" | "none";

export interface OpenFormProps {
  open: boolean;
  action: ActionFormProps;
}

const CollaboratorPage = () => {
  return (
    <CollaboratorProvider>
      <CollaboratorDataTable />
    </CollaboratorProvider>
  );
};

export default CollaboratorPage;
