import { Badge, Grid, Icon, Stack, Typography } from "@mui/material";
import Link from "next/link";

import GlassCardHover from "@/components/glass/GlassCardHover";
import type { ProjectFullDataDto } from "@/data/dto/project-dto";

const manageOptions = [
  {
    title: "Editar",
    description: "Editar os dados do projeto.",
    url: "/projects/id/edit",
    iconName: "drive_file_rename_outline",
    count: "none",
  },
  {
    title: "Contrato",
    description: "Gerar o contrato em pdf.",
    url: "/projects/id/contract",
    iconName: "receipt_long_outline",
    count: "none",
  },
  {
    title: "Colaboradores",
    description: "Gerenciar as conexões dos colaboradores com o projeto.",
    url: "/projects/id/connect",
    iconName: "person_outline",
    count: "customersInProject",
  },
  {
    title: "Bolos",
    description: "Gerenciar os bolos do projeto e seus detalhes.",
    url: "/projects/id/cake",
    iconName: "cake",
    count: "cakes",
  },
  {
    title: "Pagamentos",
    description: "Gerenciar os pagamentos do projeto e seus detalhes.",
    url: "/projects/id/payment",
    iconName: "payments",
    count: "payments",
  },
];

interface ManageProjectOptionsProps {
  project: ProjectFullDataDto;
}

export const ManageProjectOptions = ({
  project,
}: ManageProjectOptionsProps) => {
  // const { data: ProjectData, isLoading: isLoadingProject } = useQuery({
  //   queryKey: ["projects"],
  //   queryFn: async () => await getProjectById({ id: projectId }),
  // });

  return (
    <>
      <Grid
        container
        justifyContent="center"
        spacing={4}
        mt={2}
      >
        {manageOptions.map((option) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const count: number = (project as any)[option.count]?.length ?? 0;

          return (
            <Link
              href={option.url.replace("id", project.id)}
              key={option.title}
            >
              <GlassCardHover
                key={option.title}
                sx={{
                  width: 220,
                  height: 140,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={5}
                  mb={2}
                  sx={{ width: "80%" }}
                >
                  <Badge
                    badgeContent={count}
                    color="secondary"
                  >
                    <Icon
                      sx={{
                        fontSize: 50,
                      }}
                    >
                      {option.iconName}
                    </Icon>
                  </Badge>

                  <Typography
                    variant="h6"
                    gutterBottom
                    textAlign="center"
                  >
                    {option.title}
                  </Typography>
                </Stack>

                <Typography
                  variant="body2"
                  gutterBottom
                  textAlign="center"
                  color="textSecondary"
                >
                  {option.description}
                </Typography>
              </GlassCardHover>
            </Link>
          );
        })}
      </Grid>
    </>
  );
};
