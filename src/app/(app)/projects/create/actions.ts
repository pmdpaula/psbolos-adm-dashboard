"use server";

import { HTTPError } from "ky";

import type { CreateProjectDto } from "@/data/dto/project-dto";
import { createProject } from "@/http/project/create-project";
import { getProjectById } from "@/http/project/get-project-by-id";
import { getProjectByName } from "@/http/project/get-project-by-name";

export async function createProjectAction(data: CreateProjectDto) {
  const {
    name,
    description,
    eventTypeCode,
    eventDate,
    localName,
    deliveryModeCode,
    shippingCost,
    address,
    city,
    state,
    statusCode,
  } = data;

  try {
    await createProject({
      name,
      description,
      eventTypeCode,
      eventDate,
      localName,
      deliveryModeCode,
      shippingCost,
      address,
      city,
      state,
      statusCode,
    });
  } catch (error) {
    if (error instanceof HTTPError) {
      console.log("🚀 ~ createProjectAction ~ HTTPError:", error);
      const { message } = await error.response.json();

      return { success: false, message, errors: error.response.status };
    }

    console.log("🚀 ~ createProjectAction ~ error:", error);

    return {
      success: false,
      message: "Algo deu errado. Por favor, tente novamente mais tarde.",
      errors: null,
    };
  }

  // redirect("/");
  return {
    success: true,
    message: "Projeto criado com sucesso!",
    errors: null,
  };
}

export async function getProjectByIdAction(id: string) {
  const project = await getProjectById({ id });

  return project;
}

export async function getProjectByNameAction(name: string) {
  const project = await getProjectByName({ name });

  return project;
}
