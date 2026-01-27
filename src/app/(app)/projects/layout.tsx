import { redirect } from "next/navigation";

import { checkAuthentication } from "@/auth/auth";

import { ProjectProvider } from "./ProjectContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await checkAuthentication();

  if (user.userRole !== "ADMIN") {
    redirect("/about");
  }

  return <ProjectProvider>{children}</ProjectProvider>;
}
