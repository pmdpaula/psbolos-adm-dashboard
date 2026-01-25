"use client";

import { createContext, useContext, useState } from "react";

import type { ProjectDto } from "@/data/dto/project-dto";
import type { AlertType } from "@/lib/alert";

export type ProjectContextType = {
  refreshKey: number;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  projectContext: ProjectDto | null;
  // projectContext: CreateProjectDto | ProjectDto | null;
  setProjectContext: React.Dispatch<React.SetStateAction<ProjectDto | null>>;
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  openAlertSnackBar: AlertType;
  setOpenAlertSnackBar: (alert: AlertType) => void;
  lastStepCompleted?: number;
  setLastStepCompleted?: (step: number) => void;
};

export const ProjectContext = createContext<ProjectContextType>(
  {} as ProjectContextType,
);

interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [projectContext, setProjectContext] = useState<ProjectDto | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [openAlertSnackBar, setOpenAlertSnackBar] = useState<AlertType>({
    isOpen: false,
    success: true,
    message: "",
    errorCode: null,
  });

  const contextDefinitions: ProjectContextType = {
    refreshKey,
    setRefreshKey,
    openForm,
    setOpenForm,
    projectContext,
    setProjectContext,
    openAlertSnackBar,
    setOpenAlertSnackBar,
  };

  return (
    <ProjectContext.Provider value={contextDefinitions}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }

  return context;
};
