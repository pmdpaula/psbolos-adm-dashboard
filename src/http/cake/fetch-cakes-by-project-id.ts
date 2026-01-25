"use server";

import type { CakeDto } from "@/data/dto/cake-dto";

import { apiClient } from "../api-client";

interface fetchCakesByProjectIdResponse {
  cakes: CakeDto[];
}

export async function fetchCakesByProjectId(
  projectId: string,
): Promise<fetchCakesByProjectIdResponse> {
  const result = await apiClient
    .get(`projects/${projectId}/cakes`)
    .json<fetchCakesByProjectIdResponse>();

  return result;
}
