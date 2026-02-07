"use server";

import type { CakeDto } from "@/data/dto/cake-dto";

import { apiClient } from "../api-client";

export async function editCake({
  id,
  projectId,
  description,
  price,
  tiers,
  slices,
  // imageUrl,
  // referenceUrl,
  batterCode,
  fillingCode1,
  fillingCode2,
  fillingCode3,
}: CakeDto): Promise<unknown> {
  const result = await apiClient.put(`projects/${projectId}/cakes/${id}`, {
    json: {
      description,
      price,
      tiers,
      slices,
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
