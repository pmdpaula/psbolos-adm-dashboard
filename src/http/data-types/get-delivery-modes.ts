"use server";

import type { DeliveryModeDto } from "@/data/dto/data-types/delivery-mode-dto";

import { apiClient } from "../api-client";

interface GetDeliveryModesResponse {
  deliveryModes: DeliveryModeDto[];
}

export async function getDeliveryModes(): Promise<GetDeliveryModesResponse> {
  const result = await apiClient
    .get("delivery-modes")
    .json<GetDeliveryModesResponse>();

  return result;
}
