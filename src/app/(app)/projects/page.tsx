"use client";

import CakeIcon from "@mui/icons-material/Cake";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getDeliveryModes } from "@/http/data-types/get-delivery-modes";
import { getEventTypes } from "@/http/data-types/get-event-types";
import { getProjectStatuses } from "@/http/data-types/get-project-statuses";
import { getProjects } from "@/http/project/get-projects";

import { ProjectDataTable } from "./ProjectDataTable";

const ProjectPage = () => {
  const router = useRouter();

  const [isReadingData, setIsReadingData] = useState<boolean>(true);

  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => await getProjects(),
  });

  const { data: eventTypesData, isLoading: isLoadingEventTypes } = useQuery({
    queryKey: ["event-types"],
    queryFn: async () => await getEventTypes(),
  });

  const { data: deliveryModesData, isLoading: isLoadingDeliveryModes } =
    useQuery({
      queryKey: ["delivery-modes"],
      queryFn: async () => await getDeliveryModes(),
    });

  const { data: projectStatusesData, isLoading: isLoadingProjectStatuses } =
    useQuery({
      queryKey: ["project-statuses"],
      queryFn: async () => await getProjectStatuses(),
    });

  function checkReadingData() {
    if (
      !isLoadingProjects &&
      !isLoadingEventTypes &&
      !isLoadingDeliveryModes &&
      !isLoadingProjectStatuses
    ) {
      setIsReadingData(false);
    } else {
      setIsReadingData(true);
    }
  }

  useEffect(() => {
    checkReadingData();
  }, [
    isLoadingProjects,
    isLoadingEventTypes,
    isLoadingDeliveryModes,
    isLoadingProjectStatuses,
  ]);

  function handleAddProject() {
    router.push("/projects/create");
  }

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ flexGrow: 1 }}
        >
          Projetos
        </Typography>

        <Tooltip title="Adicionar Projeto">
          <Button
            onClick={() => handleAddProject()}
            variant="text"
          >
            <CakeIcon />+
          </Button>
        </Tooltip>
      </Stack>

      {!isReadingData && (
        <ProjectDataTable
          projects={projectsData?.projects || []}
          eventTypes={eventTypesData?.eventTypes || []}
          deliveryModes={deliveryModesData?.deliveryModes || []}
          projectStatuses={projectStatusesData?.projectStatuses || []}
          isReadingData={isReadingData}
        />
      )}
    </>
  );
};

export default ProjectPage;
