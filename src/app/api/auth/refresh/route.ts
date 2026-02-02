import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env";
import { refreshAccessToken } from "@/http/auth/refresh-token";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const redirectUrl = request.nextUrl.searchParams.get("redirect_to") || "/";

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  try {
    const {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      access_token_expires_in: accessTokenExpiresIn,
      refresh_token_expires_at: refreshTokenExpiresAt,
    } = await refreshAccessToken(refreshToken);

    cookieStore.set("access_token", accessToken, {
      maxAge: accessTokenExpiresIn,
      httpOnly: false,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
    });

    cookieStore.set("refresh_token", newRefreshToken, {
      expires: new Date(refreshTokenExpiresAt),
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
    });

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error("Failed to refresh token in proxy route:", error);
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}
