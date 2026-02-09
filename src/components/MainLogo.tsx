"use client";

import { Stack, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";

import { NeonCircle } from "./NeonCircle";
import { NeonText } from "./NeonText";
import { PSBIconLight } from "./PSBIcon";

interface MainLogoProps {
  title?: string;
  size?: number;
}

export const MainLogo = ({ title, size }: MainLogoProps) => {
  const theme = useTheme();
  const isBreakpointMd = useMediaQuery(theme.breakpoints.up("md"));
  const isBreakpointLg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ flexGrow: 1 }}
    >
      <Link href="/">
        <NeonCircle
          diameter={size || (isBreakpointLg ? 60 : isBreakpointMd ? 40 : 36)}
        >
          <PSBIconLight amplitude={100} />
        </NeonCircle>
      </Link>

      {title && (
        <NeonText
          variant={isBreakpointLg ? "h3" : "h5"}
          fontFamily="Ephesis"
          color="pink"
          fontWeight={500}
        >
          {title}
        </NeonText>
      )}
    </Stack>
  );
};
