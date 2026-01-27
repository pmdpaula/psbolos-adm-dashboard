import { Container } from "@mui/material";

import { checkAuthentication } from "@/auth/auth";
import { Header } from "@/components/Header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await checkAuthentication();

  return (
    <main>
      <Header variant="common" />

      <Container
        maxWidth="md"
        sx={{ py: 3 }}
      >
        {children}
      </Container>
    </main>
  );
}
