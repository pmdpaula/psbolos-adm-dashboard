import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { Typography } from "@mui/material";

import type { PaletteColorKey } from "@/theme/baseTheme";

import GlassCardHover from "./GlassCardHover";

type PinnedNoteProps = {
  title: string;
  description: string;
  color?: PaletteColorKey;
};

export const PinnedNote = ({
  title,
  description,
  color = "info",
}: PinnedNoteProps) => {
  return (
    <>
      <GlassCardHover
        color={color}
        sx={{
          padding: 1,
          margin: 0,
          width: 80,
          height: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          position: "relative",
          overflow: "visible",
        }}
      >
        <PushPinOutlinedIcon
          color={color}
          sx={{
            position: "absolute",
            top: -8,
            right: -4,
            fontSize: 24,
            transform: "rotate(20deg)",
          }}
        />
        <Typography
          color="textPrimary"
          variant="body2"
        >
          {title}
        </Typography>

        <Typography
          color="textSecondary"
          textAlign="center"
          sx={{ fontSize: 11, marginTop: 0.5 }}
        >
          {description}
        </Typography>
      </GlassCardHover>
    </>
  );
};
