"use server";

import type { CakeFillingDto } from "@/data/dto/data-types/cake-filling-dto";

import { apiClient } from "../api-client";

interface GetCakeFillingsResponse {
  cakeFillings: CakeFillingDto[];
}

export async function getCakeFillings(): Promise<GetCakeFillingsResponse> {
  const result = await apiClient
    .get("cake-fillings")
    .json<GetCakeFillingsResponse>();

  return result;
}
