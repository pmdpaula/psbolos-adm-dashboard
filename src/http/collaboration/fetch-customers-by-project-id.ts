"use server";

import type { CustomerDto } from "@/data/dto/customer-dto";

import { apiClient } from "../api-client";

interface fetchCustomersByProjectIdResponse {
  customers: CustomerDto[];
}

export async function fetchCustomersByProjectId(
  projectId: string,
): Promise<fetchCustomersByProjectIdResponse> {
  const result = await apiClient
    .get(`collaborations/customers/${projectId}`)
    .json<fetchCustomersByProjectIdResponse>();

  return result;
}
