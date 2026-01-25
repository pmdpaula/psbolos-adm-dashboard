"use server";

import type { CakeDto } from "@/data/dto/cake-dto";

import { apiClient } from "../api-client";

export async function editCake({
  id,
  description,
  price,
  tiers,
  // imageUrl,
  // referenceUrl,
  batterCode,
  fillingCode1,
  fillingCode2,
  fillingCode3,
}: CakeDto): Promise<unknown> {
  const result = await apiClient.put(`cakes/${id}`, {
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
