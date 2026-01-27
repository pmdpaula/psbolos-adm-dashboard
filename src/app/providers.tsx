"use client";

import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/reactQuery";
import theme from "@/theme/themeGreenDark";

import { MainProvider } from "./MainContext";
// import theme from "@/theme/theme";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          theme={theme}
          disableTransitionOnChange
        >
          <MainProvider>{children}</MainProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
};
