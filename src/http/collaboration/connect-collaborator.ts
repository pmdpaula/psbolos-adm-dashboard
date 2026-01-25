"use server";

import type { CollaborationDto } from "@/data/dto/collaboration-dto";

import { apiClient } from "../api-client";

export async function createCollaboration({
  role,
  collaboratorTypeCode,
  projectId,
  userId,
  customerId,
}: CollaborationDto): Promise<unknown> {
  const result = await apiClient.post(`collaborations`, {
    json: {
      role,
      collaboratorTypeCode,
      projectId,
      userId,
      customerId,
    },
  });

  return result;
}
