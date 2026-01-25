"use client";

import { Box, type BoxProps, styled } from "@mui/material";

// interface NeonCardProps extends React.HTMLAttributes<BoxProps> {
//   children?: React.ReactNode;
// }

const StyledBox = styled(Box)({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 18,
  minHeight: 40,
  borderRadius: 4,
  // background: "linear-gradient(45deg, #ff0080, #ff8c00)",
  background: "#240012",
  // backdropFilter: "blur(30px)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 2,
    left: 2,
    right: 10,
    bottom: 10,
    borderRadius: 4,
    // background: "linear-gradient(45deg, #ff0080, #ff8c00)",
    boxShadow: "5px 5px 20px rgba(255, 0, 128, 0.5)",
    animation: "neonPulse 2s ease-in-out infinite alternate",
    zIndex: -1,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 10,
    left: 10,
    right: 2,
    bottom: 2,
    borderRadius: 4,
    // background: "linear-gradient(90deg, #094e1e, #1e00ff)",
    boxShadow: "20px 20px 20px rgba(9, 78, 30, 0.5)",
    animation: "neonPulse2 1.5s ease-in-out infinite alternate",
    zIndex: -2,
  },
  "@keyframes neonPulse": {
    "0%": {
      boxShadow: "0 0 20px rgba(255, 0, 128, 0.5)",
    },
    "100%": {
      boxShadow:
        "0 0 20px rgba(255, 0, 128, 0.8), 0 0 35px rgba(255, 140, 0, 0.4)",
    },
  },
  "@keyframes neonPulse2": {
    "0%": {
      boxShadow: "0 0 20px rgba(9, 78, 30, 0.5)",
    },
    "100%": {
      boxShadow:
        "0 0 20px rgba(9, 78, 30, 0.8), 0 0 35px rgba(30, 0, 255, 0.4)",
    },
  },
});

export const NeonCard = ({ children, ...props }: BoxProps) => {
  return <StyledBox {...props}>{children}</StyledBox>;
};
