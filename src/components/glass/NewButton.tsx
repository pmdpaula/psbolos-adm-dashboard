import { Button, ButtonProps, styled } from "@mui/material";
import { ReactNode } from "react";

const NeonButton = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "16px 32px",
  fontSize: "16px",
  fontWeight: 700,
  letterSpacing: theme.spacing(0.5),
  textTransform: "uppercase",
  color: "#fff",
  background:
    "linear-gradient(135deg, rgba(255, 50, 50, 0.7) 0%, rgba(255, 80, 40, 0.7) 100%)",
  border: "1px solid #ff5522",
  borderRadius: "50px",
  boxShadow: `
    0 0 10px #ff5522,
    0 0 20px rgba(255, 85, 34, 0.6),
    0 0 35px rgba(255, 68, 68, 0.4),
    inset 0 2px 12px rgba(255, 200, 100, 0.8),
    inset 0 -2px 12px rgba(200, 30, 0, 0.5),
    inset 2px 0 15px rgba(255, 180, 80, 0.5),
    inset -2px 0 15px rgba(180, 20, 0, 0.4)
  `,
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    background:
      "linear-gradient(180deg, rgba(255, 220, 150, 0.25) 0%, transparent 100%)",
    borderRadius: "50px 50px 0 0",
  },
  "&:hover": {
    background:
      "linear-gradient(135deg, rgba(255, 50, 50, 0.85) 0%, rgba(255, 80, 40, 0.85) 100%)",
    boxShadow: `
      0 0 25px #ff6633,
      0 0 30px rgba(255, 102, 51, 0.7),
      0 0 40px rgba(255, 85, 34, 0.5),
      inset 0 2px 15px rgba(255, 220, 120, 0.7),
      inset 0 -2px 15px rgba(220, 40, 0, 0.6),
      inset 2px 0 18px rgba(255, 200, 100, 0.6),
      inset -2px 0 18px rgba(200, 30, 0, 0.5)
    `,
    border: "3px solid #ff6633",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: `
      0 0 18px #ff5522,
      0 0 30px rgba(255, 85, 34, 0.5),
      inset 0 2px 10px rgba(255, 200, 100, 0.6),
      inset 0 -2px 10px rgba(200, 30, 0, 0.5)
    `,
  },
  "&:disabled": {
    color: "rgba(255, 68, 68, 0.4)",
    border: "2px solid rgba(255, 68, 68, 0.3)",
    boxShadow: "none",
  },
}));

interface NewButtonProps extends Omit<ButtonProps, "children"> {
  children: ReactNode;
}

export const NewButton = ({ children, ...props }: NewButtonProps) => {
  return (
    <NeonButton
      variant="outlined"
      {...props}
    >
      {children}
    </NeonButton>
  );
};
