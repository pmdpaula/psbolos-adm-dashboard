"use client";

import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useMainContext } from "@/app/MainContext";
import type { ProjectFullDataDto } from "@/data/dto/project-dto";
import { transformProjectFullDataDtoToProjectDto } from "@/data/dto/project-dto";

import { deleteProjectAction, editProjectAction } from "../../action";

// const snackbarDuration = 6000;

interface DeleteProjectConfimationProps {
  projectData: ProjectFullDataDto;
}

type DeleteConfirmationType = "no" | "yes" | "cancel" | null;

export const DeleteProjectConfimation = ({
  projectData,
}: DeleteProjectConfimationProps) => {
  const { setOpenAlertSnackBar } = useMainContext();
  const router = useRouter();
  const dialogColor = "error";

  const [isReadingData, setIsReadingData] = useState(true);

  useEffect(() => {
    isReadingData && setIsReadingData(false);
  }, [isReadingData]);

  const handleDialogSelection = async (
    deleteConfirmation: DeleteConfirmationType,
  ) => {
    if (deleteConfirmation === "yes") {
      const deleteResponse = await deleteProjectAction(projectData.id);

      setOpenAlertSnackBar({
        isOpen: true,
        success: deleteResponse.success,
        message: deleteResponse.message,
        errorCode: deleteResponse.errors,
      });

      if (deleteResponse.success) {
        // router.prefetch("/projects");
        router.push("/projects");
      }
    } else if (deleteConfirmation === "cancel") {
      const project = transformProjectFullDataDtoToProjectDto(projectData);

      const cancelledProject = {
        ...project,
        statusCode: "CANCELLED",
      };

      const response = await editProjectAction(cancelledProject);

      setOpenAlertSnackBar({
        isOpen: true,
        success: response.success,
        message: response.message,
        errorCode: response.errors,
      });

      router.push(`/projects/${projectData.id}/manage`);
    } else {
      setOpenAlertSnackBar({
        isOpen: true,
        success: true,
        message: "Ação de exclusão cancelada.",
        errorCode: null,
      });

      router.back();
    }
  };

  return (
    <>
      <Backdrop
        sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
        open={isReadingData}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {!isReadingData && (
        <>
          <Box>
            <Typography
              variant="h6"
              gutterBottom
            >
              Confirmação de Exclusão
            </Typography>

            <Typography>
              Tem certeza que deseja excluir o projeto{" "}
              <strong>{projectData.name}</strong>?
            </Typography>

            <Box
              color="secondary"
              display="flex"
              flexDirection="column"
              mt={2}
            >
              <Typography variant="caption">
                <Typography
                  component="span"
                  fontWeight="bold"
                  variant="body2"
                >
                  Desistir:{" "}
                </Typography>
                fecha esta janela sem fazer nenhuma ação
              </Typography>

              <Typography variant="caption">
                <Typography
                  component="span"
                  fontWeight="bold"
                  variant="body2"
                >
                  Confirmar:{" "}
                </Typography>
                exclui o projeto permanentemente
              </Typography>

              <Typography variant="caption">
                <Typography
                  component="span"
                  fontWeight="bold"
                  variant="body2"
                >
                  Cancelar:{" "}
                </Typography>
                muda o estado do projeto para cancelado
              </Typography>
            </Box>
          </Box>

          <form
            style={{
              width: "100%",
              maxWidth: 800,
            }}
          >
            <Stack
              spacing={2}
              sx={{ marginTop: 3 }}
              direction="row"
              justifyContent="space-around"
            >
              <Button
                color={dialogColor}
                onClick={() => handleDialogSelection("no")}
                autoFocus
              >
                Desistir
              </Button>

              <Button
                variant="contained"
                color={dialogColor}
                onClick={() => handleDialogSelection("yes")}
              >
                Confirmar
              </Button>

              <Button
                variant="outlined"
                color="warning"
                onClick={() => handleDialogSelection("cancel")}
              >
                Cancelar
              </Button>
            </Stack>
          </form>
        </>
      )}
    </>
  );
};
