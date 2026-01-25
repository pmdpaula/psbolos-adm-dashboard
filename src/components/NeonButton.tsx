"use client";

import { Button, type ButtonProps, styled } from "@mui/material";

// interface NeonButtonProps extends ButtonProps {
//   // children?: React.ReactNode;
// }

const StyledButton = styled(Button)({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // borderRadius: "6",
  // background: "linear-gradient(45deg, #ff0080, #ff8c00)",
  background: "#240012",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "18px",
    background: "linear-gradient(45deg, #ff0080, #ff8c00)",
    boxShadow: "0 0 20px rgba(255, 0, 128, 0.5)",
    animation: "neonPulse 2s ease-in-out infinite alternate",
    zIndex: -1,
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
});

export const NeonButton = ({ children, ...props }: ButtonProps) => {
  return (
    <StyledButton
      variant="outlined"
      {...props}
    >
      {children}
    </StyledButton>
  );
};
