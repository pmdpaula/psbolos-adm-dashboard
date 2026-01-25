"use client";

import { Stack, Typography, useTheme } from "@mui/material";
import Link from "next/link";

import GlassCardHover from "@/components/glass/GlassCardHover";

const HomePage = () => {
  const theme = useTheme();

  return (
    <Stack spacing={2}>
      <Link href="/form-contract">
        <GlassCardHover
          color={theme.palette.primary.main}
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            color="pink"
            sx={{ fontWeight: "bold" }}
          >
            Formulário de contrato
          </Typography>
        </GlassCardHover>
      </Link>

      <Link href="/customer">
        <GlassCardHover
          color={theme.palette.primary.main}
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            color="pink"
            sx={{ fontWeight: "bold" }}
          >
            Clientes
          </Typography>
        </GlassCardHover>
      </Link>

      <Link href="/projects">
        <GlassCardHover
          color={theme.palette.primary.main}
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            color="pink"
            sx={{ fontWeight: "bold" }}
          >
            Projetos
          </Typography>
        </GlassCardHover>
      </Link>
    </Stack>
  );
};

export default HomePage;
