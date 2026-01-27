"use client";

import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

const GlowingButton = styled(Button)<ButtonProps>(({ theme }) => {
  const errorColor = theme.palette.error.main;
  const warningColor = theme.palette.warning.main;
  const radius = theme.spacing(3);

  return {
    position: "relative",
    padding: "10px 24px",
    // fontSize: "20px",
    fontWeight: 600,
    letterSpacing: "1px",
    // textTransform: "uppercase",
    color: "#fff", // Pure white for better contrast
    background: `linear-gradient(180deg, ${errorColor}A6 0%, ${errorColor}BF 100%)`,
    backdropFilter: "blur(4px)",
    border: `1px solid ${errorColor}66`,
    borderRadius: radius,
    boxShadow: `
      0 0 15px ${errorColor}66,
      0 0 30px ${errorColor}40,
      inset 0 0 10px ${errorColor}66,
      inset 0 0 20px ${errorColor}99,
      inset 0 2px 15px ${errorColor}99,
      inset 0 -2px 15px ${errorColor}
    `,
    transition: "all 0.3s ease-in-out",
    overflow: "hidden",
    fontFamily: "inherit",
    textShadow: `0 0 10px ${errorColor}CC`,

    // Top highlight gloss effect
    "&::before": {
      content: '""',
      position: "absolute",
      top: "2px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "72%",
      height: "10%",
      // background: `linear-gradient(180deg, ${warningColor}CC 0%, ${warningColor}B3 1%, rgba(255, 255, 255, 0) 100%)`,
      background: `radial-gradient(ellipse, ${warningColor}CC 0%, ${warningColor}B3 1%, rgba(255, 255, 255, 0) 100%)`,
      borderRadius: radius,
      opacity: 0.9,
      filter: "blur(1px)",
      pointerEvents: "none",
    },
    // Bottom highlight gloss effect
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "2px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "96%",
      height: "10%",
      background: `linear-gradient(0deg, ${warningColor}CC 0%, ${warningColor}B3 1%, rgba(255, 255, 255, 0) 100%)`,
      borderRadius: radius,
      opacity: 0.9,
      filter: "blur(1px)",
      pointerEvents: "none",
    },

    "&:hover": {
      background: `linear-gradient(180deg, ${errorColor}BF 0%, ${errorColor}D9 100%)`,
      boxShadow: `
        0 0 25px ${errorColor}99,
        0 0 50px ${errorColor}66,
        inset 0 0 15px ${errorColor}99,
        inset 0 0 25px ${errorColor}CC
      `,
      transform: "scale(1.02)",
      color: "#fff",
      textShadow: `0 0 15px ${errorColor}FF`,
    },

    "&:active": {
      transform: "scale(0.98)",
      boxShadow: `
        0 0 10px ${errorColor}80,
        inset 0 0 12px ${errorColor}80
       `,
    },
  };
});

interface Button2Props extends ButtonProps {
  children?: ReactNode; // Made optional to avoid strict errors if not passed immediately, though requested.
}

export const Button2 = ({ children, ...props }: Button2Props) => {
  return (
    <GlowingButton
      disableRipple
      {...props}
    >
      {children}
    </GlowingButton>
  );
};
