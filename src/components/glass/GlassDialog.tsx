import {
  darken,
  Dialog,
  type DialogProps,
  DialogTitle,
  lighten,
  type Palette,
  type PaletteColor,
  styled,
  useTheme,
} from "@mui/material";

import type { PaletteColorKey } from "@/theme/baseTheme";

import GlassCardHover from "./GlassCardHover";

const GlassDialogBase = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    color: theme.palette.text.primary,
  },
}));

interface GlassDialogProps extends DialogProps {
  children?: React.ReactNode;
  title?: string;
  color?: keyof Palette;
}

export const GlassDialog = ({
  children,
  title,
  color = "primary",
  ...props
}: GlassDialogProps) => {
  const theme = useTheme();

  const paletteColor = theme.palette[color] as PaletteColor;
  const transformedColor = paletteColor[theme.palette.mode] as PaletteColorKey;

  return (
    <GlassDialogBase
      {...props}
      PaperComponent={(props) => (
        <GlassCardHover
          {...props}
          color={color as PaletteColorKey}
          sx={{ padding: 2 }}
        />
      )}
    >
      {title && (
        <DialogTitle
          id="alert-dialog-title"
          fontWeight="bold"
          variant="h5"
          color={
            theme.palette.mode === "dark"
              ? lighten(transformedColor, 0.3)
              : darken(transformedColor, 0.8)
          }
        >
          {title}
        </DialogTitle>
      )}
      {children}
    </GlassDialogBase>
  );
};
