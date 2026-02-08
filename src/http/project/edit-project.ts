"use server";

import type { ProjectDto } from "@/data/dto/project-dto";

import { apiClient } from "../api-client";

export async function editProject({
  id,
  name,
  description,
  eventTypeCode,
  eventDate,
  localName,
  paymentMethod,
  deliveryModeCode,
  shippingCost,
  address,
  city,
  state,
  statusCode,
}: ProjectDto): Promise<unknown> {
  const result = await apiClient.put(`projects/${id}`, {
    json: {
      name,
      description,
      eventTypeCode,
      eventDate,
      localName,
      paymentMethod,
      deliveryModeCode,
      shippingCost,
      address,
      city,
      state,
      statusCode,
    },
  });

  return result;
}
