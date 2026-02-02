import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get("code");

  let accessToken = searchParams.get("access_token");
  let refreshToken = searchParams.get("refresh_token");
  let accessTokenExpiresIn = searchParams.get("access_token_expires_in");
  let refreshTokenExpiresAt = searchParams.get("refresh_token_expires_at");

  if (code) {
    try {
      const backendUrl = new URL(
        "/auth/google/callback",
        env.NEXT_PUBLIC_API_URL,
      );
      backendUrl.search = searchParams.toString();

      const response = await fetch(backendUrl.toString());

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Backend token exchange failed:", errorBody);
        return NextResponse.json(
          { message: "Failed to exchange code for tokens", detail: errorBody },
          { status: 400 },
        );
      }

      const data = await response.json();

      accessToken = data.access_token;
      refreshToken = data.refresh_token;
      accessTokenExpiresIn = data.access_token_expires_in;
      refreshTokenExpiresAt = data.refresh_token_expires_at;
    } catch (error) {
      console.error("Network error during token exchange:", error);
      return NextResponse.json(
        { message: "Network error during token exchange" },
        { status: 500 },
      );
    }
  }

  if (
    !accessToken ||
    !refreshToken ||
    !accessTokenExpiresIn ||
    !refreshTokenExpiresAt
  ) {
    return NextResponse.json(
      { message: "Missing tokens or expiration data" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, {
    path: "/",
    maxAge: Number(accessTokenExpiresIn),
    // httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });

  cookieStore.set("refresh_token", refreshToken, {
    path: "/",
    expires: new Date(refreshTokenExpiresAt),
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });

  // Use NEXT_PUBLIC_APP_URL if available, otherwise fallback to request origin
  const baseUrl = env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const redirectUrl = new URL("/", baseUrl);

  return NextResponse.redirect(redirectUrl);
}
