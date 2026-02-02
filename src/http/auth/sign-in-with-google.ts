import { env } from "@/env";

export function signInWithGoogle() {
  const googleSignInUrl = new URL("/auth/google/login", env.NEXT_PUBLIC_API_URL);

  window.location.href = googleSignInUrl.toString();
}
