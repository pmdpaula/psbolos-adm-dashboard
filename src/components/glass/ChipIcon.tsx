import { alpha, Box, Icon, Typography, useTheme } from "@mui/material";

import type { PaletteColorKey } from "@/theme/baseTheme";

import GlassCard from "./GlassCard";

export type ChipIconProps = {
  color: PaletteColorKey;
  icon: string;
  text: string;
};

export const ChipIcon = ({ color, icon, text }: ChipIconProps) => {
  const theme = useTheme();

  return (
    <GlassCard
      sx={{
        paddingY: 0.5,
        paddingLeft: 5,
        paddingRight: 1.5,
        display: "flex",
        alignItems: "center",
        overflow: "visible",
      }}
      color={color}
    >
      <Box
        color={color}
        sx={{
          position: "absolute",
          left: -6,
          padding: 2,
          minWidth: "auto",
          width: 10,
          height: 10,
          borderRadius: "calc(50% + 4px)",
          backdropFilter: "blur(3px)",
          backgroundColor: alpha(theme.palette[color][theme.palette.mode], 0.3),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon fontSize="small">{icon}</Icon>
      </Box>

      <Typography
        variant="body1"
        sx={{ fontWeight: "bold" }}
      >
        {text}
      </Typography>
    </GlassCard>
  );
};
