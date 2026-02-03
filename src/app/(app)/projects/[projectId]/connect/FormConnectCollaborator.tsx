import { zodResolver } from "@hookform/resolvers/zod";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  createFilterOptions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

import { useMainContext } from "@/app/MainContext";
import { StyledFormHelperText } from "@/components/form-fields/StyledFormHelperText";
import FullScreenDialog from "@/components/FullScreenDialog";
import GlassCardHover from "@/components/glass/GlassCardHover";
import { GradientPaper } from "@/components/GradientPaper";
import { MainContextSnackbar } from "@/components/MainContextSnackbar";
import {
  type CollaborationForm,
  collaborationFormSchema,
  type CollaborationFull,
} from "@/data/dto/collaboration-dto";
import type { CustomerDto } from "@/data/dto/customer-dto";
import { getCustomers } from "@/http/customer/get-customers";
import { getCollaboratorTypes } from "@/http/data-types/get-collaborator-types";
import { getProfile } from "@/http/user/get-profile";

import { getProjectFullDataByIdAction } from "../../action";
import { useProjectContext } from "../../ProjectContext";
import { createCollaborationAction } from "./actions";
import { AlreadyConnectedCustomers } from "./AlreadyConnectedCustomers";
import { FormCreateCustomerOnProject } from "./FormCreateCustomerOnProject";

// TODO: Adicionar um alerta caso o projeto ainda não tenha um contratante conectado. Informar que só é possível criar o contrato com um contratante conectado ao projeto.

interface AutocompleteOption {
  label: string;
  id: string;
  contact?: string;
}

const filterOptions = createFilterOptions<AutocompleteOption>({
  stringify: (option) => `${option.label} ${option.contact ?? ""}`,
});

interface FormConnectCollaboratorProps {
  projectId: string;
}

export const fetchCollaborationsInProject = async (projectId: string) => {
  const projectFullDataInDb = await getProjectFullDataByIdAction(projectId);

  const collaborationsInProject = projectFullDataInDb.customersInProject.map(
    (collaboration) => ({
      customerId: collaboration.customer.id!,
      collaboratorType: collaboration.collaboratorType,
      projectId,
      collaborationId: collaboration.id,
      // userId: collaboration.id ?? null,
      role: collaboration.role ?? null,
      customer: collaboration.customer,
    }),
  );

  const collaborationsInProjectSorted = collaborationsInProject.sort((a, b) =>
    a.collaboratorType.name.localeCompare(b.collaboratorType.name),
  );

  return collaborationsInProjectSorted;
};

