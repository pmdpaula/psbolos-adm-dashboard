"use client";

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  type GridRowModesModel,
  type GridRowsProp,
} from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { MainContextSnackbar } from "@/components/MainContextSnackbar";
import type { DeliveryModeDto } from "@/data/dto/data-types/delivery-mode-dto";
import type { EventTypeDto } from "@/data/dto/data-types/event-type-dto";
import type { ProjectStatusDto } from "@/data/dto/data-types/project-status-dto";
import type { ProjectDto } from "@/data/dto/project-dto";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}

interface ProjectDataTableProps {
  projects: ProjectDto[];
  eventTypes: EventTypeDto[];
  deliveryModes: DeliveryModeDto[];
  projectStatuses: ProjectStatusDto[];
  isReadingData: boolean;
}

export const ProjectDataTable = ({
  projects,
  eventTypes,
  deliveryModes,
  projectStatuses,
  isReadingData,
}: ProjectDataTableProps) => {
  const router = useRouter();

  const [rows, setRows] = useState<ProjectDto[]>([]);

  const projectsColumns: GridColDef<ProjectDto>[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 100,
      cellClassName: "actions",
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => {
              router.push(`/projects/${row.id}/manage`);
              // handleCallForm("edit", row);
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {
              router.push(`/projects/${row.id}/delete`);
            }}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: "id",
      headerName: "ID",
      width: 50,
      display: "flex",
      editable: false,
    },
    {
      field: "name",
      headerName: "Nome",
      width: 130,
      editable: false,
      hideable: false,
    },
    {
      field: "description",
      headerName: "Descrição",
      width: 130,
      editable: false,
      hideable: false,
    },
    {
      field: "eventTypeCode",
      headerName: "Tipo de Evento",
      width: 130,
      editable: false,
      hideable: false,
      valueFormatter: (params) => {
        const eventType = eventTypes.find((type) => type.code === params);

        return eventType ? eventType.name : params;
      },
    },
    {
      field: "eventDate",
      headerName: "Data do Evento",
      type: "date",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      valueFormatter: (params: any) => {
        const date = new Date(params);
        return date.toLocaleDateString("pt-BR");
      },
      width: 130,
      editable: false,
      hideable: false,
    },
    {
      field: "localName",
      headerName: "Local do Evento",
      width: 130,
      editable: false,
      hideable: false,
    },
    {
      field: "deliveryModeCode",
      headerName: "Modo de Entrega",
      width: 130,
      editable: false,
      hideable: false,
      valueFormatter: (params) => {
        const deliveryMode = deliveryModes.find((mode) => mode.code === params);

        return deliveryMode ? deliveryMode.name : params;
      },
    },
    {
      field: "address",
      headerName: "Endereço",
      width: 150,
      editable: false,
    },
    {
      field: "city",
      headerName: "Cidade",
      width: 50,
      editable: false,
    },
    {
      field: "state",
      headerName: "Estado",
      width: 30,
      editable: false,
    },
    {
      field: "priceBudget",
      headerName: "Orçamento",
      width: 30,
      editable: false,
      valueFormatter: (params) => {
        return Number(params).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      field: "depositPaid",
      headerName: "Depósito Pago",
      width: 30,
      editable: false,
      valueFormatter: (params) => {
        return Number(params).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      field: "paymentNote",
      headerName: "Nota de Pagamento",
      width: 30,
      editable: false,
    },
    {
      field: "statusCode",
      headerName: "Status",
      width: 30,
      editable: false,
      valueFormatter: (params) => {
        const status = projectStatuses.find((status) => status.code === params);

        return status ? status.name : params;
      },
    },
  ];

  useEffect(() => {
    if (isReadingData === false) {
      setRows(projects);
    }
  }, [isReadingData]);

  return (
    <>
      <DataGrid
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        rows={rows}
        columns={projectsColumns}
        loading={isReadingData}
        density="compact"
        sx={{
          background: (theme) => theme.palette.gradient1[theme.palette.mode],
          "& .MuiDataGrid-columnHeaderRow": {
            bgcolor: "secondary",
          },

          "& .MuiDataGrid-row:hover": {
            bgcolor: "tertiary",
          },
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              localName: false,
              city: false,
              state: false,
            },
          },
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 20, 50, 100]}
        showToolbar
      />

      <MainContextSnackbar />
    </>
  );
};
