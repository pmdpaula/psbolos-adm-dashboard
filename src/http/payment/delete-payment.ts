"use server";

import { apiClient } from "../api-client";

export async function deletePayment(
  projectId: string,
  paymentId: string,
): Promise<unknown> {
  const result = await apiClient.delete(
    `projects/${projectId}/payments/${paymentId}`,
  );

  return result;
}