export const FormConnectCollaborator = ({
  projectId,
}: FormConnectCollaboratorProps) => {
  const { setOpenAlertSnackBar } = useMainContext();
  const theme = useTheme();
  const isBreakpointMinusMd = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const queryClient = useQueryClient();

  const { openForm, setOpenForm, refreshKey, setRefreshKey } =
    useProjectContext();
  const [isReadingData, setIsReadingData] = useState(true);

  const [customersOutsideProject, setCustomersOutsideProject] = useState<
    CustomerDto[]
  >([]);

  const [contractorTypeName, setContractorTypeName] = useState<string>("");

  const [collaborations, setCollaborations] = useState<CollaborationFull[]>([]);
  const [isThereContractorInProject, setIsThereContractorInProject] =
    useState(false);

  const { data: collaboratorTypesData, isLoading: isLoadingCollaboratorTypes } =
    useQuery({
      queryKey: ["collaborator-types"],
      queryFn: async () => await getCollaboratorTypes(),
    });

  const { data: customersData } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => await getCustomers(),
  });

  const { data: userProfileData, isLoading: isLoadingUserProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => await getProfile(),
  });

  useEffect(() => {
    if (collaboratorTypesData && !isLoadingCollaboratorTypes) {
      setContractorTypeName(
        collaboratorTypesData.collaboratorTypes.find(
          (type) => type.code === "CONTRACTOR",
        )!.name,
      );
    }

    setIsReadingData(isLoadingCollaboratorTypes || isLoadingUserProfile);
  }, [isLoadingCollaboratorTypes, isLoadingUserProfile]);

  function filterCustomersOutsideProject() {
    setIsReadingData(true);

    if (!customersData) {
      return;
    }

    fetchCollaborationsInProject(projectId).then((data) => {
      setCollaborations(data);
    });

    getProjectFullDataByIdAction(projectId).then((projectFullData) => {
      const customersInProjectIds =
        projectFullData.customersInProject.map(
          (collaboration) => collaboration.customer.id,
        ) ?? [];

      const customersOutside = customersData.customers.filter(
        (customer) => !customersInProjectIds.includes(customer.id!),
      );

      setCustomersOutsideProject(customersOutside);
    });

    setIsReadingData(false);
  }

  function findContractorCollaborator(collabs: CollaborationFull[]): boolean {
    if (collabs.length === 0) {
      return false;
    }

    const contractorCollaborations = collabs.filter(
      (collab) => collab.collaboratorType.code === "CONTRACTOR",
    );

    return contractorCollaborations.length > 0;
  }

  useEffect(() => {
    if (!openForm) {
      // Refresh react-query data so Autocomplete gets the latest customers
      queryClient.invalidateQueries({ queryKey: ["customers"] });

      // Also refresh any server components if present
      router.refresh();
      setFocusOnCustomerSelect();
      // TODO finalizar teste com a focus do campo customerId
    }
  }, [openForm, queryClient]);

  useEffect(() => {
    filterCustomersOutsideProject();
  }, [customersData, refreshKey]);

  useEffect(() => {
    setIsThereContractorInProject(findContractorCollaborator(collaborations));
  }, [collaborations]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CollaborationForm>({
    defaultValues: {
      customerId: "",
      collaboratorTypeCode: "CUSTOMER",
    },
    resolver: zodResolver(collaborationFormSchema),
  });

  const onSubmit: SubmitHandler<CollaborationForm> = async (data) => {
    const submitData = {
      ...data,
      // collaboratorType: collaboratorType!,
      projectId,
      userId: userProfileData?.user.id,
    };

    const submitResponse = await createCollaborationAction(submitData);

    setOpenAlertSnackBar({
      isOpen: true,
      success: submitResponse.success,
      message: submitResponse.message,
      errorCode: submitResponse.errors,
    });

    if (submitResponse.success) {
      setRefreshKey((k) => k + 1);
    }
  };

  function setFocusOnCustomerSelect() {
    const customerSelect = document.getElementById("customerId");

    if (customerSelect) {
      customerSelect.focus();
    }
  }

  return (
    <>
      <AlreadyConnectedCustomers
        key={refreshKey}
        projectId={projectId}
        collaborations={collaborations}
        setCollaborations={setCollaborations}
      />

      <GradientPaper style={{ marginTop: 16, padding: 16 }}>
        {!isReadingData && (
          <>
            {/* <Typography
              variant="body1"
              sx={{ my: 2 }}
            >
              Temos {customersData ? customersData.customers.length : 0}{" "}
              colaboradores cadastrados
            </Typography> */}

            {isThereContractorInProject && (
              <Alert
                severity="info"
                sx={{ mb: 2 }}
              >
                {`Já existe um ${contractorTypeName.toLocaleLowerCase()} conectado a este
                  projeto. Somente um por projeto.`}
              </Alert>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              key={refreshKey}
            >
              <Stack
                spacing={2}
                direction={isBreakpointMinusMd ? "column" : "row"}
                justifyContent={isBreakpointMinusMd ? "center" : "flex-start"}
                width="100%"
                sx={{ mb: 2 }}
              >
                <Controller
                  name="customerId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControl
                      sx={{ minWidth: 240, flexGrow: 1 }}
                      error={errors.customerId ? true : false}
                      color={errors.customerId ? "error" : "secondary"}
                    >
                      <Autocomplete
                        clearOnEscape
                        filterOptions={filterOptions}
                        options={customersOutsideProject.map((customer) => ({
                          label: customer.name,
                          id: customer.id!,
                          contact:
                            customer.contact1 && customer.contact2
                              ? customer.contact1 +
                                " \u26AB " +
                                customer.contact2
                              : customer.contact1
                                ? customer.contact1
                                : customer.contact2
                                  ? customer.contact2
                                  : "",
                        }))}
                        value={
                          customersOutsideProject
                            .map((customer) => ({
                              label: customer.name,
                              id: customer.id!,
                              contact:
                                customer.contact1 + " " + customer.contact2,
                            }))
                            .find((opt) => opt.id === field.value) ?? null
                        }
                        onChange={(_, option) => {
                          field.onChange(
                            (option as AutocompleteOption | null)?.id ?? "",
                          );
                        }}
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => {
                          const { key, ...optionProps } = props;

                          return (
                            <Box
                              key={key}
                              component="li"
                              {...optionProps}
                            >
                              <Typography variant="body1">
                                {option.label}
                              </Typography>

                              {option.contact && (
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                  sx={{ marginLeft: 2 }}
                                >
                                  {option.contact}
                                </Typography>
                              )}
                            </Box>
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Colaboradores"
                            size="small"
                            sx={{
                              flexGrow: 1,
                              boxShadow: errors.customerId
                                ? "0px 0px 12px 2px rgba(255,0,0,0.5)"
                                : "",
                            }}
                            error={Boolean(errors.customerId)}
                          />
                        )}
                      />

                      <StyledFormHelperText component="p">
                        {errors.customerId?.message}
                      </StyledFormHelperText>
                    </FormControl>
                  )}
                />

                <Controller
                  name="collaboratorTypeCode"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControl
                      error={errors.collaboratorTypeCode ? true : false}
                      color={
                        errors.collaboratorTypeCode ? "error" : "secondary"
                      }
                    >
                      {isLoadingCollaboratorTypes ? (
                        <CircularProgress size={40} />
                      ) : (
                        <>
                          <InputLabel
                            size="small"
                            htmlFor="collaboratorTypeCode"
                          >
                            Tipo de colaborador
                          </InputLabel>

                          <Select
                            labelId="select-label-collaboratorTypeCode"
                            id="collaboratorTypeCode"
                            {...field}
                            value={field.value || ""}
                            label="Tipo de colaborador"
                            size="small"
                            onChange={(event) => {
                              field.onChange(event.target.value);
                            }}
                            sx={{
                              minWidth: isBreakpointMinusMd ? "100%" : 250,
                            }}
                            // fullWidth={isBreakpointMinusMd ? true : false}
                          >
                            {collaboratorTypesData?.collaboratorTypes.map(
                              (mode) => {
                                if (
                                  !isThereContractorInProject ||
                                  mode.code !== "CONTRACTOR"
                                ) {
                                  return (
                                    <MenuItem
                                      key={mode.code}
                                      value={mode.code}
                                    >
                                      {mode.name}
                                    </MenuItem>
                                  );
                                }
                              },
                            )}
                          </Select>
                        </>
                      )}

                      <StyledFormHelperText component="p">
                        {errors.collaboratorTypeCode?.message}
                      </StyledFormHelperText>
                    </FormControl>
                  )}
                />
              </Stack>

              <Box
                width="100%"
                display="flex"
                justifyContent="flex-end"
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!isValid}
                  sx={{ minWidth: isBreakpointMinusMd ? "100%" : 250 }}
                  startIcon={
                    isReadingData ? (
                      <CircularProgress size={20} />
                    ) : (
                      <PersonAddTwoToneIcon />
                    )
                  }
                >
                  Adicionar Colaborador
                </Button>
              </Box>
            </form>
          </>
        )}
      </GradientPaper>

      <GlassCardHover
        sx={{
          mt: 4,
          py: 2,
          px: 4,
          textTransform: "none",
          textAlign: "center",
          flexDirection: "column",
        }}
        onClick={() => setOpenForm(true)}
      >
        <Typography variant="body1">
          Caso o colaborador não esteja cadastrado, {<br />}
          clique aqui para cadastrá-lo.
        </Typography>
      </GlassCardHover>

      <FullScreenDialog
        isOpened={openForm}
        onClose={() => setOpenForm(false)}
        title="Criar cliente"
      >
        <FormCreateCustomerOnProject />
      </FullScreenDialog>

      <MainContextSnackbar />
    </>
  );
};
