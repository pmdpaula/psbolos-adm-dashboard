"use server";

import type { CakeDto } from "@/data/dto/cake-dto";

import { apiClient } from "../api-client";

interface GetCakeByIdRequest {
  projectId: string;
  cakeId: string;
}

export async function getCakeById({
  projectId,
  cakeId,
}: GetCakeByIdRequest): Promise<CakeDto> {
  const result = await apiClient
    .get(`/projects/${projectId}/cakes/${cakeId}`)
    .json<{ cake: CakeDto }>();

  return result.cake;
}
