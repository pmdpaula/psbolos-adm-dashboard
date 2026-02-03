import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Chip,
  Grid,
  Icon,
  ListItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";

import { ChipIcon } from "@/components/glass/ChipIcon";
import GlassCard from "@/components/glass/GlassCard";
import {
  defineDetailsForProjectStatus,
  projectStatusDefinition,
  type ProjectStatusDto,
  type ProjectTypes,
} from "@/data/dto/data-types/project-status-dto";
import type { ProjectDto } from "@/data/dto/project-dto";

interface ProjectsListProps {
  projects: ProjectDto[];
  projectStatuses: ProjectStatusDto[];
}

type ProjectsByStatus = {
  [key: string]: ProjectDto[];
};

export const ProjectsList = ({
  projects,
  // projectStatuses,
}: ProjectsListProps) => {
  const theme = useTheme();
  const isBreakpointMinusMd = useMediaQuery(theme.breakpoints.down("sm"));

  const orderedProject = projects.sort((a, b) =>
    a.eventDate.localeCompare(b.eventDate),
  );

  const projectsByStatus: ProjectsByStatus = {
    working: orderedProject.filter((project) =>
      projectStatusDefinition[0].options.includes(
        project.statusCode as ProjectTypes,
      ),
    ),

    planning: orderedProject.filter((project) =>
      projectStatusDefinition[1].options.includes(
        project.statusCode as ProjectTypes,
      ),
    ),

    completed: orderedProject.filter((project) =>
      projectStatusDefinition[2].options.includes(
        project.statusCode as ProjectTypes,
      ),
    ),

    cancelled: orderedProject.filter((project) =>
      projectStatusDefinition[3].options.includes(
        project.statusCode as ProjectTypes,
      ),
    ),
  };

  return (
    <GlassCard sx={{ padding: 2 }}>
      {Object.keys(projectsByStatus).map((statusKey) => (
        <Box
          key={statusKey}
          sx={{ mb: 2 }}
        >
          <Accordion
            elevation={12}
            disabled={projectsByStatus[statusKey].length === 0}
            sx={{
              marginBottom: 1,
              borderRadius: 2,
              background: alpha(theme.palette.background.paper, 0.9),
              overflow: "hidden",
              "&:before": {
                display: "none",
              },
              "&:first-of-type": {
                borderRadius: 2,
              },
              "&:last-of-type": {
                borderRadius: 2,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<Icon>arrow_drop_down</Icon>}
              sx={{
                fontWeight: "bold",
                background: theme.palette.gradient1.main,
              }}
            >
              <ListItem disablePadding>
                <ChipIcon
                  text={
                    projectStatusDefinition.find(
                      (def) => def.code.toLowerCase() === statusKey,
                    )?.name || ""
                  }
                  icon={defineDetailsForProjectStatus(statusKey).icon}
                  color={defineDetailsForProjectStatus(statusKey).color}
                />

                <Chip
                  label={projectsByStatus[statusKey].length}
                  color={
                    projectsByStatus[statusKey].length > 0
                      ? "primary"
                      : "default"
                  }
                  size="small"
                  sx={{ marginLeft: 2 }}
                />
              </ListItem>
            </AccordionSummary>

            <AccordionDetails>
              {projectsByStatus[statusKey].map((project) => (
                <ListItem
                  key={project.id}
                  sx={{
                    paddingY: 1,
                    paddingX: 0,
                    width: "100%",
                  }}
                  divider
                >
                  <Grid
                    container
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                    sx={{ width: "100%" }}
                  >
                    <Link href={`/projects/${project.id}/manage`}>
                      <Typography
                        variant="body1"
                        color="info"
                        sx={{
                          fontWeight: "bold",
                          minWidth: 120,
                        }}
                      >
                        {project.name}
                      </Typography>
                    </Link>

                    {!isBreakpointMinusMd && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                      >
                        {project.description}
                      </Typography>
                    )}

                    <Chip
                      label={new Date(project.eventDate).toLocaleDateString()}
                      color={
                        project.statusCode
                          ? defineDetailsForProjectStatus(project.statusCode)
                              .color
                          : "default"
                      }
                      size="small"
                    />
                  </Grid>
                </ListItem>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}
    </GlassCard>
  );
};
