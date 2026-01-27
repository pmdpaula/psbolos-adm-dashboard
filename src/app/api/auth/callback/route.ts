import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

// import { acceptInvite } from "@/http/accept-invite";
import { signInWithGitHub } from "@/http/auth/sign-in-with-github";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ message: "Code not provided" }, { status: 400 });
  }

  const { token } = await signInWithGitHub({ code });

  (await cookies()).set("token", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    // httpOnly: true,
    // sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // const inviteId = (await cookies()).get("inviteId")?.value;

  // if (inviteId) {
  //   try {
  //     // await acceptInvite(inviteId);
  //     (await cookies()).delete("inviteId");
  //     // eslint-disable-next-line no-empty
  //   } catch {}
  // }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";
  redirectUrl.search = "";

  return NextResponse.redirect(redirectUrl);
}
