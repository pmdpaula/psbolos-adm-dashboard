"use client";

import { useTheme } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";

export const NeonText = ({ children, ...props }: TypographyProps) => {
  const theme = useTheme();

  return (
    <Typography
      {...props}
      sx={{
        ...props.sx,
        textShadow: `0 0 9px ${theme.palette.primary.main}, 0 0 10px ${theme.palette.primary.main}, 0 0 15px ${theme.palette.primary.main}`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      }}
    >
      {children}
    </Typography>
  );
};
