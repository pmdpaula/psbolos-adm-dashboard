"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import { z } from "zod";

import { OptionsMenu } from "@/components/OptionsMenu";

import AccountMenu from "./AccountMenu";
import { MainLogo } from "./MainLogo";

export const headerSchema = z.object({
  variant: z.enum(["common", "contract"]).nullable().optional(),
});

type HeaderProps = z.infer<typeof headerSchema>;

export const Header = ({ variant = "common" }: HeaderProps) => {
  return (
    <header>
      <Box
        sx={{
          position: "fixed",
          width: "100%",
          top: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          // height: 40,
          // height: isMobile ? 42 : 68,
          backgroundColor: "transparent",
          // marginBottom: 10,
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            paddingX: 2,
            height: 64,
            // backgroundColor: "transparent",
            backdropFilter: "blur(6px)",
            backgroundColor: (theme) =>
              alpha(theme.palette.background.paper, 0.7),
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <MainLogo title="Patricia Siqueira" />

            {variant === "contract" && <OptionsMenu />}

            <AccountMenu />
          </Stack>
        </AppBar>
      </Box>
    </header>
  );
};
