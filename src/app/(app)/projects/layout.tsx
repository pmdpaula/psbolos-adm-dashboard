import { redirect } from "next/navigation";

import { isAuthenticated } from "@/auth/auth";
import { getProfile } from "@/http/user/get-profile";

import { ProjectProvider } from "./ProjectContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await isAuthenticated())) {
    redirect("/auth/sign-in");
  }

  const { user } = await getProfile();

  if (user.userRole !== "ADMIN") {
    redirect("/about");
  }

  return <ProjectProvider>{children}</ProjectProvider>;
}
