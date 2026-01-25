"use server";

import { apiClient } from "../api-client";

export async function deleteProject(id: string): Promise<unknown> {
  const result = await apiClient.delete(`projects/${id}`);

  return result;
}
