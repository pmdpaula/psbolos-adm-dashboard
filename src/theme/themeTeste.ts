// theme.ts
import { alpha, createTheme, PaletteMode } from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";

// Declaração de módulo para estender a paleta do Material UI
declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
    gradient1: Palette["primary"];
    gradient2: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
    gradient1?: PaletteOptions["primary"];
    gradient2?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true;
    gradient1: true;
    gradient2: true;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsColorOverrides {
    tertiary: true;
    gradient1: true;
    gradient2: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    tertiary: true;
    gradient1: true;
    gradient2: true;
  }
}

// Cores fornecidas
const colors = {
  primary: "#048368",
  secondary: "#804012",
  tertiary: "#2E151B",
  background: "#190019",
  paper: "#181818",
};
// const colors = {
//   primary: "#2B124C",
//   secondary: "#854F6C",
//   tertiary: "#522B5B",
//   background: "#0c000c",
//   paper: "#1E1E1E",
// };

// Gerar tons de cinza para o tema escuro
const greyPalette = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#bdbdbd",
  500: "#9e9e9e",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
  A100: "#d5d5d5",
  A200: "#aaaaaa",
  A400: "#303030",
  A700: "#616161",
};

// Função para criar tema claro ou escuro
export const createAppTheme = (mode: PaletteMode = "dark") => {
  const isDark = mode === "dark";

  return createTheme({
    cssVariables: true, // Ativar variáveis CSS (v7 feature)
    palette: {
      mode,
      primary: {
        main: colors.primary,
        light: alpha(colors.primary, 0.8),
        dark: alpha(colors.primary, 0.9),
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: colors.secondary,
        light: alpha(colors.secondary, 0.8),
        dark: alpha(colors.secondary, 0.9),
        contrastText: "#000000",
      },
      tertiary: {
        main: colors.tertiary,
        light: alpha(colors.tertiary, 0.8),
        dark: alpha(colors.tertiary, 0.9),
        contrastText: "#FFFFFF",
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
      error: {
        main: "#B51A2B",
        light: "#cd3f4f",
        dark: "#8d1221",
        contrastText: "#FFFFFF",
      },
      warning: {
        main: "#ff9800",
        light: "#ffb74d",
        dark: "#f57c00",
        contrastText: "#000000",
      },
      info: {
        main: "#0077B6",
        light: "#48CaE8",
        dark: "#023E8A",
        contrastText: "#FFFFFF",
      },
      success: {
        main: "#116466",
        light: "#18a2a4",
        dark: "#094d4e",
        contrastText: "#E0E0E0",
      },
      grey: greyPalette,
      background: {
        default: isDark ? colors.background : "#f8f9fa",
        paper: isDark ? colors.paper : "#ffffff",
      },
      text: {
        primary: isDark ? "#FFFFFF" : "rgba(0, 0, 0, 0.87)",
        secondary: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
        disabled: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.38)",
      },
      divider: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
      action: {
        active: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.54)",
        hover: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        hoverOpacity: 0.08,
        selected: isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(0, 0, 0, 0.08)",
        selectedOpacity: 0.16,
        disabled: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)",
        disabledBackground: isDark
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.12)",
        disabledOpacity: 0.38,
        focus: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
        focusOpacity: 0.12,
        activatedOpacity: 0.24,
      },
    },
    // Tipografia personalizada
    // typography: {
    //   fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    //   h1: {
    //     fontSize: "2.5rem",
    //     fontWeight: 700,
    //     lineHeight: 1.2,
    //     letterSpacing: "-0.01562em",
    //   },
    //   h2: {
    //     fontSize: "2rem",
    //     fontWeight: 700,
    //     lineHeight: 1.3,
    //     letterSpacing: "-0.00833em",
    //   },
    //   h3: {
    //     fontSize: "1.75rem",
    //     fontWeight: 600,
    //     lineHeight: 1.4,
    //   },
    //   h4: {
    //     fontSize: "1.5rem",
    //     fontWeight: 600,
    //     lineHeight: 1.4,
    //   },
    //   h5: {
    //     fontSize: "1.25rem",
    //     fontWeight: 600,
    //     lineHeight: 1.5,
    //   },
    //   h6: {
    //     fontSize: "1rem",
    //     fontWeight: 600,
    //     lineHeight: 1.5,
    //   },
    //   subtitle1: {
    //     fontSize: "1rem",
    //     fontWeight: 500,
    //     lineHeight: 1.75,
    //   },
    //   subtitle2: {
    //     fontSize: "0.875rem",
    //     fontWeight: 500,
    //     lineHeight: 1.57,
    //   },
    //   body1: {
    //     fontSize: "1rem",
    //     fontWeight: 400,
    //     lineHeight: 1.5,
    //   },
    //   body2: {
    //     fontSize: "0.875rem",
    //     fontWeight: 400,
    //     lineHeight: 1.43,
    //   },
    //   button: {
    //     fontSize: "0.875rem",
    //     fontWeight: 600,
    //     lineHeight: 1.75,
    //     textTransform: "none",
    //   },
    //   caption: {
    //     fontSize: "0.75rem",
    //     fontWeight: 400,
    //     lineHeight: 1.66,
    //   },
    //   overline: {
    //     fontSize: "0.75rem",
    //     fontWeight: 600,
    //     lineHeight: 2.66,
    //     letterSpacing: "0.08333em",
    //     textTransform: "uppercase",
    //   },
    // },
    // Sistema de sombras (simplificado)
    // shadows: [
    //   "none",
    //   "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    //   "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    //   "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    //   "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    //   "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
    //   "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
    //   "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
    //   "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
    //   "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
    //   "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
    //   "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
    //   "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
    //   "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
    //   "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
    //   "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
    //   "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
    //   "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
    //   "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
    //   "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
    //   "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
    //   "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
    //   "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
    //   "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
    //   "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
    // ],
    // Personalizações de componentes
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
        variants: [
          {
            props: { color: "tertiary" },
            style: ({ theme }) => ({
              backgroundColor: theme.palette.tertiary.main,
              color: theme.palette.tertiary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.tertiary.dark,
              },
            }),
          },
        ],
      },
      MuiChip: {
        variants: [
          {
            props: { color: "tertiary" },
            style: ({ theme }) => ({
              backgroundColor: theme.palette.tertiary.main,
              color: theme.palette.tertiary.contrastText,
            }),
          },
        ],
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? colors.paper : colors.primary,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDark
              ? "0px 4px 20px rgba(0, 0, 0, 0.3)"
              : "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });
};

// Tema padrão (escuro)
const theme = createAppTheme("dark");

export default theme;
