"use client";

import { Box } from "@mui/material";
import { use, useEffect, useState } from "react";

import { GradientPaper } from "@/components/GradientPaper";
import type { ProjectDto } from "@/data/dto/project-dto";

import { ProjectHeader } from "../../components/ProjectHeader";
import { FormProject } from "../../FormProject";
import { getProjectByIdAction } from "../actions";

// TODO: Adicionar o header padrão dos projetos
// TODO: Remover o botão de gerar contrato

interface EditProjectPageProps {
  params: Promise<{ projectId: string }>;
}

const EditProjectPage = ({ params }: EditProjectPageProps) => {
  const { projectId } = use(params);
  // const theme = useTheme();
  // const isBreakpointSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [project, setProject] = useState<ProjectDto | null>(null);

  useEffect(() => {
    const loadProjectData = async () => {
      const projectData = await getProjectByIdAction(projectId);
      setProject(projectData);
    };

    loadProjectData();
  }, []);

  return (
    <>
      <Box mb={4}>
        <ProjectHeader
          projectId={projectId}
          name={project?.name || ""}
          description={project?.description || ""}
        />
      </Box>

      {project && (
        <GradientPaper>
          <FormProject
            action="edit"
            projectData={project}
          />
        </GradientPaper>
      )}
    </>
  );
};

export default EditProjectPage;
