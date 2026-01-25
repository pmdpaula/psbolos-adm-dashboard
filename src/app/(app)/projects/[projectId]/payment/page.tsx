"use client";

import { Alert, Box, Snackbar, type SnackbarCloseReason } from "@mui/material";
import { use, useEffect, useState } from "react";

import type { ProjectDto } from "@/data/dto/project-dto";
import { getProjectById } from "@/http/project/get-project-by-id";

import { ProjectHeader } from "../../components/ProjectHeader";
import { useProjectContext } from "../../ProjectContext";
import { FormAddPaymentToProject } from "./FormAddPaymentToProject";
import { PaymentsInProjectList } from "./PaymentsInProjectList";

interface PaymentInProjectPageProps {
  params: Promise<{ projectId: string }>;
}

const PaymentInProjectPage = ({ params }: PaymentInProjectPageProps) => {
  const { projectId } = use(params);
  const [isReadingData, setIsReadingData] = useState(true);
  const [project, setProject] = useState<ProjectDto | null>(null);

  const { openAlertSnackBar, setOpenAlertSnackBar, refreshKey } =
    useProjectContext();

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

          <PaymentsInProjectList
            projectId={projectId}
            key={refreshKey}
          />

          <FormAddPaymentToProject projectId={project.id} />

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
            </Box>
          </Snackbar>
        </>
      )}
    </>
  );
};

export default PaymentInProjectPage;
