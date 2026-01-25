"use server";

import type { EventTypeDto } from "@/data/dto/data-types/event-type-dto";

import { apiClient } from "../api-client";

interface GetEventTypesResponse {
  eventTypes: EventTypeDto[];
}

export async function getEventTypes(): Promise<GetEventTypesResponse> {
  const result = await apiClient
    .get("event-types")
    .json<GetEventTypesResponse>();
  return result;
}
