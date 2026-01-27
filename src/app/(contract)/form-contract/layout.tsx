import { Container } from "@mui/material";
import { redirect } from "next/navigation";

import { checkAuthentication } from "@/auth/auth";
import { Header } from "@/components/Header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await checkAuthentication();

  if (user.userRole !== "ADMIN") {
    redirect("/about");
  }

  return (
    <main>
      <Header variant="contract" />

      <Container
        maxWidth="md"
        sx={{ py: 3 }}
      >
        {children}
      </Container>
    </main>
  );
}
