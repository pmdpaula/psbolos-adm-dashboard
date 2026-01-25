"use server";

import type { CreatePaymentDto } from "@/data/dto/payment-dto";

import { apiClient } from "../api-client";

export async function createPayment({
  projectId,
  amount,
  paidDate,
  note,
}: CreatePaymentDto): Promise<unknown> {
  const result = await apiClient.post(`projects/${projectId}/payments`, {
    json: {
      amount,
      paidDate,
      note,
    },
  });

  return result;
}
