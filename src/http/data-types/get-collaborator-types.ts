"use server";

import type { CollaboratorTypeDto } from "@/data/dto/data-types/collaborator-type-dto";

import { apiClient } from "../api-client";

interface GetCollaboratorTypesResponse {
  collaboratorTypes: CollaboratorTypeDto[];
}

export async function getCollaboratorTypes(): Promise<GetCollaboratorTypesResponse> {
  const result = await apiClient
    .get("collaborator-types")
    .json<GetCollaboratorTypesResponse>();

  return result;
}
