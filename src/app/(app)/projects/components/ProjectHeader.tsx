import { Stack, Typography } from "@mui/material";
import Link from "next/link";

import { NeonText } from "@/components/NeonText";

interface ProjectHeaderProps {
  projectId: string;
  name: string;
  description: string | null;
}

export const ProjectHeader = ({
  projectId,
  name,
  description,
}: ProjectHeaderProps) => {
  return (
    <Stack
      textAlign="center"
      direction="column"
      display="flex"
      justifyContent="center"
      mb={2}
    >
      <NeonText
        variant="h3"
        fontFamily="Ephesis"
      >
        <Link href={`/projects/${projectId}/manage`}>{name}</Link>
      </NeonText>

      {description && (
        <Typography
          variant="body2"
          gutterBottom
        >
          {description}
        </Typography>
      )}
    </Stack>
  );
};
