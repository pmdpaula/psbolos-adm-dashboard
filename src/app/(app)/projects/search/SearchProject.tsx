"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Icon,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { StyledOutlinedInput } from "@/components/form-fields/StyledOutlinedInput";
import type { ProjectDto } from "@/data/dto/project-dto";
import { getDeliveryModes } from "@/http/data-types/get-delivery-modes";
import { getEventTypes } from "@/http/data-types/get-event-types";
import { getProjectStatuses } from "@/http/data-types/get-project-statuses";

import { ProjectDataTable } from "../ProjectDataTable";
import { searchProjectsAction } from "./actions";

export const SearchProjects = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const queryFromUrl = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isReadingData, setIsReadingData] = useState<boolean>(true);

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

  // Executa a busca automaticamente se houver query na URL ao carregar
  useEffect(() => {
    if (queryFromUrl) {
      handleSearch(queryFromUrl);
    }
  }, []);

  const handleSearch = async (term: string) => {
    setIsLoadingProjects(true);
    setError(null);
    setHasSearched(true);

    const result = await searchProjectsAction(term);

    if (result.success) {
      setProjects(result.projects);

      if (result.projects.length === 0) {
        setError("Nenhum projeto encontrado para sua busca");
      }
    } else {
      setError(result.message || "Erro ao buscar projetos");
      setProjects([]);
    }

    setIsLoadingProjects(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchTerm.trim()) {
      setError("Digite um termo para buscar");
      return;
    }

    // Atualiza a URL com o parâmetro query
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", searchTerm.trim());
    router.push(`?${params.toString()}`);

    await handleSearch(searchTerm);
  };

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack
          direction={isMobile ? "column" : "row"}
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <StyledOutlinedInput
            id="search"
            name="search"
            size="small"
            label="Buscar"
            placeholder="Digite um valor para a busca"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon>search</Icon>}
            type="submit"
            disabled={isLoadingProjects || searchTerm.trim().length <= 1}
            sx={{ width: isMobile ? "100%" : 140 }}
          >
            {isLoadingProjects ? <CircularProgress size={24} /> : "Buscar"}
          </Button>
        </Stack>
      </form>

      {error && hasSearched && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {projects.length > 0 && (
        <ProjectDataTable
          projects={projects}
          eventTypes={eventTypesData?.eventTypes || []}
          deliveryModes={deliveryModesData?.deliveryModes || []}
          projectStatuses={projectStatusesData?.projectStatuses || []}
          isReadingData={isReadingData}
        />
      )}
    </Box>
  );
};
