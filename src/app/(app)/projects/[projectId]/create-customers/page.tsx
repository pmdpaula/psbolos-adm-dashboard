"use client";

import { CircularProgress } from "@mui/material";
import { getCookie, hasCookie } from "cookies-next";
import { useEffect, useState } from "react";

import type { ProjectDto } from "@/data/dto/project-dto";
import { getProjectById } from "@/http/project/get-project-by-id";

import { useProjectContext } from "../../ProjectContext";

const CreateCustomerOnProjectPage = () => {
  const { projectContext, setProjectContext } = useProjectContext();
  const [isReadingData, setIsReadingData] = useState(true);

  useEffect(() => {
    const checkAvaibilityOfNewProject = async () => {
      const isNewProjectAvailableInCookies = hasCookie("newProject");

      const availableNewProject = isNewProjectAvailableInCookies
        ? (JSON.parse((await getCookie("newProject")) as string) as ProjectDto)
        : null;

      if (!availableNewProject) {
        setIsReadingData(false);
        return;
      }

      const savedProject = await getProjectById({
        id: availableNewProject?.id as string,
      });

      setProjectContext(savedProject ? savedProject : null);
    };

    if (!projectContext) {
      checkAvaibilityOfNewProject();
    }

    setIsReadingData(false);
  }, []);

  if (isReadingData) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  return (
    <>
      {isReadingData || (
        <div>
          Aqui vamos criar os colaboradores para o projeto{" "}
          {projectContext?.name}
        </div>
      )}
    </>
  );
};

export default CreateCustomerOnProjectPage;
