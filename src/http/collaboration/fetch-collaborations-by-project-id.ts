"use server";

import type { CollaborationDto } from "@/data/dto/collaboration-dto";

import { apiClient } from "../api-client";

interface FetchCollaborationsByProjectIdResponse {
  collaborations: CollaborationDto[];
}

export async function fetchCollaborationsByProjectId(
  projectId: string,
): Promise<CollaborationDto[]> {
  const result = await apiClient
    .get(`collaborations/project/${projectId}`)
    .json<FetchCollaborationsByProjectIdResponse>();

  return result.collaborations;
}
