import "@/app/globals.css";

import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import type { Metadata } from "next";
import { Ephesis, Roboto } from "next/font/google";

import { Providers } from "./providers";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const ephesis = Ephesis({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ephesis",
});

export const metadata: Metadata = {
  title: "Contrato Patricia Siqueira",
  description:
    "Aplicação para criação de contrato em PDF para Patricia Siqueira Bolos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${ephesis.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body>
        <InitColorSchemeScript
          attribute="class"
          defaultMode="dark"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
