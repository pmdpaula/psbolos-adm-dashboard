"use server";

import { HTTPError } from "ky";

import type { CustomerDto } from "@/data/dto/customer-dto";
import { createCustomer } from "@/http/customer/create-customer";
import { deleteCustomer } from "@/http/customer/delete-customer";
import { editCustomer } from "@/http/customer/edit-customer";

export async function createCustomerAction(data: CustomerDto) {
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
    await createCustomer({
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

export async function editCustomerAction(data: CustomerDto) {
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
    await editCustomer({
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
    console.error("🚀 ~ editCustomerAction:", error);
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

export async function deleteCustomerAction(id: string) {
  try {
    await deleteCustomer(id);
  } catch (error) {
    console.error("🚀 ~ deleteCustomerAction:", error);
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
