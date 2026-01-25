"use server";

import type { CreateCakeDto } from "@/data/dto/cake-dto";

import { apiClient } from "../api-client";

export async function createCake({
  projectId,
  description,
  price,
  tiers,
  // imageUrl,
  // referenceUrl,
  batterCode,
  fillingCode1,
  fillingCode2,
  fillingCode3,
}: CreateCakeDto): Promise<unknown> {
  const result = await apiClient.post(`project/${projectId}/cakes`, {
    json: {
      description,
      price,
      tiers,
      // imageUrl,
      // referenceUrl,
      batterCode,
      fillingCode1,
      fillingCode2,
      fillingCode3,
    },
  });

  return result;
}
