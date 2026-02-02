"use server";

import { HTTPError } from "ky";

import type { CreatePaymentDto, PaymentDto } from "@/data/dto/payment-dto";
import { createPayment } from "@/http/payment/create-payment";
import { deletePayment } from "@/http/payment/delete-payment";
import { fetchPaymentsByProjectId } from "@/http/payment/fetch-payments-by-project-id";

export async function fetchPaymentsByProjectIdAction(
  projectId: string,
): Promise<PaymentDto[]> {
  const { payments } = await fetchPaymentsByProjectId(projectId);

  return payments;
}

export async function addPaymentToProjectAction(payment: CreatePaymentDto) {
  try {
    await createPayment({
      projectId: payment.projectId,
      amount: payment.amount,
      paidDate: payment.paidDate,
      note: payment.note,
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
    message: "Pagamento criado com sucesso!",
    errors: null,
  };
}

export async function removePaymentAction(
  projectId: string,
  paymentId: string,
): Promise<{ success: boolean; message: string; errors: null | number }> {
  try {
    await deletePayment(projectId, paymentId);
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
    message: "Pagamento removido com sucesso!",
    errors: null,
  };
}
