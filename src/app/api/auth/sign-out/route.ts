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
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // Ignore redirect errors from api-client (e.g. failed refresh during sign-out)
      // We are already signing out, so we can proceed.
    } else {
      console.error("Error signing out from backend:", error);
    }
  }

  cookiesStore.delete("access_token");
  cookiesStore.delete("refresh_token");

  return NextResponse.redirect(redirectUrl);
}
