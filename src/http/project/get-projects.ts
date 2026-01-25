"use server";

import type { ProjectDto } from "@/data/dto/project-dto";

import { apiClient } from "../api-client";

interface GetProjectsResponse {
  projects: ProjectDto[];
}

export async function getProjects(): Promise<GetProjectsResponse> {
  const result = await apiClient.get("projects").json<GetProjectsResponse>();
  return result;
}
