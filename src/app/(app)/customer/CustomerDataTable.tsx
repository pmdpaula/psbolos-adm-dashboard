import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";
import { Box, Button, Stack, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  type GridRowModel,
  type GridRowModesModel,
  type GridRowsProp,
} from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { useEffect, useState } from "react";

import type { CustomerDto } from "@/data/dto/customer-dto";
import { getCustomers } from "@/http/customer/get-customers";

import { FullScreenDialog } from "../../../components/FullScreenDialog";
import { useCustomerContext } from "./CustomerContext";
import { FormCreateCustomer } from "./FormCreateCustomer";
import { FormCustomer } from "./FormCustomer";
import type { ActionFormProps } from "./page";

function cpfCnpjFormatter(value: string) {
  if (!value) return value;

  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length === 11) {
    // CPF format: ###.###.###-##
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (cleanValue.length === 14) {
    // CNPJ format: ##.###.###/####-##
    return cleanValue.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }

  return "inválido";
}

function phoneFormatter(value: string) {
  if (!value) return value;

  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length === 10) {
    // Phone format: (##) ####-####
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (cleanValue.length === 11) {
    // Phone format: (##) #####-####
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return "inválido";
}

function zipCodeFormatter(value: string) {
  if (!value) return value;

  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length === 8) {
    // Zip code format: #####-###
    return cleanValue.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  return "inválido";
}

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}

export const CustomerDataTable = () => {
  const {
    openForm,
    setOpenForm,
    setCustomerContext,
    openAlertSnackBar,
    setOpenAlertSnackBar,
  } = useCustomerContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<CustomerDto[]>([] as CustomerDto[]);

  async function reloadCustomersDbData() {
    const { customers } = await getCustomers();
    setRows(customers);
    setIsLoading(false);
  }

  useEffect(() => {
    if (!openForm.open) {
      setIsLoading(true);
      reloadCustomersDbData();
      setIsLoading(false);
    }
  }, [openForm]);

  const customersColumns: GridColDef<CustomerDto>[] = [
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
              handleCallForm("edit", row);
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {
              handleCallForm("delete", row);
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
      field: "registerNumber",
      headerName: "CPF/CNPJ",
      width: 80,
      editable: false,
      valueFormatter: (params) => cpfCnpjFormatter(params),
      renderCell: (params) => {
        return cpfCnpjFormatter(params.value) === "inválido" ? (
          <Tooltip title="Número de CPF/CNPJ inválido">
            <span style={{ color: "lightsalmon" }}>{params.value}</span>
          </Tooltip>
        ) : (
          <span>{cpfCnpjFormatter(params.value) || ""}</span>
        );
      },
    },
    {
      field: "email",
      headerName: "E-mail",
      width: 120,
      editable: false,
    },
    {
      field: "phoneNumber1",
      headerName: "Tel. 1",
      width: 80,
      editable: false,
      valueFormatter: (params) => phoneFormatter(params),
    },
    {
      field: "phoneNumber2",
      headerName: "Tel. 2",
      width: 30,
      editable: false,
      valueFormatter: (params) => phoneFormatter(params),
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
      field: "zipCode",
      headerName: "CEP",
      width: 30,
      editable: false,
      valueFormatter: (params) => zipCodeFormatter(params),
    },
    {
      field: "country",
      headerName: "País",
      width: 30,
      editable: false,
    },
  ];

  function handleCallForm(action: ActionFormProps, row: GridRowModel) {
    let customerData: CustomerDto | CustomerDto;

    if (action === "edit" || action === "delete") {
      customerData = {
        id: row.id,
        name: row.name,
        registerNumber: row.registerNumber,
        contactType1: row.contactType1,
        contact1: row.contact1,
        contactType2: row.contactType2,
        contact2: row.contact2,
        address: row.address,
        city: row.city,
        state: row.state,
        zipCode: row.zipCode,
        country: row.country,
      };
    } else {
      customerData = row as CustomerDto;
    }

    setOpenForm({ open: true, action });
    setCustomerContext(customerData);
  }

  function closeOpenForm() {
    setOpenForm({ open: false, action: "none" });
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

  return (
    <>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ flexGrow: 1 }}
          >
            Clientes
          </Typography>

          <Tooltip title="Adicionar Cliente">
            <Button
              onClick={() => handleCallForm("create", {} as CustomerDto)}
              variant="text"
            >
              <PersonAddTwoToneIcon />
            </Button>
          </Tooltip>
        </Stack>

        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={rows}
          columns={customersColumns}
          loading={isLoading}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
                phoneNumber2: false,
                city: false,
                state: false,
                zipCode: false,
                country: false,
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
          // checkboxSelection
          // disableRowSelectionOnClick
          // rowModesModel={rowModesModel}
          // onRowModesModelChange={handleRowModesModelChange}
          // onRowEditStop={handleRowEditStop}
          // processRowUpdate={processRowUpdate}
          // slots={{ toolbar: EditToolbar }}
          // slotProps={{
          //   toolbar: { setRows, setRowModesModel },
          // }}
          showToolbar
        />
      </Box>

      <FullScreenDialog
        isOpened={openForm.open}
        onClose={closeOpenForm}
        title={
          openForm.action === "create"
            ? "Adicionar Cliente"
            : openForm.action === "edit"
              ? "Editar Cliente"
              : "Excluir Cliente"
        }
      >
        {openForm.action === "create" ? (
          <FormCreateCustomer />
        ) : (
          <FormCustomer />
        )}
      </FullScreenDialog>

      <Snackbar
        open={openAlertSnackBar.isOpen}
        autoHideDuration={6000}
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
