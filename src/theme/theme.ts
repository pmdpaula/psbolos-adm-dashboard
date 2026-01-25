"use client";

import "./baseTheme";

import { alpha, createTheme, darken, type PaletteMode } from "@mui/material";

// Cores fornecidas
const colors = {
  primary: "#fc9dd6",
  secondary: "#6a5452",
  tertiary: "#2E151B",
  background: "#12000e",
  paper: "#120009",
};

export const createAppTheme = (mode: PaletteMode = "dark") => {
  // const isDark = mode === "dark";
  // Create a theme instance.
  return createTheme({
    cssVariables: true,
    palette: {
      // mode: "dark",
      mode,
      primary: {
        main: colors.primary,
        light: alpha(colors.primary, 0.7),
        dark: darken(colors.primary, 0.9),
      },
      secondary: {
        main: colors.secondary,
        light: alpha(colors.secondary, 0.7),
        dark: darken(colors.secondary, 0.9),
      },
      tertiary: {
        main: colors.tertiary,
        light: alpha(colors.tertiary, 0.7),
        dark: darken(colors.tertiary, 0.9),
      },
      gradient1: {
        main: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 55%, ${colors.tertiary} 55%, ${colors.secondary} 100%)`,
        light: `linear-gradient(135deg, ${alpha(colors.primary, 0.8)} 0%, ${alpha(colors.tertiary, 0.8)} 55%, ${alpha(colors.tertiary, 0.8)} 55%, ${alpha(colors.secondary, 0.8)} 100%)`,
        dark: `linear-gradient(135deg, ${alpha(colors.primary, 0.9)} 0%, ${alpha(colors.tertiary, 0.9)} 55%, ${alpha(colors.tertiary, 0.9)} 75%, ${alpha(colors.secondary, 0.9)} 100%)`,
        contrastText: "#FFFFFF",
      },
      gradient2: {
        main: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 65%)`,
        light: `linear-gradient(135deg, ${alpha(colors.primary, 0.8)} 0%, ${alpha(colors.secondary, 0.8)} 65%)`,
        dark: `linear-gradient(135deg, ${alpha(colors.primary, 0.9)} 0%, ${alpha(colors.secondary, 0.9)} 65%)`,
        contrastText: "#FFFFFF",
      },
      background: {
        paper: colors.paper,
        default: colors.background,
      },
      text: {
        primary: "#f9f9f9",
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#0b0006ff",
          },
        },
      },
    },
  });
};

const theme = createAppTheme("dark");

export default theme;
