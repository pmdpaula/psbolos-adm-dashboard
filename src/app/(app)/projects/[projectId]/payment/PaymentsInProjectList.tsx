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

import { GradientPaper } from "@/components/GradientPaper";
import { StyledSwitch } from "@/components/StyledSwitch";
import type { PaymentDto } from "@/data/dto/payment-dto";
import theme from "@/theme/theme";

import { useProjectContext } from "../../ProjectContext";
import { fetchPaymentsByProjectIdAction, removePaymentAction } from "./actions";

interface PaymentsInProjectListProps {
  projectId: string;
}

export const PaymentsInProjectList = ({
  projectId,
}: PaymentsInProjectListProps) => {
  const isBreakpointMinusMd = useMediaQuery(theme.breakpoints.down("sm"));
  const { setOpenAlertSnackBar, setRefreshKey } = useProjectContext();

  const [payments, setPayments] = useState<PaymentDto[]>([]);

  const [paymentsToDisconnect, setPaymentsToDisconnect] = useState<string[]>(
    [],
  );

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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

  // function handleCloseAlert(
  //   event?: React.SyntheticEvent | Event,
  //   reason?: SnackbarCloseReason,
  // ) {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpenAlertSnackBar({
  //     isOpen: false,
  //     success: true,
  //     message: "",
  //     errorCode: null,
  //   });
  // }

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
                              payment.id,
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

        {payments.length > 0 && (
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
              R$ {getTotalPaymentsAmount().toFixed(2)}
            </Typography>
          </Box>
        )}
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
