import { Container } from "@mui/material";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/auth/auth";
import { Header } from "@/components/Header";
import { getProfile } from "@/http/user/get-profile";

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

  return (
    <main>
      <Header variant="common" />

      <Container
        maxWidth="md"
        // disableGutters
        sx={{ paddingY: 3 }}
      >
        {children}
      </Container>
    </main>
  );
}
