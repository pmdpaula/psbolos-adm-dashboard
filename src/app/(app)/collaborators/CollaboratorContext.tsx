import { createContext, useContext, useState } from "react";

import type { CollaboratorDto } from "@/data/dto/collaborator-dto";
import type { AlertType } from "@/lib/alert";

import type { OpenFormProps } from "./page";

export type CollaboratorContextType = {
  openForm: OpenFormProps;
  setOpenForm: React.Dispatch<React.SetStateAction<OpenFormProps>>;
  collaboratorContext: CollaboratorDto;
  setCollaboratorContext: React.Dispatch<React.SetStateAction<CollaboratorDto>>;
  openAlertSnackBar: AlertType;
  setOpenAlertSnackBar: (alert: AlertType) => void;
};

export const CollaboratorContext = createContext<CollaboratorContextType>(
  {} as CollaboratorContextType,
);

interface CollaboratorProviderProps {
  children: React.ReactNode;
}

export const CollaboratorProvider = ({
  children,
}: CollaboratorProviderProps) => {
  const [openForm, setOpenForm] = useState<OpenFormProps>({
    open: false,
    action: "none",
  });

  const [collaboratorContext, setCollaboratorContext] =
    useState<CollaboratorDto>({} as CollaboratorDto);

  const [openAlertSnackBar, setOpenAlertSnackBar] = useState<AlertType>({
    isOpen: false,
    success: true,
    message: "",
    errorCode: null,
  });

  const contextDefinitions: CollaboratorContextType = {
    openForm,
    setOpenForm,
    collaboratorContext,
    setCollaboratorContext,
    openAlertSnackBar,
    setOpenAlertSnackBar,
  };

  return (
    <CollaboratorContext.Provider value={contextDefinitions}>
      {children}
    </CollaboratorContext.Provider>
  );
};

export const useCollaboratorContext = () => {
  const context = useContext(CollaboratorContext);

  if (!context) {
    throw new Error(
      "useCollaboratorContext must be used within a CollaboratorProvider",
    );
  }

  return context;
};
