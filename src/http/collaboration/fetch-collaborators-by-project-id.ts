"use server";

import type { CollaboratorDto } from "@/data/dto/collaborator-dto";

import { apiClient } from "../api-client";

interface fetchCollaboratorsByProjectIdResponse {
  collaborators: CollaboratorDto[];
}

export async function fetchCollaboratorsByProjectId(
  projectId: string,
): Promise<fetchCollaboratorsByProjectIdResponse> {
  const result = await apiClient
    .get(`collaborations/collaborators/${projectId}`)
    .json<fetchCollaboratorsByProjectIdResponse>();

  return result;
}
