"use server";

import type { PaymentDto } from "@/data/dto/payment-dto";

import { apiClient } from "../api-client";

interface FetchPaymentsByProjectIdResponse {
  payments: PaymentDto[];
}

export async function fetchPaymentsByProjectId(
  projectId: string,
): Promise<FetchPaymentsByProjectIdResponse> {
  const result = await apiClient
    .get(`projects/${projectId}/payments`)
    .json<FetchPaymentsByProjectIdResponse>();

  return result;
}
