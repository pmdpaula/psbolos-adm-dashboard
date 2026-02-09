"use server";

import type { PaymentDto } from "@/data/dto/payment-dto";

import { apiClient } from "../api-client";

export async function editPayment({
  id,
  projectId,
  amount,
  paidDate,
  note,
}: PaymentDto): Promise<unknown> {
  const result = await apiClient.put(`projects/${projectId}/payments/${id}`, {
    json: {
      amount,
      paidDate,
      note,
    },
  });

  return result;
}
