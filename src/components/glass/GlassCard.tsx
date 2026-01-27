"use client";

import { Paper } from "@mui/material";
import { type PaletteColor, styled, useTheme } from "@mui/material/styles";
import React from "react";

import type { PaletteColorKey } from "@/theme/baseTheme";

// Criamos o componente estilizado que recebe a cor como prop
const StyledProPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "color",
})(({ theme, color }) => ({
  position: "relative",
  padding: theme.spacing(4),
  borderRadius: "24px",
  backgroundColor: "#0a1010", // Fundo escuro base
  backgroundImage: `radial-gradient(circle at 50% -20%, ${color}44 0%, transparent 70%)`,
  border: `1px solid ${color}33`,
  color: theme.palette.text.primary,
  overflow: "hidden",
  boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${color}11`,

  // Efeito de brilho na borda superior (opcional para dar mais realismo)
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "60%",
    height: "1px",
    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
    opacity: 0.5,
  },
}));

interface GlassCardProps extends React.ComponentProps<typeof Paper> {
  color?: PaletteColorKey;
  children: React.ReactNode;
}

const GlassCard = ({
  color = "primary",
  children,
  ...props
}: GlassCardProps) => {
  const theme = useTheme();

  const paletteColor = theme.palette[color] as PaletteColor;
  color = paletteColor.main as PaletteColorKey;

  return (
    <StyledProPaper
      color={color}
      elevation={0}
      {...props}
      sx={{ ...props.sx }}
    >
      {children}
    </StyledProPaper>
  );
};

export default GlassCard;
