"use client";

import { Suspense, use, useEffect, useState } from "react";

import type { ProjectFullDataDto } from "@/data/dto/project-dto";
import { getProjectFullDataById } from "@/http/project/get-project-full-data-by-id";

import { ProjectHeader } from "../../components/ProjectHeader";
import { ProjectResume } from "../../components/ProjectResume";
import { ManageProjectOptions } from "./ManageProjectOptions";

interface ManageProjectPageProps {
  params: Promise<{ projectId: string }>;
}

const ManageProjectPage = ({ params }: ManageProjectPageProps) => {
  const { projectId } = use(params);

  const [project, setProject] = useState<ProjectFullDataDto | null>(null);

  useEffect(() => {
    const checkAvaibilityOfAProject = async () => {
      const project = await getProjectFullDataById({ id: projectId });
      setProject(project);
    };

    checkAvaibilityOfAProject();
  }, [projectId]);

  return (
    <Suspense>
      {project && (
        <>
          {/* <Stack
            justifyContent="center"
            alignItems="center"
            mb={2}
          > */}
          <ProjectHeader
            projectId={project.id}
            name={project.name}
            description={project.description}
          />
          {/* </Stack> */}

          <ProjectResume projectFullData={project} />

          <ManageProjectOptions project={project} />
        </>
      )}
    </Suspense>
  );
};

export default ManageProjectPage;
