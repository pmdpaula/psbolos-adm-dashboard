"use server";

import type { ProjectDto } from "@/data/dto/project-dto";

import { apiClient } from "../api-client";

interface GetProjectByIdRequest {
  id: string;
}

export async function getProjectById({
  id,
}: GetProjectByIdRequest): Promise<ProjectDto> {
  const result = await apiClient
    .get(`projects/${id}`)
    .json<{ project: ProjectDto }>();

  return result.project;
}
