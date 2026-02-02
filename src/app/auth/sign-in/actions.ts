"use server";

import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { type SignInFormData } from "@/data/dto/user-dto";
import { env } from "@/env";
import { signInWithPassword } from "@/http/auth/sign-in-with-password";

export async function signInWithEmailAndPassword(data: SignInFormData) {
  const { email, password } = data;

  try {
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_in: accessTokenExpiresIn,
      refresh_token_expires_at: refreshTokenExpiresAt,
    } = await signInWithPassword({
      email,
      password,
    });

    const cookieStore = await cookies();

    cookieStore.set("access_token", accessToken, {
      maxAge: accessTokenExpiresIn,
      httpOnly: false,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
    });

    cookieStore.set("refresh_token", refreshToken, {
      expires: new Date(refreshTokenExpiresAt),
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
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
