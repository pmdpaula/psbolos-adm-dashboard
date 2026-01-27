// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type PaletteMode } from "@mui/material";

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

declare module "@mui/material/Typography" {
  interface TypographyPropsColorOverrides {
    tertiary: true;
    gradient1: true;
    gradient2: true;
  }
}

declare module "@mui/material/Icon" {
  interface IconPropsColorOverrides {
    tertiary: true;
    gradient1: true;
    gradient2: true;
  }
}

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsColorOverrides {
    tertiary: true;
    gradient1: true;
    gradient2: true;
  }
}

declare module "@mui/material/Badge" {
  interface BadgePropsColorOverrides {
    tertiary: true;
    gradient1: true;
    gradient2: true;
  }
}

export type PaletteColorKey =
  | "primary"
  | "secondary"
  | "tertiary"
  | "gradient1"
  | "gradient2"
  | "error"
  | "warning"
  | "info"
  | "success";
