"use client";

import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

// Definição das paletas de cores para cada tipo de metal
const metalPalettes = {
  ouro: {
    // Gradiente horizontal para dar o efeito de reflexo metálico
    headerGradient:
      "linear-gradient(to right, #bf9b30, #ffd700, #fff7cc, #ffd700, #bf9b30)",
    // Cor da borda e do brilho
    borderColor: "#FFD700",
    // Sombra para o efeito de "glow"
    glowShadow:
      "0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.3)",
  },
  "ouro rosa": {
    headerGradient:
      "linear-gradient(to right, #c19a8b, #e6c2b4, #ffe4e1, #e6c2b4, #c19a8b)",
    borderColor: "#e6c2b4",
    glowShadow:
      "0 0 20px rgba(230, 194, 180, 0.5), inset 0 0 10px rgba(230, 194, 180, 0.3)",
  },
  cobre: {
    headerGradient:
      "linear-gradient(to right, #8a4b1c, #b87333, #ffd8b1, #b87333, #8a4b1c)",
    borderColor: "#b87333",
    glowShadow:
      "0 0 20px rgba(184, 115, 51, 0.5), inset 0 0 10px rgba(184, 115, 51, 0.3)",
  },
  prata: {
    headerGradient:
      "linear-gradient(to right, #7f7f7f, #c0c0c0, #ffffff, #c0c0c0, #7f7f7f)",
    borderColor: "#C0C0C0",
    glowShadow:
      "0 0 20px rgba(192, 192, 192, 0.5), inset 0 0 10px rgba(192, 192, 192, 0.3)",
  },
} as const;

// Container principal que segura tudo
const PanelRoot = styled(Box)({
  position: "relative",
  // Espaço no topo para o cabeçalho que se sobressai
  paddingTop: "40px",
  maxWidth: "350px",
  margin: "auto",
});

// O cabeçalho metálico curvado
const HeaderPlate = styled(Box, {
  shouldForwardProp: (prop) => prop !== "palette",
})<{ palette: (typeof metalPalettes)[keyof typeof metalPalettes] }>(
  ({ theme, palette }) => ({
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "110%", // Mais largo que o corpo
    minHeight: "100px",
    background: palette.headerGradient,
    // Cria a curva na parte inferior
    borderBottomLeftRadius: "50% 30px",
    borderBottomRightRadius: "50% 30px",
    // Bordas superiores arredondadas para combinar com o card
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // Sombra sutil para dar profundidade em relação ao corpo
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    zIndex: 2, // Fica por cima do corpo
    padding: theme.spacing(2),
    color: "#3e2b15", // Cor do texto do título (um marrom escuro para contraste)
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
  }),
);

// O corpo do card
const PanelBody = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "palette",
})<{ palette: (typeof metalPalettes)[keyof typeof metalPalettes] }>(
  ({ theme, palette }) => ({
    position: "relative",
    // Gradiente escuro para o fundo
    background: "linear-gradient(to bottom, #2b2b2b, #141414)",
    borderRadius: "20px",
    // Borda sólida da cor do metal
    border: `2px solid ${palette.borderColor}`,
    // Efeito de brilho (glow)
    boxShadow: palette.glowShadow,
    color: "#fff",
    overflow: "hidden",
    zIndex: 1,
    // Padding interno para o conteúdo
    padding: theme.spacing(8, 3, 4, 3), // Mais padding no topo para compensar o cabeçalho
  }),
);

interface MetallicPanelProps {
  colorType?: keyof typeof metalPalettes;
  title: string;
  children: React.ReactNode;
}

const MetallicPanel = ({
  colorType = "ouro",
  title,
  children,
}: MetallicPanelProps) => {
  // Seleciona a paleta com base na prop, usa 'ouro' como fallback
  const palette = metalPalettes[colorType] || metalPalettes["ouro"];

  return (
    <PanelRoot>
      <HeaderPlate palette={palette}>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          {title}
        </Typography>
      </HeaderPlate>
      <PanelBody
        palette={palette}
        elevation={0}
      >
        {children}
      </PanelBody>
    </PanelRoot>
  );
};

export default MetallicPanel;
