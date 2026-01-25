"use client";

import { Box, Paper } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import React from "react";

// Container principal que gerencia o empilhamento
const CardContainer = styled(Box)(() => ({
  position: "relative",
  width: "300px",
  margin: "20px auto",
  minHeight: "200px",
  perspective: "1200px", // Define a perspectiva para o efeito 3D
}));

// A camada colorida que fica ao fundo
const BackgroundShape = styled(Box, {
  shouldForwardProp: (prop) => prop !== "accentColor",
})<{ accentColor?: string }>(({ accentColor }) => ({
  position: "absolute",
  top: "-10px",
  right: "-10px",
  width: "100%",
  height: "100%",
  backgroundColor: accentColor,
  borderRadius: "24px",
  zIndex: 1,
  boxShadow: `0 0 20px ${accentColor}80, 0 0 40px ${accentColor}60, 0 0 60px ${accentColor}40, inset 0 0 20px ${accentColor}20`,
  filter: "blur(5px)",
}));

// O card branco frontal
const ForegroundCard = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(4),
  borderRadius: "24px",
  backgroundColor: alpha(theme.palette.background.paper, 0.92),
  textAlign: "center",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0px 10px 30px rgba(0,0,0,0.05)",
  backdropFilter: "blur(10px)",
  transform:
    "perspective(1200px) rotateY(-12deg) rotateX(6deg) translateZ(10px)",
  transformStyle: "preserve-3d",
}));

interface StackedCardProps extends React.ComponentProps<typeof Box> {
  accentColor?: string;
  children: React.ReactNode;
}

const StackedCard = ({
  accentColor = "#5c67f2",
  children,
  ...props
}: StackedCardProps) => {
  return (
    <CardContainer {...props}>
      {/* Camada de Cor */}
      <BackgroundShape accentColor={accentColor} />

      {/* Card de Conteúdo */}
      <ForegroundCard elevation={0}>{children}</ForegroundCard>
    </CardContainer>
  );
};

export default StackedCard;
