import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { apiClient } from "@/http/api-client";

export async function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = "/auth/sign-in";

  const cookiesStore = await cookies();

  try {
    await apiClient.post("users/sessions/sign-out");
  } catch (error) {
    console.error("Error signing out from backend:", error);
  }

  cookiesStore.delete("token");

  return NextResponse.redirect(redirectUrl);
}
