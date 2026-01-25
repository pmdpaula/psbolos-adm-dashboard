"use server";

import { apiClient } from "../api-client";

export async function disconnectCollaborator(
  collaborationId: string,
): Promise<unknown> {
  const result = await apiClient.delete(`collaborations/${collaborationId}`);

  return result;
}
