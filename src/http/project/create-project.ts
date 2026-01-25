"use server";

import type { CreateProjectDto } from "@/data/dto/project-dto";

import { apiClient } from "../api-client";

export async function createProject({
  name,
  description,
  eventTypeCode,
  eventDate,
  localName,
  deliveryModeCode,
  shippingCost,
  address,
  city,
  state,
  statusCode,
}: CreateProjectDto): Promise<unknown> {
  const result = await apiClient.post(`projects`, {
    json: {
      name,
      description,
      eventTypeCode,
      eventDate,
      localName,
      deliveryModeCode,
      address,
      city,
      state,
      shippingCost,
      statusCode,
    },
  });

  return result;
}
