"use server";

import type { CustomerDto } from "@/data/dto/customer-dto";

import { apiClient } from "../api-client";

export async function createCustomer({
  name,
  registerNumber,
  contactType1,
  contact1,
  contactType2,
  contact2,
  address,
  city,
  state,
  zipCode,
  country,
}: CustomerDto): Promise<unknown> {
  const result = await apiClient.post(`customers`, {
    json: {
      name,
      registerNumber,
      contactType1,
      contact1,
      contactType2,
      contact2,
      address,
      city,
      state,
      zipCode,
      country,
    },
  });

  return result;
}
