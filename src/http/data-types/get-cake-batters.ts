"use server";

import type { CakeBatterDto } from "@/data/dto/data-types/cake-batter-dto";

import { apiClient } from "../api-client";

interface GetCakeBattersResponse {
  cakeBatters: CakeBatterDto[];
}

export async function getCakeBatters(): Promise<GetCakeBattersResponse> {
  const result = await apiClient
    .get("cake-batters")
    .json<GetCakeBattersResponse>();

  return result;
}
