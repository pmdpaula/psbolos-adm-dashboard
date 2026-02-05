"use server";

import { HTTPError } from "ky";

import type { CollaborationDto } from "@/data/dto/collaboration-dto";
import { createCollaboration } from "@/http/collaboration/connect-collaborator";
import { disconnectCollaborator } from "@/http/collaboration/disconnect-collaborator";
import { fetchCollaborationsByProjectId } from "@/http/collaboration/fetch-collaborations-by-project-id";
import { fetchCollaboratorsByProjectId } from "@/http/collaboration/fetch-collaborators-by-project-id";
import { fetchCollaborators } from "@/http/collaborator/fetch-collaborators";
import { getCollaboratorTypes } from "@/http/data-types/get-collaborator-types";

export async function getCollaboratorAction() {
  const collaborator = await fetchCollaborators();

  return collaborator;
}

export async function getCollaboratorTypesAction() {
  const collaboratorTypes = await getCollaboratorTypes();

  return collaboratorTypes;
}

export async function fetchCollaborationsByProjectIdAction(projectId: string) {
  const collaborations = await fetchCollaborationsByProjectId(projectId);

  return collaborations;
}

export async function getCollaboratorByProjectIdAction(projectId: string) {
  const collaborator = await fetchCollaboratorsByProjectId(projectId);

  return collaborator;
}

export async function createCollaborationAction(data: CollaborationDto) {
  const { role, collaboratorTypeCode, projectId, userId, collaboratorId } =
    data;

  try {
    await createCollaboration({
      role,
      collaboratorTypeCode,
      projectId,
      userId,
      collaboratorId,
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
