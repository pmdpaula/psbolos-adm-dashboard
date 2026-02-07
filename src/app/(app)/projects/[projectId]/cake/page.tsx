"use client";

import { Alert, Box, Snackbar, type SnackbarCloseReason } from "@mui/material";
import { use, useEffect, useState } from "react";

import { useMainContext } from "@/app/MainContext";
import type { CakeDto } from "@/data/dto/cake-dto";
import type { ProjectDto } from "@/data/dto/project-dto";
import { getProjectById } from "@/http/project/get-project-by-id";

import { ProjectHeader } from "../../components/ProjectHeader";
import { useProjectContext } from "../../ProjectContext";
import { CakesInProjectList } from "./CakesInProjectList";
import { FormAddCakeToProject } from "./FormAddCakeToProject";
import { FormEditCakeToProject } from "./FormEditCakeToProject";

interface CakeInProjectPageProps {
  params: Promise<{ projectId: string }>;
}

const CakeInProjectPage = ({ params }: CakeInProjectPageProps) => {
  const { projectId } = use(params);
  const [isReadingData, setIsReadingData] = useState(true);
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [cakeToEdit, setCakeToEdit] = useState<CakeDto | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  const { refreshKey } = useProjectContext();
  const { openAlertSnackBar, setOpenAlertSnackBar } = useMainContext();

  useEffect(() => {
    const checkAvaibilityOfAProject = async () => {
      const project = await getProjectById({ id: projectId });

      if (!project) {
        return <div>Projeto não encontrado.</div>;
      }

      setProject(project);
    };

    checkAvaibilityOfAProject();

    setIsReadingData(false);
  }, []);

  function handleCloseAlert(
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlertSnackBar({
      isOpen: false,
      success: true,
      message: "",
      errorCode: null,
    });

    // setProgressStep(0);
  }

  return isReadingData ? (
    <div>Loading...</div>
  ) : (
    <>
      {project && (
        <>
          <ProjectHeader
            projectId={project.id}
            name={project?.name}
            description={project?.description}
          />

          <CakesInProjectList
            projectId={projectId}
            key={refreshKey}
            formMode={formMode}
            setFormMode={setFormMode}
            setCakeToEdit={setCakeToEdit}
          />

          {formMode === "edit" && cakeToEdit ? (
            <FormEditCakeToProject
              cake={cakeToEdit}
              setFormMode={setFormMode}
              setCakeToEdit={setCakeToEdit}
            />
          ) : (
            <FormAddCakeToProject projectId={project.id} />
          )}

          <Snackbar
            open={openAlertSnackBar.isOpen}
            autoHideDuration={5000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Box>
              <Alert
                onClose={handleCloseAlert}
                severity={openAlertSnackBar.success ? "success" : "error"}
                sx={{ textAlign: "right" }}
              >
                {openAlertSnackBar.message}
              </Alert>

              {/* <LinearProgress
            variant="determinate"
            color={openAlertSnackBar.success ? "success" : "error"}
            value={progressStep}
          /> */}
            </Box>
          </Snackbar>
        </>
      )}
    </>
  );
};

export default CakeInProjectPage;
