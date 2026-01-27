import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Icon,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { SimpleDataText } from "@/components/text/DataTextPresenter";
import type { ProjectFullDataDto } from "@/data/dto/project-dto";

interface ProjectSummaryProps {
  projectFullData: ProjectFullDataDto;
}

export const ProjectSummary = ({ projectFullData }: ProjectSummaryProps) => {
  const [open, setOpen] = useState(false);

  function handleToggle() {
    setOpen(!open);
  }

  function costsOfProject(): {
    cakesCost: number;
    shippingCost: number;
    totalCost: number;
  } {
    if (!projectFullData) {
      return { cakesCost: 0, shippingCost: 0, totalCost: 0 };
    }

    const cakesCost = projectFullData.cakes.reduce(
      (total, cake) => total + cake.price,
      0,
    );
    const totalCost = cakesCost + projectFullData.shippingCost;

    return { cakesCost, shippingCost: projectFullData.shippingCost, totalCost };
  }

  function getContractors(): { collaborators: string[]; type: string } {
    if (
      !projectFullData.customersInProject ||
      projectFullData.customersInProject.length === 0
    ) {
      return { collaborators: [], type: "" };
    }

    const contractorNames = projectFullData.customersInProject
      .filter((customer) => customer.collaboratorType.code === "CONTRACTOR")
      .map((customer) => customer.customer.name);

    if (contractorNames.length === 0) {
      return { collaborators: [], type: "" };
    }

    const typeName = projectFullData.customersInProject.find(
      (customer) => customer.collaboratorType.code === "CONTRACTOR",
    )!.collaboratorType.name;

    return { collaborators: contractorNames, type: typeName };
  }

  function getPlanners(): { collaborators: string[]; type: string } {
    if (
      !projectFullData.customersInProject ||
      projectFullData.customersInProject.length === 0
    ) {
      return { collaborators: [], type: "" };
    }

    const plannerNames = projectFullData.customersInProject
      .filter((customer) => customer.collaboratorType.code === "PLANNER")
      .map((customer) => customer.customer.name);

    if (plannerNames.length === 0) {
      return { collaborators: [], type: "" };
    }

    const typeName = projectFullData.customersInProject.find(
      (customer) => customer.collaboratorType.code === "PLANNER",
    )!.collaboratorType.name;

    return { collaborators: plannerNames, type: typeName };
  }

  return (
    <>
      <Button
        variant="text"
        color="primary"
        endIcon={<Icon>ballot</Icon>}
        onClick={handleToggle}
      >
        Resumo
      </Button>

      <Dialog
        open={open}
        onClose={handleToggle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          backdropFilter: "blur(2px)",
        }}
      >
        <Box
          sx={{
            background: (theme) => theme.palette.tertiary.dark,
          }}
        >
          <DialogTitle id="alert-dialog-title">
            {"Resumo do Projeto"}
            <IconButton
              aria-label="close"
              onClick={handleToggle}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {/* Dados base do projeto */}
            <SimpleDataText
              description="Descrição: "
              value={projectFullData.description || "Sem descrição."}
            />

            <SimpleDataText
              description="Data do evento: "
              value={new Date(projectFullData.eventDate).toLocaleDateString(
                "pt-BR",
              )}
            />

            <SimpleDataText
              description="Status: "
              value={projectFullData.status.name}
            />

            <SimpleDataText
              description="Modo de entrega: "
              value={projectFullData.deliveryMode.name}
            />

            <SimpleDataText
              description="Local: "
              value={projectFullData.localName || "Não informado"}
            />

            {/* colaboradores */}
            <Divider />
            <Typography color="primary">Colaboradores</Typography>
            {getContractors().collaborators.length > 0 ? (
              <SimpleDataText
                description={`${getContractors().type}: `}
                value={getContractors().collaborators.join(", ")}
              />
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
              >
                Sem cliente no projeto.
              </Typography>
            )}

            {getPlanners().collaborators.length > 0 ? (
              <SimpleDataText
                description={`${getPlanners().type}: `}
                value={getPlanners().collaborators.join(", ")}
              />
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
              >
                Sem cerimonialista no projeto.
              </Typography>
            )}

            {/* Valores */}
            <Divider />
            <Typography color="primary">Valores</Typography>
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              spacing={2}
              mb={2}
            >
              <SimpleDataText
                description="Bolos: "
                value={costsOfProject().cakesCost.toLocaleString("pt-BR", {
                  currency: "BRL",
                  currencyDisplay: "symbol",
                  style: "currency",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              />

              <SimpleDataText
                description="Frete: "
                value={costsOfProject().shippingCost.toLocaleString("pt-BR", {
                  currency: "BRL",
                  currencyDisplay: "symbol",
                  style: "currency",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              />

              <SimpleDataText
                description="Total: "
                value={costsOfProject().totalCost.toLocaleString("pt-BR", {
                  currency: "BRL",
                  currencyDisplay: "symbol",
                  style: "currency",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              />
            </Stack>

            {/* <DialogContentText id="alert-dialog-description">
              Resumo do projeto exibido acima.
            </DialogContentText> */}
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};
