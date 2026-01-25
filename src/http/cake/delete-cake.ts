"use server";

import { apiClient } from "../api-client";

export async function deleteCake(
  projectId: string,
  cakeId: string,
): Promise<unknown> {
  const result = await apiClient.delete(`project/${projectId}/cakes/${cakeId}`);

  return result;
}
