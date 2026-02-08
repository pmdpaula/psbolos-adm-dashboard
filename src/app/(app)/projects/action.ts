"use server";

import { HTTPError } from "ky";

import type { ProjectDto } from "@/data/dto/project-dto";
import { deleteProject } from "@/http/project/delete-project";
import { editProject } from "@/http/project/edit-project";
import { getProjectFullDataById } from "@/http/project/get-project-full-data-by-id";

export async function editProjectAction(data: ProjectDto) {
  const {
    id,
    name,
    eventTypeCode,
    eventDate,
    localName,
    paymentMethod,
    deliveryModeCode,
    shippingCost,
    address,
    city,
    state,
    statusCode,
    description,
  } = data;

  try {
    await editProject({
      id,
      name,
      eventTypeCode,
      eventDate,
      localName,
      paymentMethod,
      deliveryModeCode,
      shippingCost,
      address,
      city,
      state,
      statusCode,
      description,
    });
  } catch (error) {
    console.error("🚀 ~ editProjectAction:", error);
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
    message: "Projeto alterado com sucesso!",
    errors: null,
  };
}

export async function deleteProjectAction(id: string) {
  try {
    await deleteProject(id);
  } catch (error) {
    console.error("🚀 ~ deleteProjectAction:", error);
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
    message: "Projeto deletado com sucesso!",
    errors: null,
  };
}

export async function getProjectFullDataByIdAction(id: string) {
  const projectFullData = await getProjectFullDataById({ id });

  return projectFullData;
}
