"use client";

import CakeIcon from "@mui/icons-material/Cake";
import { Button, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type { ProjectDto } from "@/data/dto/project-dto";
import { getDeliveryModes } from "@/http/data-types/get-delivery-modes";
import { getEventTypes } from "@/http/data-types/get-event-types";
import { getProjectStatuses } from "@/http/data-types/get-project-statuses";
import { getProjects } from "@/http/project/get-projects";

import { NearestProjects } from "./NearestProjects";
import { ProjectsList } from "./ProjectsList";

const ProjectPage = () => {
  const [isReadingData, setIsReadingData] = useState<boolean>(true);

  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => await getProjects(),
  });

  const { data: _eventTypesData, isLoading: isLoadingEventTypes } = useQuery({
    queryKey: ["event-types"],
    queryFn: async () => await getEventTypes(),
  });

  const { data: _deliveryModesData, isLoading: isLoadingDeliveryModes } =
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

  function getNextTwoWeeksProjects(data: ProjectDto[]) {
    // Calcular o próximo domingo (fim desta semana)
    const getNextSunday = (dateString: string) => {
      const [year, month, day] = dateString
        .split("T")[0]
        .split("-")
        .map(Number);
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
      const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
      date.setDate(date.getDate() + daysUntilSunday);
      return date;
    };

    const getDateOnly = (dateString: string) => {
      // Extrai apenas a data (YYYY-MM-DD) sem interpretar como UTC
      const [year, month, day] = dateString
        .split("T")[0]
        .split("-")
        .map(Number);
      return new Date(year, month - 1, day);
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const thisWeekEnd = getNextSunday(new Date().toISOString().split("T")[0]);
    const nextWeekEnd = new Date(thisWeekEnd);
    nextWeekEnd.setDate(thisWeekEnd.getDate() + 7);

    return data.filter((project) => {
      const projectDate = getDateOnly(project.eventDate);
      const isWithinTwoWeeks = projectDate >= now && projectDate <= nextWeekEnd;
      const isNotCompleted = project.statusCode !== "COMPLETED";
      const isNotCancelled = project.statusCode !== "CANCELLED";

      return isWithinTwoWeeks && isNotCompleted && isNotCancelled;
    });
  }

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ flexGrow: 1 }}
        >
          Projetos
        </Typography>

        <Button
          href="/projects/search"
          variant="outlined"
          disableRipple
          disableElevation
          sx={{ marginRight: 1 }}
        >
          Buscar Projetos
        </Button>

        <Tooltip title="Adicionar Projeto">
          <Button
            href="/projects/create"
            variant="text"
            disableRipple
            disableElevation
          >
            <CakeIcon />+
          </Button>
        </Tooltip>
      </Stack>

      {isReadingData ? (
        <>
          <Skeleton
            height={300}
            width="100%"
            animation="wave"
            sx={{ marginBottom: -8 }}
          />

          <Skeleton
            height={400}
            width="100%"
            animation="wave"
          />
        </>
      ) : (
        <>
          <NearestProjects
            projects={getNextTwoWeeksProjects(projectsData?.projects || [])}
          />

          <ProjectsList
            projects={projectsData?.projects || []}
            projectStatuses={projectStatusesData?.projectStatuses || []}
          />

          {/* <ProjectDataTable
            projects={projectsData?.projects || []}
            eventTypes={eventTypesData?.eventTypes || []}
            deliveryModes={deliveryModesData?.deliveryModes || []}
            projectStatuses={projectStatusesData?.projectStatuses || []}
            isReadingData={isReadingData}
          /> */}
        </>
      )}
    </>
  );
};

export default ProjectPage;
