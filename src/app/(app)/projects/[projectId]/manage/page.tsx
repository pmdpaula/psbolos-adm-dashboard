"use client";

import { Stack, Typography } from "@mui/material";
import { Suspense, use, useEffect, useState } from "react";

import { useMainContext } from "@/app/MainContext";
import GlassButton from "@/components/glass/GlassButton";
import GlassCard from "@/components/glass/GlassCard";
import { MainContextSnackbar } from "@/components/MainContextSnackbar";
import {
  type ProjectFullDataDto,
  transformProjectFullDataDtoToProjectDto,
} from "@/data/dto/project-dto";
import { getProjectFullDataById } from "@/http/project/get-project-full-data-by-id";

import { editProjectAction } from "../../action";
import { ProjectHeader } from "../../components/ProjectHeader";
import { ProjectSummary } from "../../components/ProjectSummary";
import { ManageProjectOptions } from "./ManageProjectOptions";

// TODO: Adicionar no resumo os pagamentos feitos.
// TODO: Adicionar alguma informação caso o pagamento esteja quitado.
// TODO: Adicionar alguma informação caso o projeto esteja atrasado, isto é, a data do evento é em menos de 7 dias e o projeto não foi quitado.

interface ManageProjectPageProps {
  params: Promise<{ projectId: string }>;
}

const ManageProjectPage = ({ params }: ManageProjectPageProps) => {
  const { setOpenAlertSnackBar } = useMainContext();

  const { projectId } = use(params);

  const [project, setProject] = useState<ProjectFullDataDto | null>(null);

  const cancelledColor = "warning";

  useEffect(() => {
    const checkAvaibilityOfAProject = async () => {
      const project = await getProjectFullDataById({ id: projectId });
      setProject(project);
    };

    checkAvaibilityOfAProject();
  }, []);

  async function ProjectResume() {
    const normalizedProject = {
      ...transformProjectFullDataDtoToProjectDto(project!),
      statusCode: "PLANNING",
    };

    const resumedProject = {
      ...normalizedProject,
    };

    const response = await editProjectAction(resumedProject);

    setOpenAlertSnackBar({
      isOpen: true,
      success: response.success,
      message: response.success
        ? "Projeto reativado com sucesso!"
        : response.message,
      errorCode: response.errors,
    });

    setProject(await getProjectFullDataById({ id: projectId }));
  }

  return (
    <Suspense>
      {project && (
        <Stack>
          <Stack
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <ProjectHeader
              projectId={project.id}
              name={project.name}
              description={project.description}
            />

            <ProjectSummary projectFullData={project} />
          </Stack>

          {project.status.code === "CANCELLED" ? (
            <GlassCard color={cancelledColor}>
              <Stack
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Typography
                  variant="h6"
                  color="textSecondary"
                  textAlign="center"
                >
                  Este projeto está cancelado e não pode ser gerenciado.
                </Typography>

                <GlassButton
                  variant="contained"
                  onClick={() => ProjectResume()}
                  color="success"
                  sx={{ paddingX: 4, paddingY: 2 }}
                >
                  Reativar
                </GlassButton>
              </Stack>
            </GlassCard>
          ) : (
            <ManageProjectOptions project={project} />
          )}
        </Stack>
      )}

      <MainContextSnackbar />
    </Suspense>
  );
};

export default ManageProjectPage;
