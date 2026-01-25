"use client";

import { Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { z } from "zod";

import { OptionsMenu } from "@/components/OptionsMenu";

import AccountMenu from "./AccountMenu";
import { MainLogo } from "./MainLogo";

export const headerSchema = z.object({
  variant: z.enum(["common", "contract"]).nullable().optional(),
  title: z.string().min(1).max(20).nullable().optional(),
});

type HeaderProps = z.infer<typeof headerSchema>;

// interface HeaderProps {
//   variant?: "common" | "contract";
//   title: string;
// }

export const Header = ({ variant = "common", title = "" }: HeaderProps) => {
  const theme = useTheme();
  const isBreakpointSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isBreakpointMd = useMediaQuery(theme.breakpoints.up("md"));
  const isBreakpointLg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <header>
      <Box
        width="100%"
        mb={isBreakpointLg ? 13 : isBreakpointMd ? 12 : isBreakpointSm ? 10 : 8}
      >
        <AppBar
          position="fixed"
          sx={{
            padding: isBreakpointSm ? 2 : 1,
            backdropFilter: "blur(10px)",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <MainLogo title="Patricia Siqueira" />

            <Typography
              variant={isBreakpointLg ? "h3" : "h5"}
              color="pink"
            >
              {title}
            </Typography>

            {variant === "contract" && <OptionsMenu />}

            <AccountMenu />
          </Stack>
        </AppBar>
      </Box>
    </header>
  );
};
