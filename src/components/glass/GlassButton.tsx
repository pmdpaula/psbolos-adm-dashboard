"use client";

import Button from "@mui/material/Button";
import { type PaletteColor, styled, useTheme } from "@mui/material/styles";
import React from "react";

import type { PaletteColorKey } from "@/theme/baseTheme";

// Criamos o componente estilizado que recebe a cor como prop
const StyledProButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "color",
})(({ theme, color }) => ({
  position: "relative",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: "#0a1010", // Fundo escuro base
  backgroundImage: `radial-gradient(circle at 50% -20%, ${color}44 0%, transparent 80%)`,
  border: `1px solid ${color}22`,
  color: theme.palette.getContrastText(color!),
  overflow: "hidden",
  boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${color}11`,
  transition: "all 0.3s ease-in-out",
  backdropFilter: "blur(5px)",

  "&:hover": {
    backgroundImage: `radial-gradient(circle at 50% -20%, ${color}88 0%, transparent 80%)`,
    border: `1px solid ${color}66`,
    boxShadow: `0 25px 50px rgba(0,0,0,0.5), 0 0 30px ${color}33`,
    transform: "translateY(-1px)",
  },

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
    transition: "opacity 0.3s ease-in-out",
  },

  "&:hover::before": {
    opacity: 0.8,
  },
}));

interface GlassButtonProps extends React.ComponentProps<typeof Button> {
  color?: PaletteColorKey;
  children: React.ReactNode;
}

const GlassButton = ({
  color = "primary",
  children,
  ...props
}: GlassButtonProps) => {
  const theme = useTheme();

  const paletteColor = theme.palette[color] as PaletteColor;
  color = paletteColor.main as PaletteColorKey;

  return (
    <StyledProButton
      color={color}
      {...props}
      sx={{ ...props.sx }}
    >
      {children}
    </StyledProButton>
  );
};

export default GlassButton;
