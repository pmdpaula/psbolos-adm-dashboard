"use client";

import BadgeIcon from "@mui/icons-material/Badge";
import SyncIcon from "@mui/icons-material/Sync";
import {
  Badge,
  Box,
  Button,
  Chip,
  darken,
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
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useEffect, useState } from "react";

import { useMainContext } from "@/app/MainContext";
import { GradientPaper } from "@/components/GradientPaper";
import { StyledSwitch } from "@/components/StyledSwitch";
import type { PaymentDto } from "@/data/dto/payment-dto";
import theme from "@/theme/theme";

import { getProjectFullDataByIdAction } from "../../action";
import { useProjectContext } from "../../ProjectContext";
import { fetchPaymentsByProjectIdAction, removePaymentAction } from "./actions";

interface PaymentsInProjectListProps {
  projectId: string;
  formMode: "add" | "edit";
  setFormMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setPaymentToEdit: React.Dispatch<React.SetStateAction<PaymentDto | null>>;
}

export const PaymentsInProjectList = ({
  projectId,
  setFormMode,
  setPaymentToEdit,
}: PaymentsInProjectListProps) => {
  const isBreakpointMinusMd = useMediaQuery(theme.breakpoints.down("sm"));
  const { setOpenAlertSnackBar } = useMainContext();
  const { setRefreshKey } = useProjectContext();

  const [payments, setPayments] = useState<PaymentDto[]>([]);

  const [paymentsToDisconnect, setPaymentsToDisconnect] = useState<string[]>(
    [],
  );

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [projectBudget, setProjectBudget] = useState(0);

  useEffect(() => {
    setIsButtonDisabled(paymentsToDisconnect.length === 0);
  }, [paymentsToDisconnect]);

  async function handleSubmitRemove(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const results: (
      | { success: boolean; message: any; errors: number } // eslint-disable-line @typescript-eslint/no-explicit-any
      | { success: boolean; message: string; errors: null }
    )[] = [];

    for (const paymentId of paymentsToDisconnect) {
      const result = await removePaymentAction(projectId, paymentId);
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
      message: "Pagamentos removidos com sucesso!",
      errorCode: null,
    });

    setPaymentsToDisconnect([]);

    // Atualiza a lista de pagamentos exibidos
    const updatedPayments = payments.filter(
      (payment) => !paymentsToDisconnect.includes(payment.id!),
    );

    setPayments(updatedPayments);
    setRefreshKey((prevKey) => prevKey + 1);
  }

  const handleEditPayment = (payment: PaymentDto) => {
    setPaymentToEdit(payment);
    setFormMode("edit");
  };

  async function getProjectBudget(projectId: string): Promise<void> {
    try {
      const projectFullData = await getProjectFullDataByIdAction(projectId);
      const projectBudget = projectFullData.cakes.reduce(
        (total, cake) => total + cake.price,
        0,
      );
      console.log("🚀 ~ getProjectBudget ~ projectBudget:", projectBudget);
      setProjectBudget(projectBudget);
    } catch (error) {
      console.error("Houve erro ao obter o orçamento do projeto:", error);
    }
  }

  async function fetchPaymentsInProject(
    projectId: string,
  ): Promise<PaymentDto[]> {
    try {
      const paymentsInProject = await fetchPaymentsByProjectIdAction(projectId);
      return paymentsInProject;
    } catch (error) {
      console.error("🚀 ~ fetchPaymentsInProject ~ error:", error);
      return [];
    }
  }

  const getTotalPaymentsAmount = () => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  useEffect(() => {
    fetchPaymentsInProject(projectId).then((data) => {
      setPayments(data);
    });

    const fetchProjectBudget = async () => {
      await getProjectBudget(projectId);
    };

    fetchProjectBudget();
  }, [projectId]);

  useEffect(() => {
    setIsButtonDisabled(paymentsToDisconnect.length === 0);
  }, [paymentsToDisconnect]);

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
                badgeContent={payments.length}
                color="primary"
                sx={{ marginRight: 2 }}
              >
                <BadgeIcon color="inherit" />
              </Badge>
              Pagamentos do projeto
            </Typography>

            <Tooltip title="Atualizar lista de pagamentos do projeto">
              <IconButton
                aria-label="atualizar"
                onClick={() =>
                  fetchPaymentsInProject(projectId).then((data) => {
                    setPayments(data);
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
            {payments.map((payment, _index: number) => {
              return (
                <Box
                  component="div"
                  key={payment.id}
                >
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
                        gap: 2,
                      }}
                    >
                      <Tooltip title="Clique para editar o pagamento">
                        <Icon
                          color="warning"
                          fontSize="large"
                          sx={{ marginRight: 1.5, cursor: "pointer" }}
                          onClick={() => handleEditPayment(payment)}
                        >
                          edit_note
                        </Icon>
                      </Tooltip>

                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold" }}
                      >
                        R$ {payment.amount.toFixed(2)}
                      </Typography>

                      <Chip
                        label={format(
                          new Date(payment.paidDate),
                          "dd/MM/yyyy",
                          {
                            locale: ptBR,
                          },
                        )}
                        color="primary"
                        size="small"
                      />

                      {payment.note && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {payment.note}
                        </Typography>
                      )}
                    </Box>

                    <FormControl>
                      <StyledSwitch
                        sx={{ m: 1, margin: 0 }}
                        defaultChecked
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPaymentsToDisconnect(
                              paymentsToDisconnect.filter(
                                (id) => id !== payment.id,
                              ),
                            );
                          } else {
                            setPaymentsToDisconnect([
                              ...paymentsToDisconnect,
                              payment.id!,
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
          }}
        >
          <Stack
            id="budget"
            direction="row"
            spacing={0}
            justifyContent="flex-start"
            sx={{
              color: "text.secondary",
              width: "100%",
              height: "45px",
              padding: 0,
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: 5,
            }}
          >
            <Box
              id="payments"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: (theme) =>
                  `linear-gradient(to right, ${theme.palette.success[theme.palette.mode]}, ${darken(theme.palette.success[theme.palette.mode], 0.2)} 70%, ${darken(theme.palette.success[theme.palette.mode], 1)} 100%)`,
                width:
                  getTotalPaymentsAmount() > projectBudget
                    ? "100%"
                    : `${(getTotalPaymentsAmount() / projectBudget) * 100}%`,
              }}
            >
              {projectBudget - getTotalPaymentsAmount() > 0
                ? getTotalPaymentsAmount().toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : "Quitado"}
            </Box>

            {projectBudget - getTotalPaymentsAmount() > 0 && (
              <Box
                id="budget"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: (theme) =>
                    `linear-gradient(to right, ${darken(theme.palette.error[theme.palette.mode], 1)}, ${darken(theme.palette.error[theme.palette.mode], 0.2)} 30%, ${theme.palette.error[theme.palette.mode]} 100%)`,
                  width:
                    getTotalPaymentsAmount() > projectBudget
                      ? "100%"
                      : `${((projectBudget - getTotalPaymentsAmount()) / projectBudget) * 100}%`,
                }}
              >
                {(projectBudget - getTotalPaymentsAmount()).toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  },
                )}
              </Box>
            )}
          </Stack>
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
