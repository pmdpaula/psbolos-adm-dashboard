"use server";

import { HTTPError } from "ky";

import type { CollaborationDto } from "@/data/dto/collaboration-dto";
import { createCollaboration } from "@/http/collaboration/connect-collaborator";
import { disconnectCollaborator } from "@/http/collaboration/disconnect-collaborator";
import { fetchCollaborationsByProjectId } from "@/http/collaboration/fetch-collaborations-by-project-id";
import { fetchCustomersByProjectId } from "@/http/collaboration/fetch-customers-by-project-id";
import { getCustomers } from "@/http/customer/get-customers";
import { getCollaboratorTypes } from "@/http/data-types/get-collaborator-types";

export async function getCustomersAction() {
  const customers = await getCustomers();

  return customers;
}

export async function getCollaboratorTypesAction() {
  const collaboratorTypes = await getCollaboratorTypes();

  return collaboratorTypes;
}

export async function fetchCollaborationsByProjectIdAction(projectId: string) {
  const collaborations = await fetchCollaborationsByProjectId(projectId);

  return collaborations;
}

export async function getCustomersByProjectIdAction(projectId: string) {
  const customers = await fetchCustomersByProjectId(projectId);

  return customers;
}

export async function createCollaborationAction(data: CollaborationDto) {
  const { role, collaboratorTypeCode, projectId, userId, customerId } = data;

  try {
    await createCollaboration({
      role,
      collaboratorTypeCode,
      projectId,
      userId,
      customerId,
    });
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json();

      return { success: false, message, errors: error.response.status };
    }

    return {
      success: false,
      message: "Algo deu errado. Por favor, tente novamente mais tarde.",
      errors: null,
    };
  }

  // redirect("/");
  return {
    success: true,
    message: "Cliente criado com sucesso!",
    errors: null,
  };
}

export async function disconnectCollaboratorAction(collaborationId: string) {
  try {
    await disconnectCollaborator(collaborationId);
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json();

      return { success: false, message, errors: error.response.status };
    }

    return {
      success: false,
      message: "Algo deu errado. Por favor, tente novamente mais tarde.",
      errors: null,
    };
  }

  // redirect("/");
  return {
    success: true,
    message: "Colaborador desconectado com sucesso!",
    errors: null,
  };
}
