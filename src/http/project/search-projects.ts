"use server";

import type { ProjectDto } from "@/data/dto/project-dto";

import { apiClient } from "../api-client";

interface SearchProjectsResponse {
  projects: ProjectDto[];
}

export async function searchProjects(
  query: string,
): Promise<SearchProjectsResponse> {
  const response = await apiClient
    .get("projects-search", {
      searchParams: { query },
    })
    .json<SearchProjectsResponse>();

  return response;
}
