"use server";

import { HTTPError } from "ky";

import type { CollaboratorDto } from "@/data/dto/collaborator-dto";
import { createCollaborator } from "@/http/collaborator/create-collaborator";
import { deleteCollaborator } from "@/http/collaborator/delete-collaborator";
import { editCollaborator } from "@/http/collaborator/edit-collaborator";

export async function createCollaboratorAction(data: CollaboratorDto) {
  const {
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
  } = data;

  try {
    await createCollaborator({
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

export async function editCollaboratorAction(data: CollaboratorDto) {
  const {
    id,
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
  } = data;

  try {
    await editCollaborator({
      id,
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
    });
  } catch (error) {
    console.error("🚀 ~ editCollaboratorAction:", error);
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
    message: "Cliente alterado com sucesso!",
    errors: null,
  };
}

export async function deleteCollaboratorAction(id: string) {
  try {
    await deleteCollaborator(id);
  } catch (error) {
    console.error("🚀 ~ deleteCollaboratorAction:", error);
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

  return {
    success: true,
    message: "Cliente deletado com sucesso!",
    errors: null,
  };
}
