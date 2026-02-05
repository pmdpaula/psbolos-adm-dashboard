"use server";

import type { CollaboratorDto } from "@/data/dto/collaborator-dto";

import { apiClient } from "../api-client";

export async function createCollaborator({
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
}: CollaboratorDto): Promise<unknown> {
  const result = await apiClient.post(`collaborators`, {
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
