"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

import { useMainContext } from "@/app/MainContext";
import GlassCard from "@/components/glass/GlassCard";
import { MainContextSnackbar } from "@/components/MainContextSnackbar";
import type { ProjectFullDataDto } from "@/data/dto/project-dto";

import { getProjectFullDataByIdAction } from "../../action";
import { ProjectDetails } from "../../components/ProjectDetails";
import { ProjectHeader } from "../../components/ProjectHeader";
import { DeleteProjectConfimation } from "./DeleteProjectConfimation";

interface DeleteProjectPageProps {
  params: Promise<{ projectId: string }>;
}

const DeleteProjectPage = ({ params }: DeleteProjectPageProps) => {
  const { projectId } = use(params);
  const router = useRouter();

  const { setOpenAlertSnackBar } = useMainContext();
  const theme = useTheme();
  // const isBreakpointSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [projectFullData, setProjectFullData] =
    useState<ProjectFullDataDto | null>(null);

  async function loadProjectData() {
    try {
      const project = await getProjectFullDataByIdAction(projectId);

      if (!project) {
        setOpenAlertSnackBar({
          isOpen: true,
          success: false,
          message: "Projeto não encontrado.",
          errorCode: 404,
        });

        router.push("/projects");
        return;
      }

      setProjectFullData(project);
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
      setOpenAlertSnackBar({
        isOpen: true,
        success: false,
        message: "Erro ao carregar dados do projeto.",
        errorCode: 500,
      });
      router.push("/projects");
    }
  }

  useEffect(() => {
    setOpenAlertSnackBar({
      isOpen: false,
      success: true,
      message: "",
      errorCode: null,
    });

    loadProjectData();
  }, []);

  return (
    <>
      {projectFullData && (
        <>
          <ProjectHeader
            projectId={projectFullData.id}
            name={projectFullData.name}
            description={projectFullData.description}
          />

          <Accordion sx={{ mb: 2 }}>
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
                Clique para mais detalhes.
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ paddingTop: 2 }}>
              {projectFullData && (
                <ProjectDetails projectFullData={projectFullData} />
              )}
            </AccordionDetails>
          </Accordion>

          <GlassCard color="warning">
            <DeleteProjectConfimation projectData={projectFullData} />
          </GlassCard>
        </>
      )}

      <MainContextSnackbar />
      {/* <Snackbar
        open={openAlertSnackBar.isOpen}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={openAlertSnackBar.success ? "success" : "error"}
          sx={{ textAlign: "right" }}
        >
          {openAlertSnackBar.message}
        </Alert>
      </Snackbar> */}
    </>
  );
};

export default DeleteProjectPage;
