import type { SignInFormData } from "@/data/dto/user-dto";

import { apiClient } from "../api-client";

// interface SignInWithPasswordRequest {
//   email: string;
//   password: string;
// }

interface SignInWithPasswordResponse {
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  refresh_token_expires_at: string;
}

export async function signInWithPassword({ email, password }: SignInFormData) {
  const result = await apiClient
    .post("users/sessions", {
      json: { email, password },
    })
    .json<SignInWithPasswordResponse>();

  return result;
}
