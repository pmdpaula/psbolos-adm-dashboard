"use client";

import BadgeIcon from "@mui/icons-material/Badge";
import SyncIcon from "@mui/icons-material/Sync";
import {
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Icon,
  IconButton,
  List,
  ListItem,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useMainContext } from "@/app/MainContext";
import { GradientPaper } from "@/components/GradientPaper";
import { StyledSwitch } from "@/components/StyledSwitch";
import type { CakeDto } from "@/data/dto/cake-dto";

import { useProjectContext } from "../../ProjectContext";
import { fetchCakesByProjectIdAction, removeCakeAction } from "./actions";

// TODO: Criar a opções de editar o bolo

interface CakesInProjectListProps {
  projectId: string;
  formMode: "add" | "edit";
  setFormMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setCakeToEdit: React.Dispatch<React.SetStateAction<CakeDto | null>>;
}

export const CakesInProjectList = ({
  projectId,
  // formMode,
  setFormMode,
  setCakeToEdit,
}: CakesInProjectListProps) => {
  const { setRefreshKey } = useProjectContext();
  const { setOpenAlertSnackBar } = useMainContext();
  const theme = useTheme();
  const isBreakpointMinusMd = useMediaQuery(theme.breakpoints.up("sm"));

  const [cakes, setCakes] = useState<CakeDto[]>([]);
  const [isReadingData, setIsReadingData] = useState(true);

  const [cakesToDisconnect, setCakesToDisconnect] = useState<string[]>([]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  async function handleSubmitRemove(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const results: (
      | { success: boolean; message: any; errors: number } // eslint-disable-line @typescript-eslint/no-explicit-any
      | { success: boolean; message: string; errors: null }
    )[] = [];

    for (const cakeId of cakesToDisconnect) {
      const result = await removeCakeAction(projectId, cakeId);
      results.push(result);
    }

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
      message: "Bolos removidos com sucesso!",
      errorCode: null,
    });

    setCakesToDisconnect([]);

    // Atualiza a lista de colaborações exibidas
    const updatedCakes = cakes.filter(
      (cake) => !cakesToDisconnect.includes(cake.id!),
    );

    setCakes(updatedCakes);
    setRefreshKey((prevKey) => prevKey + 1);
  }

  const handleEditCake = (cake: CakeDto) => {
    setCakeToEdit(cake);
    setFormMode("edit");
  };

  async function fetchCakesInProject(projectId: string): Promise<CakeDto[]> {
    setIsReadingData(true);

    try {
      const cakeInProject = await fetchCakesByProjectIdAction(projectId);

      return cakeInProject;
    } catch (error) {
      console.error("🚀 ~ fetchCakesInProject ~ error:", error);
      return [];
    } finally {
      setIsReadingData(false);
    }
  }

  function getTotalCostOfCakes(): number {
    return cakes.reduce((total, cake) => total + cake.price, 0);
  }

  useEffect(() => {
    fetchCakesInProject(projectId).then((data) => {
      setCakes(data);
    });
  }, [projectId]);

  useEffect(() => {
    setIsButtonDisabled(cakesToDisconnect.length === 0 || isReadingData);
  }, [cakesToDisconnect, isReadingData]);

  return (
    <>
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
                badgeContent={cakes.length}
                color="primary"
                sx={{ marginRight: 2 }}
              >
                <BadgeIcon color="inherit" />
              </Badge>
              Bolos no projeto
            </Typography>

            <Tooltip title="Atualizar lista de bolos no projeto">
              <IconButton
                aria-label="atualizar"
                onClick={() =>
                  fetchCakesInProject(projectId).then((data) => {
                    setCakes(data);
                  })
                }
              >
                <SyncIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        }
        sx={{ marginBottom: 3 }}
      >
        <List>
          <form onSubmit={handleSubmitRemove}>
            {cakes.map((cake, _index: number) => {
              return (
                <Box
                  component="div"
                  key={cake.id}
                >
                  <ListItem
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      // width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Tooltip title="Clique para editar o bolo">
                        <Icon
                          color="warning"
                          fontSize="large"
                          sx={{ marginRight: 1.5, cursor: "pointer" }}
                          onClick={() => handleEditCake(cake)}
                        >
                          edit_note
                        </Icon>
                      </Tooltip>

                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ marginRight: 2 }}
                      >
                        {cake.description}
                      </Typography>

                      <Chip
                        label={
                          cake.slices && cake.slices > 1
                            ? `${cake.slices} fatias`
                            : "sem fatia"
                        }
                        color="secondary"
                        size="small"
                        sx={{ margin: 0, fontSize: 10, fontWeight: "bold" }}
                      />

                      <Typography
                        sx={{ marginLeft: 2 }}
                        variant="body2"
                        color="textSecondary"
                      >{`R$ ${cake.price.toFixed(2)}`}</Typography>
                    </Box>

                    <FormControl>
                      <StyledSwitch
                        sx={{ m: 1, margin: 0 }}
                        defaultChecked
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCakesToDisconnect(
                              cakesToDisconnect.filter((id) => id !== cake.id),
                            );
                          } else {
                            setCakesToDisconnect([
                              ...cakesToDisconnect,
                              cake.id!,
                            ]);
                          }
                        }}
                      />
                    </FormControl>
                  </ListItem>

                  <Divider variant="inset" />
                </Box>
              );
            })}

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

        <Box
          sx={{
            mt: 2,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            color="primary"
          >
            Total:
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: "bold" }}
          >
            R$ {getTotalCostOfCakes().toFixed(2)}
          </Typography>
        </Box>
      </GradientPaper>

      {/* <Snackbar
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
      </Snackbar> */}
    </>
  );
};
