// import { defineAbilityFor } from "@saas/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// import { getMembership } from "@/http/get-membership";
import { getProfile } from "@/http/user/get-profile";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const result = cookieStore.get("access_token")?.value;
  return !!result;
}

export async function checkAuthentication() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken) {
    // Se não tem access token mas tem refresh token, redirecionar para refresh
    if (refreshToken) {
      redirect("/api/auth/refresh?redirect_to=/");
    }
    redirect("/auth/sign-in");
  }

  try {
    const { user } = await getProfile();
    return { user };
  } catch (error) {
    // Re-throw NEXT_REDIRECT errors - must check for digest property
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    // Se tem refresh token, tentar refresh antes de sign-out
    if (refreshToken) {
      redirect("/api/auth/refresh?redirect_to=/");
    }
    redirect("/api/auth/sign-out");
  }
}

// export async function getCurrentOrganization() {
//   return (await cookies()).get("org")?.value ?? null;
// }

// export async function getCurrentMembership() {
//   const org = await getCurrentOrganization();

//   if (!org) {
//     return null;
//   }

//   const { membership } = await getMembership(org);

//   return membership;
// }

// export async function ability() {
//   const membership = await getCurrentMembership();

//   if (!membership) {
//     return null;
//   }

//   const ability = defineAbilityFor({
//     id: membership.userId,
//     role: membership.role,
//   });

//   return ability;
// }
