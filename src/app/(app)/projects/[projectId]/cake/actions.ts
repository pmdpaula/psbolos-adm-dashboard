"use server";

import { HTTPError } from "ky";

import type { CakeDto, CreateCakeDto } from "@/data/dto/cake-dto";
import { createCake } from "@/http/cake/create-cake";
import { deleteCake } from "@/http/cake/delete-cake";
import { editCake } from "@/http/cake/edit-cake";
import { fetchCakesByProjectId } from "@/http/cake/fetch-cakes-by-project-id";

export async function fetchCakesByProjectIdAction(
  projectId: string,
): Promise<CakeDto[]> {
  const { cakes } = await fetchCakesByProjectId(projectId);

  return cakes;
}

export async function addCakeToProjectAction(cake: CreateCakeDto) {
  try {
    await createCake({
      projectId: cake.projectId,
      description: cake.description,
      price: cake.price,
      tiers: cake.tiers,
      slices: cake.slices,
      // imageUrl: cake.imageUrl,
      // referenceUrl: cake.referenceUrl,
      batterCode: cake.batterCode,
      fillingCode1: cake.fillingCode1,
      fillingCode2: cake.fillingCode2,
      fillingCode3: cake.fillingCode3,
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

  return {
    success: true,
    message: "Bolo criado com sucesso!",
    errors: null,
  };
}

export async function editCakeInProjectAction(cake: CakeDto) {
  try {
    await editCake({
      id: cake.id,
      projectId: cake.projectId,
      description: cake.description,
      price: cake.price,
      tiers: cake.tiers,
      slices: cake.slices,
      // imageUrl: cake.imageUrl,
      // referenceUrl: cake.referenceUrl,
      batterCode: cake.batterCode,
      fillingCode1: cake.fillingCode1,
      fillingCode2: cake.fillingCode2,
      fillingCode3: cake.fillingCode3,
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

  return {
    success: true,
    message: "Bolo editado com sucesso!",
    errors: null,
  };
}

export async function removeCakeAction(
  projectId: string,
  cakeId: string,
): Promise<{ success: boolean; message: string; errors: null | number }> {
  try {
    await deleteCake(projectId, cakeId);
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

  return {
    success: true,
    message: "Bolo removido com sucesso!",
    errors: null,
  };
}
