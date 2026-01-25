"use server";

import { apiClient } from "../api-client";

export async function deleteCustomer(id: string): Promise<unknown> {
  const result = await apiClient.delete(`customers/${id}`);

  return result;
}
