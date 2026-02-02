"use server";

import ky from "ky";

import { env } from "@/env";

interface RefreshTokenRequest {
  refresh_token: string;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  refresh_token_expires_at: string;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  // Use raw ky without apiClient to avoid interceptor interference
  const result = await ky
    .post(`${env.NEXT_PUBLIC_API_URL}/users/sessions/refresh`, {
      json: { refresh_token: refreshToken } satisfies RefreshTokenRequest,
    })
    .json<RefreshTokenResponse>();

  return result;
}

