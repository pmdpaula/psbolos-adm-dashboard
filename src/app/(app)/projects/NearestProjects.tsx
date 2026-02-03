import { Divider, Grid, Typography } from "@mui/material";
import Link from "next/link";

import GlassCard from "@/components/glass/GlassCard";
import { PinnedNote } from "@/components/glass/PinnedNote";
import type { ProjectDto } from "@/data/dto/project-dto";

type NearestProjectsProps = {
  projects: ProjectDto[];
};

export const NearestProjects = ({ projects }: NearestProjectsProps) => {
  // const theme = useTheme();
  // const isBreakpointMinusMd = useMediaQuery(theme.breakpoints.down("sm"));

  const orderedProjects = projects.sort((a, b) =>
    a.eventDate.localeCompare(b.eventDate),
  );

  // Calcular o próximo domingo (fim desta semana)
  const getNextSunday = (dateString: string) => {
    const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
    date.setDate(date.getDate() + daysUntilSunday);
    return date;
  };

  const getDateOnly = (dateString: string) => {
    // Extrai apenas a data (YYYY-MM-DD) sem interpretar como UTC
    const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const thisWeekEnd = getNextSunday(new Date().toISOString().split("T")[0]);
  const nextWeekEnd = new Date(thisWeekEnd);
  nextWeekEnd.setDate(thisWeekEnd.getDate() + 7);

  const thisWeekProjects = orderedProjects.filter((project) => {
    const eventDate = getDateOnly(project.eventDate);
    return eventDate >= now && eventDate <= thisWeekEnd;
  });

  const nextWeekProjects = orderedProjects.filter((project) => {
    const eventDate = getDateOnly(project.eventDate);
    return eventDate > thisWeekEnd && eventDate <= nextWeekEnd;
  });

  return (
    <>
      <GlassCard
        sx={{ padding: 1.5, marginBottom: 4 }}
        color="warning"
      >
        {thisWeekProjects.length === 0 ? (
          <Typography
            variant="body1"
            color="textDisabled"
          >
            Sem projetos esta semana
          </Typography>
        ) : (
          <>
            <Typography
              variant="h4"
              fontFamily="Ephesis"
              fontWeight="500"
              gutterBottom
            >
              Esta semana
            </Typography>

            <Grid
              container
              spacing={2}
              justifyContent="flex-start"
              alignItems="center"
              columns={{ sm: 3, md: 12, lg: 16 }}
            >
              {thisWeekProjects.slice(0, 5).map((project) => (
                <Grid
                  key={project.id}
                  size={{ sm: 1, md: 2, lg: 2 }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Link href={`/projects/${project.id}/manage`}>
                    <PinnedNote
                      title={getDateOnly(project.eventDate)
                        .toLocaleDateString()
                        .slice(0, 5)}
                      description={project.name}
                    />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Divider sx={{ marginY: 2 }} />

        {nextWeekProjects.length === 0 ? (
          <Typography
            variant="body1"
            color="textDisabled"
          >
            Sem projetos na próxima semana
          </Typography>
        ) : (
          <>
            <Typography
              variant="h4"
              fontFamily="Ephesis"
              fontWeight="500"
              gutterBottom
            >
              Próxima semana
            </Typography>

            <Grid
              container
              spacing={2}
              justifyContent="flex-start"
              alignItems="center"
              columns={{ sm: 3, md: 12, lg: 16 }}
            >
              {nextWeekProjects.slice(0, 5).map((project) => (
                <Grid
                  key={project.id}
                  size={{ sm: 1, md: 2, lg: 2 }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Link href={`/projects/${project.id}/manage`}>
                    <PinnedNote
                      title={getDateOnly(project.eventDate)
                        .toLocaleDateString()
                        .slice(0, 5)}
                      description={project.name}
                    />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </GlassCard>
    </>
  );
};
