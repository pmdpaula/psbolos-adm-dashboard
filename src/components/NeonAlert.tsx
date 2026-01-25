"use client";

import { Alert, type AlertProps } from "@mui/material";
import { alpha, keyframes, styled, useTheme } from "@mui/material/styles";
import type { FC } from "react";

type NeonAlertProps = AlertProps;

const pulse = keyframes`
	0% {
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
	60% {
		box-shadow: 0 0 16px 6px var(--neon-shadow-color);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
`;

const AnimatedAlert = styled(Alert, {
  shouldForwardProp: (prop) => prop !== "shadowcolor" && prop !== "bgcolor",
})<{ shadowcolor: string; bgcolor: string }>(({ shadowcolor, bgcolor }) => ({
  "--neon-shadow-color": shadowcolor,
  boxShadow: `0 0 12px 2px ${shadowcolor}`,
  animation: `${pulse} 1.8s ease-in-out infinite`,
  backgroundColor: bgcolor,
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: `1px solid ${shadowcolor}`,
}));

export const NeonAlert: FC<NeonAlertProps> = ({
  severity = "info",
  variant = "standard",
  ...rest
}) => {
  const theme = useTheme();

  const severityColor =
    theme.palette[severity]?.main ?? theme.palette.primary.main;

  const shadowcolor = alpha(severityColor, 0.55);
  const glassColor = alpha(severityColor, variant === "filled" ? 0.24 : 0.12);
  const contrastColor = theme.palette.getContrastText(severityColor);

  return (
    <AnimatedAlert
      shadowcolor={shadowcolor}
      bgcolor={glassColor}
      severity={severity}
      variant={variant}
      slotProps={{
        message: {
          style: {
            color: variant === "filled" ? contrastColor : undefined,
          },
        },
        icon: {
          style: {
            color: variant === "filled" ? contrastColor : undefined,
          },
        },
      }}
      {...rest}
    />
  );
};

export default NeonAlert;
