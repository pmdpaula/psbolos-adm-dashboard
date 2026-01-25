"use client";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, Button, Typography } from "@mui/material";
import { use, useEffect, useState } from "react";

import NeonAlert from "@/components/NeonAlert";
import type { ProjectDto } from "@/data/dto/project-dto";
import { getProjectById } from "@/http/project/get-project-by-id";

import { ProjectHeader } from "../../components/ProjectHeader";
import { useProjectContext } from "../../ProjectContext";
import { FormConnectCollaborator } from "./FormConnectCollaborator";
import Loading from "./loading";

interface ConnectCollaboratorsPageProps {
  params: Promise<{ projectId: string }>;
}

const ConnectCollaboratorsPage = ({
  params,
}: ConnectCollaboratorsPageProps) => {
  const { projectId } = use(params);

  const { projectContext } = useProjectContext();
  const [project, setProject] = useState<ProjectDto | null>(projectContext);
  const [isReadingData, setIsReadingData] = useState(true);

  useEffect(() => {
    const checkAvaibilityOfAProject = async () => {
      const project = await getProjectById({ id: projectId });
      setProject(project);
      // const isNewProjectAvailableInCookies = hasCookie("newProject");

      // const availableNewProject = isNewProjectAvailableInCookies
      //   ? (JSON.parse((await getCookie("newProject")) as string) as ProjectDto)
      //   : null;

      // if (!availableNewProject) {
      //   setIsReadingData(false);
      //   return;
      // }

      // const savedProject = await getProjectById({
      //   id: availableNewProject?.id as string,
      // });

      // setNewProject(savedProject ? savedProject : null);
    };

    // if (!newProject) {
    checkAvaibilityOfAProject();
    // }

    setIsReadingData(false);
  }, []);

  const showAlertNoProject = () => {
    return (
      <>
        {isReadingData && !project ? (
          <Loading />
        ) : (
          <Box mt={2}>
            <NeonAlert
              severity="error"
              action={
                <Button
                  color="inherit"
                  endIcon={<RestartAltIcon />}
                  size="small"
                  href="/projects/create"
                >
                  voltar
                </Button>
              }
            >
              O projeto não está disponível. Por favor, reinicie o processo de
              criação de projeto.
            </NeonAlert>
          </Box>
        )}
      </>
    );
  };

  return (
    <>
      {!project ? (
        showAlertNoProject()
      ) : (
        <>
          <ProjectHeader
            projectId={project.id}
            name={project?.name}
            description={project?.description}
          />

          <Box
            mb={2}
            textAlign="center"
          >
            <Typography
              variant="body2"
              color="textPrimary"
            >
              Vamos conectar os colaboradores ao projeto. Caso não existam, você
              pode criá-los abaixo.
            </Typography>

            <Typography
              variant="caption"
              color="textSecondary"
            >
              Os colaboradores são as pessoas relacionadas ao projeto. Isto é, o
              cliente, a cerimonialista o transportador e outros.
            </Typography>
          </Box>

          <FormConnectCollaborator projectId={projectId} />
        </>
      )}
    </>
  );
};

export default ConnectCollaboratorsPage;
