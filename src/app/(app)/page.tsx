import { Stack, Typography } from "@mui/material";
import Link from "next/link";

import GlassCardHover from "@/components/glass/GlassCardHover";

const HomePage = () => {
  return (
    <Stack spacing={2}>
      <Link href="/form-contract">
        <GlassCardHover
          color="primary"
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

      <Link href="/collaborators">
        <GlassCardHover
          color="primary"
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            color="pink"
            sx={{ fontWeight: "bold" }}
          >
            Colaboradores
          </Typography>
        </GlassCardHover>
      </Link>

      <Link href="/projects">
        <GlassCardHover
          color="primary"
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
