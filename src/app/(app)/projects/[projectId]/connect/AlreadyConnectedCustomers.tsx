"use client";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import BadgeIcon from "@mui/icons-material/Badge";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import SyncIcon from "@mui/icons-material/Sync";
import {
  Alert,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Snackbar,
  type SnackbarCloseReason,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";

import { GradientPaper } from "@/components/GradientPaper";
import { StyledSwitch } from "@/components/StyledSwitch";
import type { CollaborationFull } from "@/data/dto/collaboration-dto";
import theme from "@/theme/theme";

import { useProjectContext } from "../../ProjectContext";
import { disconnectCollaboratorAction } from "./actions";
import { fetchCollaborationsInProject } from "./FormConnectCollaborator";

interface AlreadyConnectedCustomersProps {
  collaborations: CollaborationFull[];
  setCollaborations: React.Dispatch<React.SetStateAction<CollaborationFull[]>>;
  projectId: string;
}

export const AlreadyConnectedCustomers = ({
  collaborations,
  setCollaborations,
  projectId,
}: AlreadyConnectedCustomersProps) => {
  const isBreakpointMinusMd = useMediaQuery(theme.breakpoints.down("sm"));
  const { openAlertSnackBar, setOpenAlertSnackBar, setRefreshKey } =
    useProjectContext();

  const [collaborationsToDisconnect, setCollaborationsToDisconnect] = useState<
    string[]
  >([]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  function setComponentColor(code: string) {
    switch (code) {
      case "PLANNER":
        return "primary";

      case "CONTRACTOR":
        return "warning";

      case "TRANSPORTER":
        return "error";

      case "SUPPLIER":
        return "info";

      default:
        return "secondary";
    }
  }

  function setIconCollaborator(code: string) {
    switch (code) {
      case "PLANNER":
        return <ArchitectureIcon color={setComponentColor(code)} />;

      case "CONTRACTOR":
        return <PersonPinCircleIcon color={setComponentColor(code)} />;

      case "TRANSPORTER":
        return <LocalShippingIcon color={setComponentColor(code)} />;

      case "SUPPLIER":
        return <PrecisionManufacturingIcon color={setComponentColor(code)} />;

      default:
        return <AccountCircleIcon color={setComponentColor(code)} />;
    }
  }

  async function handleSubmitDisconnect(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const results: (
      | { success: boolean; message: any; errors: number } // eslint-disable-line @typescript-eslint/no-explicit-any
      | { success: boolean; message: string; errors: null }
    )[] = [];

    collaborationsToDisconnect.forEach(async (collaborationId) => {
      results.push(await disconnectCollaboratorAction(collaborationId));
    });

    results.forEach((result) => {
      if (result && !result.success) {
        setOpenAlertSnackBar({
          isOpen: true,
          success: false,
          message: result.message,
          errorCode: result.errors,
        });
      }
    });

    setOpenAlertSnackBar({
      isOpen: true,
      success: true,
      message: "Colaboradores desconectados com sucesso!",
      errorCode: null,
    });

    setCollaborationsToDisconnect([]);

    // Atualiza a lista de colaborações exibidas
    const updatedCollaborations = collaborations.filter(
      (collaboration) =>
        !collaborationsToDisconnect.includes(collaboration.collaborationId!),
    );

    setCollaborations(updatedCollaborations);
    setRefreshKey((prevKey) => prevKey + 1);
  }

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

  useEffect(() => {
    setIsButtonDisabled(collaborationsToDisconnect.length === 0);
  }, [collaborationsToDisconnect]);

  return (
    <>
      {/* {collaborations.length > 0 && ( */}
      <GradientPaper
        label={
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Typography variant="h6">
              <Badge
                badgeContent={collaborations.length}
                color="primary"
                sx={{ marginRight: 2 }}
              >
                <BadgeIcon color="inherit" />
              </Badge>
              Colaboradores conectados
            </Typography>

            <Tooltip title="Atualizar lista de colaboradores conectados">
              <IconButton
                aria-label="atualizar"
                onClick={() =>
                  fetchCollaborationsInProject(projectId).then((data) => {
                    setCollaborations(data);
                  })
                }
              >
                <SyncIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        }
        style={{
          minHeight: 100,
        }}
      >
        <List>
          <form onSubmit={handleSubmitDisconnect}>
            {collaborations.map(
              (collaboration: CollaborationFull, _index: number) => {
                const typeColor = setComponentColor(
                  collaboration.collaboratorType.code,
                );

                return (
                  <Box key={collaboration.collaborationId}>
                    <ListItem
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <ListItemIcon sx={{ width: 40 }}>
                          {setIconCollaborator(
                            collaboration.collaboratorType.code,
                          )}
                        </ListItemIcon>

                        <Typography
                          variant="body1"
                          sx={{ marginRight: 2 }}
                        >
                          {collaboration.customer!.name}
                        </Typography>

                        <Chip
                          label={collaboration.collaboratorType.name}
                          color={typeColor}
                          size="small"
                        />
                      </Box>

                      <FormControl>
                        <StyledSwitch
                          sx={{ m: 1, margin: 0 }}
                          defaultChecked
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCollaborationsToDisconnect(
                                collaborationsToDisconnect.filter(
                                  (id) => id !== collaboration.collaborationId,
                                ),
                              );
                            } else {
                              setCollaborationsToDisconnect([
                                ...collaborationsToDisconnect,
                                collaboration.collaborationId!,
                              ]);
                            }
                          }}
                        />
                      </FormControl>
                    </ListItem>

                    <Divider variant="inset" />
                  </Box>
                );
              },
            )}

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={isButtonDisabled}
              size={isBreakpointMinusMd ? "medium" : "large"}
              sx={{ mt: 4, width: "100%" }}
            >
              Salvar alterações
            </Button>
          </form>
        </List>
      </GradientPaper>
      {/* )} */}

      <Snackbar
        open={openAlertSnackBar.isOpen}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {openAlertSnackBar.success ? (
          <Alert
            onClose={handleCloseAlert}
            severity="success"
            sx={{ textAlign: "right" }}
          >
            {openAlertSnackBar.message}
          </Alert>
        ) : (
          <Alert
            onClose={handleCloseAlert}
            severity="error"
            sx={{ textAlign: "right" }}
          >
            {openAlertSnackBar.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};
