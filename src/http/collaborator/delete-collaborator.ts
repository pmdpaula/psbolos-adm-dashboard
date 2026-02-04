"use server";

import { apiClient } from "../api-client";

export async function deleteCollaborator(id: string): Promise<unknown> {
  const result = await apiClient.delete(`customers/${id}`);

  return result;
}
