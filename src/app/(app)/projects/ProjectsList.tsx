import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Chip,
  Divider,
  Grid,
  Icon,
  ListItem,
  Typography,
  useTheme,
} from "@mui/material";

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
  // const router = useRouter();

  const projectsByStatus: ProjectsByStatus = {
    working: projects.filter((project) =>
      projectStatusDefinition[0].options.includes(
        project.statusCode as ProjectTypes,
      ),
    ),

    planning: projects.filter((project) =>
      projectStatusDefinition[1].options.includes(
        project.statusCode as ProjectTypes,
      ),
    ),

    completed: projects.filter((project) =>
      projectStatusDefinition[2].options.includes(
        project.statusCode as ProjectTypes,
      ),
    ),

    cancelled: projects.filter((project) =>
      projectStatusDefinition[3].options.includes(
        project.statusCode as ProjectTypes,
      ),
    ),
  };

  return (
    <GlassCard>
      <Typography
        variant="h5"
        fontWeight="bold"
      >
        Lista de Projetos
      </Typography>

      <Divider sx={{ my: 1 }} />

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
                <GlassCard
                  sx={{
                    paddingY: 0.5,
                    paddingLeft: 5,
                    paddingRight: 1.5,
                    display: "flex",
                    alignItems: "center",
                    overflow: "visible",
                  }}
                  color={defineDetailsForProjectStatus(statusKey).color}
                >
                  <Box
                    color={defineDetailsForProjectStatus(statusKey).color}
                    sx={{
                      position: "absolute",
                      left: -6,
                      padding: 2,
                      minWidth: "auto",
                      width: 10,
                      height: 10,
                      borderRadius: "calc(50% + 4px)",
                      backdropFilter: "blur(3px)",
                      backgroundColor: alpha(
                        theme.palette[
                          defineDetailsForProjectStatus(statusKey).color
                        ].main,
                        0.3,
                      ),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon fontSize="small">
                      {defineDetailsForProjectStatus(statusKey).icon}
                    </Icon>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}
                  >
                    {
                      projectStatusDefinition.find(
                        (def) => def.code.toLowerCase() === statusKey,
                      )?.name
                    }
                  </Typography>
                </GlassCard>

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
                  // onClick={() => {
                  //   router.push(`/projects/${project.id}/manage`);
                  // }}
                  key={project.id}
                  sx={{ paddingY: 1 }}
                  divider
                >
                  <Grid
                    container
                    // justifyContent="flex-start"
                    // alignItems=""
                    spacing={1}
                  >
                    <Grid
                      size={6}
                      component={Box}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon
                        sx={{ marginRight: 2, color: "info.main" }}
                        fontSize="small"
                      >
                        folder_open
                      </Icon>

                      <Typography
                        variant="body1"
                        color="info"
                        sx={{ fontWeight: "bold", marginRight: 2 }}
                      >
                        {project.name}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography
                    variant="body2"
                    // sx={{ fontWeight: "bold", marginRight: 2 }}
                  >
                    {project.description}
                  </Typography>

                  {/* <Divider /> */}
                </ListItem>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}
    </GlassCard>
  );
};
