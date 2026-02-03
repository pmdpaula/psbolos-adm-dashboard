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
  margin: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: "#0a1010", // Fundo escuro base
  backgroundImage: `radial-gradient(circle at 50% -20%, ${color}77 0%, transparent 70%)`,
  border: `1px solid ${color}99`,
  overflow: "hidden",
  // boxShadow: `0 20px 40px rgba(0,0,0,0.8), 0 0 20px ${color}11`,
  boxShadow: `0 0 20px ${color}55, 0 0 5px ${color}11`,
  transition: "all 0.3s ease-in-out",
  cursor: "pointer",
  backdropFilter: "blur(5px)",

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

  // Efeito hover com zoom e aumento de sombra
  "&:hover": {
    transform: "scale(1.01)",
    // boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 30px ${color}30`,
    boxShadow: `0 0 30px ${color}66, 0 0 5px ${color}11`,
  },
}));

interface GlassCardHoverProps extends React.ComponentProps<typeof Paper> {
  color?: PaletteColorKey;
  children?: React.ReactNode;
}

const GlassCardHover = ({
  color = "primary",
  children,
  ...props
}: GlassCardHoverProps) => {
  const theme = useTheme();

  const paletteColor = theme.palette[color] as PaletteColor;
  color = paletteColor.main as PaletteColorKey;
  // color = paletteColor[theme.palette.mode] as PaletteColorKey;

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

export default GlassCardHover;
