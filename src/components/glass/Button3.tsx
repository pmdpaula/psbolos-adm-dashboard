"use client";

import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

const GlassLoadingButton = styled(Button)<ButtonProps>(({ theme }) => {
  const radius = theme.spacing(6);

  return {
    position: "relative",
    padding: "14px 40px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    color: "#fff",
    // Base glass effect with brown/bronze tones
    background: `linear-gradient(180deg, 
      rgba(139, 69, 55, 0.75) 0%, 
      rgba(101, 45, 35, 0.85) 100%
    )`,
    backdropFilter: "blur(10px)",
    // Golden/amber glowing border
    border: "2px solid rgba(255, 183, 77, 0.6)",
    borderRadius: radius,
    // Complex shadow system for depth and glow
    boxShadow: `
      0 0 20px rgba(255, 160, 0, 0.4),
      0 0 40px rgba(255, 140, 0, 0.2),
      0 8px 20px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 200, 100, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3),
      inset 0 4px 15px rgba(255, 183, 77, 0.15),
      inset 0 -4px 15px rgba(80, 30, 20, 0.4)
    `,
    transition: "all 0.3s ease-in-out",
    overflow: "hidden",
    fontFamily: "inherit",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",

    // Top golden highlight
    "&::before": {
      content: '""',
      position: "absolute",
      top: "3px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "85%",
      height: "30%",
      background: `radial-gradient(ellipse at top, 
        rgba(255, 220, 120, 0.4) 0%, 
        rgba(255, 200, 100, 0.25) 30%,
        transparent 70%
      )`,
      borderRadius: radius,
      opacity: 1,
      filter: "blur(3px)",
      pointerEvents: "none",
    },

    // Bottom inner shadow for depth
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      height: "40%",
      background: `linear-gradient(to top, 
        rgba(60, 20, 10, 0.5) 0%, 
        transparent 100%
      )`,
      borderRadius: radius,
      pointerEvents: "none",
    },

    "&:hover": {
      background: `linear-gradient(180deg, 
        rgba(159, 89, 75, 0.8) 0%, 
        rgba(121, 65, 55, 0.9) 100%
      )`,
      border: "2px solid rgba(255, 193, 87, 0.8)",
      boxShadow: `
        0 0 30px rgba(255, 170, 0, 0.6),
        0 0 60px rgba(255, 150, 0, 0.3),
        0 8px 25px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 210, 110, 0.4),
        inset 0 -1px 0 rgba(0, 0, 0, 0.4),
        inset 0 4px 20px rgba(255, 193, 87, 0.2)
      `,
      transform: "translateY(-2px) scale(1.02)",
      textShadow: "0 2px 6px rgba(0, 0, 0, 0.6)",
    },

    "&:active": {
      transform: "translateY(0) scale(0.98)",
      boxShadow: `
        0 0 15px rgba(255, 160, 0, 0.3),
        0 4px 15px rgba(0, 0, 0, 0.3),
        inset 0 4px 12px rgba(80, 30, 20, 0.5)
      `,
    },

    "&:disabled": {
      background: `linear-gradient(180deg, 
        rgba(100, 60, 50, 0.5) 0%, 
        rgba(80, 40, 30, 0.6) 100%
      )`,
      border: "2px solid rgba(150, 120, 80, 0.3)",
      color: "rgba(255, 255, 255, 0.4)",
      boxShadow: "none",
    },
  };
});

interface Button3Props extends ButtonProps {
  children?: ReactNode;
}

export const Button3 = ({ children, ...props }: Button3Props) => {
  return (
    <GlassLoadingButton disableRipple {...props}>
      {children}
    </GlassLoadingButton>
  );
};
