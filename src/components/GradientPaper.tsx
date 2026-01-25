import { Paper, type PaperProps, useTheme } from "@mui/material";
import type { JSX } from "react";

import { NeonText } from "./NeonText";

interface GradientPaperProps extends PaperProps {
  children?: React.ReactNode;
  label?: JSX.Element | string;
}

const SectionLabel = ({ label }: { label: JSX.Element | string }) => {
  const isStringLabel = typeof label === "string";

  return (
    <NeonText
      variant={isStringLabel ? "h6" : "inherit"}
      component="div"
      gutterBottom={isStringLabel}
    >
      {label}
    </NeonText>
  );
};

export const GradientPaper = ({
  children,
  label,
  ...props
}: GradientPaperProps) => {
  const theme = useTheme();

  return (
    <Paper
      {...props}
      sx={{
        p: 2,
        backgroundColor:
          theme.palette.background.default /* fallback for old browsers */,
        background:
          theme.palette.mode === "dark"
            ? theme.palette.gradient1.dark
            : theme.palette.gradient1.light,
        ...props.sx,
      }}
    >
      {label && <SectionLabel label={label} />}
      {children}
    </Paper>
  );
};
