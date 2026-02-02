import { getCookie } from "cookies-next";
import ky from "ky";

import { env } from "@/env";

export const apiClient = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let accessToken: string | undefined;

        if (typeof window !== "undefined") {
          accessToken = getCookie("access_token") as string | undefined;
        } else {
          const { cookies: getServerCookies } = await import("next/headers");
          const cookieStore = await getServerCookies();
          accessToken = cookieStore.get("access_token")?.value;
        }

        if (accessToken && !request.url.includes("users/sessions/refresh")) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          // Skip if this is the refresh endpoint itself to avoid loops
          if (request.url.includes("users/sessions/refresh")) {
            return;
          }

          if (typeof window !== "undefined") {
            // Client-side: redirect to the refresh route
            // The refresh route can read httpOnly cookies and will redirect back
            const currentUrl = window.location.href;
            window.location.href = `/api/auth/refresh?redirect_to=${encodeURIComponent(currentUrl)}`;
            // Return a never-resolving promise to prevent further execution
            return new Promise(() => {});
          } else {
            // Server-side: throw error to be handled by caller (e.g., checkAuthentication)
            const error = new Error("Unauthorized - Token expired");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).status = 401;
            throw error;
          }
        }
      },
    ],
  },
});
