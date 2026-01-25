"use server";

import type { ProjectStatusDto } from "@/data/dto/data-types/project-status-dto";

import { apiClient } from "../api-client";

interface GetProjectStatusesResponse {
  projectStatuses: ProjectStatusDto[];
}

export async function getProjectStatuses(): Promise<GetProjectStatusesResponse> {
  const result = await apiClient
    .get("project-statuses")
    .json<GetProjectStatusesResponse>();
  return result;
}
