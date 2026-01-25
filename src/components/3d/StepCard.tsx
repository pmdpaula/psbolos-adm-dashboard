"use client";

import {
  Box,
  CircularProgress,
  Paper,
  SvgIconProps,
  Typography,
} from "@mui/material";
import { darken, lighten, styled, useTheme } from "@mui/material/styles";
import React from "react";

import theme from "@/theme/themeTeste";

// 1. Definição da Interface para as Props
interface StepCardProps {
  color?: string;
  title: string;
  percentage: number;
  subTitle: string;
  description: string;
  // Define que o ícone deve ser um componente React (como os do MUI)
  icon?: React.ElementType<SvgIconProps>;
}

// 2. Tipagem do componente estilizado
// Passamos <{ accentColor: string }> para o styled reconhecer a prop
const OuterCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "accentColor",
})<{ accentColor: string }>(({ accentColor, theme }) => ({
  width: "320px",
  backgroundColor: darken(accentColor, 0.2),
  borderRadius: "24px",
  // border: `3px solid ${darken(accentColor, 0.4)}`,
  paddingTop: 6,
  position: "relative",
  boxShadow: theme.shadows[4],
  display: "flex",
  flexDirection: "column",
  gap: "15px",
}));

const Header = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#fff",
  paddingLeft: 12,
  paddingRight: 12,
});

const InnerContent = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "accentColor",
})<{ accentColor: string }>(({ accentColor, theme }) => ({
  left: 18,
  bottom: -10,
  position: "relative",
  backgroundColor: darken(accentColor, 0.6),
  borderRadius: "60px 20px 20px 20px",
  border: `2px solid ${lighten(accentColor, 0.4)}`,
  padding: theme.spacing(4, 3),
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flexGrow: 1,
  gap: 2,
  boxShadow: "inset 5px 10px 10px rgba(0,0,0,0.3)",
}));

// 3. Componente Funcional com Tipagem
const StepCard: React.FC<StepCardProps> = ({
  color = theme.palette.primary.main,
  title,
  percentage,
  subTitle,
  description,
  icon: Icon,
}) => {
  const theme = useTheme();
  return (
    <OuterCard accentColor={color}>
      <Header>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            letterSpacing: 1,
            textShadow: `0 5px 10px ${color}, 10px 20px 20px ${color}`,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={40}
            sx={{ color: "rgba(255,255,255,0.4)" }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#fff", fontSize: "10px" }}
            >
              {percentage}%
            </Typography>
          </Box>
        </Box>
      </Header>

      <InnerContent
        elevation={0}
        accentColor={color}
      >
        {Icon && <Icon sx={{ fontSize: 50, color: color, mb: 2 }} />}

        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {subTitle}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      </InnerContent>
    </OuterCard>
  );
};

export default StepCard;
