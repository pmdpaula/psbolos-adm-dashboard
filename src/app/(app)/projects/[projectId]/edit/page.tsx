"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { use, useEffect, useState } from "react";

import type { ProjectDto } from "@/data/dto/project-dto";

import { FormProject } from "../../FormProject";
import { getProjectByIdAction } from "../actions";

// TODO: Adicionar o header padrão dos projetos
// TODO: Remover o botão de gerar contrato

interface EditProjectPageProps {
  params: Promise<{ projectId: string }>;
}

const EditProjectPage = ({ params }: EditProjectPageProps) => {
  const { projectId } = use(params);
  const theme = useTheme();
  const isBreakpointSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [project, setProject] = useState<ProjectDto | null>(null);

  useEffect(() => {
    const loadProjectData = async () => {
      const projectData = await getProjectByIdAction(projectId);
      setProject(projectData);
    };

    loadProjectData();
  }, []);

  return (
    <>
      <Box mb={4}>
        <Typography
          variant="h4"
          gutterBottom
        >
          Projeto: <strong>{project?.name}</strong>
        </Typography>

        <Typography
          variant="body1"
          gutterBottom
        >
          {project?.description}
        </Typography>

        <Typography
          variant="body1"
          gutterBottom
        >
          Este evento está com data marcada para{" "}
          {project?.eventDate.split("T")[0]}
        </Typography>

        <Stack
          direction={isBreakpointSm ? "column" : "row"}
          spacing={3}
          mt={2}
        >
          <Button
            startIcon={<PersonAddTwoToneIcon />}
            variant="outlined"
            sx={{ mt: 2 }}
            href={`/projects/${projectId}/connect`}
          >
            Conectar colaboradores
          </Button>

          <Button
            startIcon={<PictureAsPdfIcon />}
            // variant="outlined"
            sx={{ mt: 2 }}
            href={`/projects/${projectId}/contract`}
          >
            Gerar contrato
          </Button>
        </Stack>
      </Box>

      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          // sx={{ backgroundColor: "primary.dark", borderRadius: 1 }}
          sx={{
            background: theme.palette.gradient1.main,
            borderRadius: 1,
          }}
        >
          <Typography
            component="span"
            variant="body2"
            color="textSecondary"
          >
            Abra o formulário aqui para editar os dados do projeto
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ paddingTop: 2 }}>
          {project && (
            <FormProject
              action="edit"
              projectData={project}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default EditProjectPage;
