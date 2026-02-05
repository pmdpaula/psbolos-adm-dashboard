"use server";

import type { CollaboratorDto } from "@/data/dto/collaborator-dto";

import { apiClient } from "../api-client";

interface FetchCollaboratorsResponse {
  collaborators: CollaboratorDto[];
}

export async function fetchCollaborators(): Promise<FetchCollaboratorsResponse> {
  const result = await apiClient
    .get("collaborators")
    .json<FetchCollaboratorsResponse>();

  return result;
}
