"use server";

import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { type SignInFormData } from "@/data/dto/user-dto";
import { signInWithPassword } from "@/http/auth/sign-in-with-password";

export async function signInWithEmailAndPassword(data: SignInFormData) {
  const { email, password } = data;

  try {
    const { access_token } = await signInWithPassword({
      email,
      password,
    });

    (await cookies()).set("token", access_token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      // httpOnly: true,
      // sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  } catch (error) {
    console.log("🚀 ~ signInWithEmailAndPassword ~ error:", error);
    if (error instanceof HTTPError) {
      const { message } = await error.response.json();

      return { success: false, message, errors: null };
    }

    console.error(error);

    return {
      success: false,
      message: "Algo deu errado. Tente novamente mais tarde.",
      errors: null,
    };
  }

  redirect("/");
  // return { success: true, message: null, errors: null };
}
