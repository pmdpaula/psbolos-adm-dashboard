"use server";

import type { ProjectDto } from "@/data/dto/project-dto";

import { apiClient } from "../api-client";

interface GetProjectByNameRequest {
  name: string;
}

// type GetProjectByNameResponse = ProjectDto | { project: ProjectDto };

export async function getProjectByName({
  name,
}: GetProjectByNameRequest): Promise<ProjectDto> {
  const result = await apiClient
    .get(`search/projects/name/${name}`)
    .json<{ project: ProjectDto }>();
  // .json<GetProjectByNameResponse>();

  return result.project;
  // return "project" in result ? result.project : result;
}
