"use server";

import type { ProjectFullDataDto } from "@/data/dto/project-dto";

import { apiClient } from "../api-client";

interface GetProjectFullDataByIdRequest {
  id: string;
}

export async function getProjectFullDataById({
  id,
}: GetProjectFullDataByIdRequest): Promise<ProjectFullDataDto> {
  const result = await apiClient
    .get(`projects/${id}/full-data`)
    .json<{ projectFullData: ProjectFullDataDto }>();

  return result.projectFullData;
}
