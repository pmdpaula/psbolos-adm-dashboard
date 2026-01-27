// import { defineAbilityFor } from "@saas/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// import { getMembership } from "@/http/get-membership";
import { getProfile } from "@/http/user/get-profile";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const result = cookieStore.get("token")?.value;
  return !!result;
}

export async function checkAuthentication() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/sign-in");
  }

  try {
    const { user } = await getProfile();
    return { user };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // console.log("🚀 ~ auth ~ error:", error);
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
