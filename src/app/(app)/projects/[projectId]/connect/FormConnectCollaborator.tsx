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
import type { CollaboratorDto } from "@/data/dto/collaborator-dto";
import { fetchCollaborators } from "@/http/collaborator/fetch-collaborators";
import { getCollaboratorTypes } from "@/http/data-types/get-collaborator-types";
import { getProfile } from "@/http/user/get-profile";

import { getProjectFullDataByIdAction } from "../../action";
import { useProjectContext } from "../../ProjectContext";
import { createCollaborationAction } from "./actions";
import { AlreadyConnectedCollaborators } from "./AlreadyConnectedCollaborators";
import { FormCreateCollaboratorOnProject } from "./FormCreateCollaboratorOnProject";

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

  const collaborationsInProject =
    projectFullDataInDb.collaboratorsInProject.map((collaboration) => ({
      collaboratorId: collaboration.collaborator.id!,
      collaboratorType: collaboration.collaboratorType,
      projectId,
      collaborationId: collaboration.id,
      role: collaboration.role ?? null,
      collaborator: collaboration.collaborator,
    }));

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

  const [collaboratorsOutsideProject, setCollaboratorsOutsideProject] =
    useState<CollaboratorDto[]>([]);

  const [contractorTypeName, setContractorTypeName] = useState<string>("");

  const [collaborations, setCollaborations] = useState<CollaborationFull[]>([]);
  const [isThereContractorInProject, setIsThereContractorInProject] =
    useState(false);

  const { data: collaboratorTypesData, isLoading: isLoadingCollaboratorTypes } =
    useQuery({
      queryKey: ["collaborator-types"],
      queryFn: async () => await getCollaboratorTypes(),
    });

  const { data: collaboratorsData } = useQuery({
    queryKey: ["collaborators"],
    queryFn: async () => await fetchCollaborators(),
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

  function filterCollaboratorsOutsideProject() {
    setIsReadingData(true);

    if (!collaboratorsData) {
      return;
    }

    fetchCollaborationsInProject(projectId).then((data) => {
      setCollaborations(data);
    });

    getProjectFullDataByIdAction(projectId).then((projectFullData) => {
      const collaboratorsInProjectIds =
        projectFullData.collaboratorsInProject.map(
          (collaboration) => collaboration.collaborator.id,
        ) ?? [];

      const collaboratorsOutside = collaboratorsData.collaborators.filter(
        (collaborator) => !collaboratorsInProjectIds.includes(collaborator.id!),
      );

      setCollaboratorsOutsideProject(collaboratorsOutside);
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
      // Refresh react-query data so Autocomplete gets the latest collaborators
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });

      // Also refresh any server components if present
      router.refresh();
      setFocusOnCollaboratorSelect();
      // TODO finalizar teste com a focus do campo collaboratorId
    }
  }, [openForm, queryClient]);

  useEffect(() => {
    filterCollaboratorsOutsideProject();
  }, [collaboratorsData, refreshKey]);

  useEffect(() => {
    setIsThereContractorInProject(findContractorCollaborator(collaborations));
  }, [collaborations]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CollaborationForm>({
    defaultValues: {
      collaboratorId: "",
      collaboratorTypeCode: "",
    },
    resolver: zodResolver(collaborationFormSchema),
  });

  const onSubmit: SubmitHandler<CollaborationForm> = async (data) => {
    const submitData = {
      ...data,
      projectId,
      userId: userProfileData?.user.id,
    };

    const submitResponse = await createCollaborationAction(submitData);

    if (!isThereContractorInProject) {
      reset({
        collaboratorId: "",
        collaboratorTypeCode: "",
      });
    }

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

  function setFocusOnCollaboratorSelect() {
    const collaboratorSelect = document.getElementById("collaboratorId");

    if (collaboratorSelect) {
      collaboratorSelect.focus();
    }
  }

  return (
    <>
      <AlreadyConnectedCollaborators
        key={refreshKey}
        projectId={projectId}
        collaborations={collaborations}
        setCollaborations={setCollaborations}
      />

      <GradientPaper style={{ marginTop: 16, padding: 16 }}>
        {!isReadingData && (
          <>
            {!isThereContractorInProject && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
              >
                {`Ainda não existe nenhum ${contractorTypeName.toLocaleLowerCase()} conectado a este
                  projeto. É preciso um para gerar contratos.`}
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
                  name="collaboratorId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControl
                      sx={{ minWidth: 240, flexGrow: 1 }}
                      error={errors.collaboratorId ? true : false}
                      color={errors.collaboratorId ? "error" : "secondary"}
                    >
                      <Autocomplete
                        clearOnEscape
                        filterOptions={filterOptions}
                        options={collaboratorsOutsideProject.map(
                          (collaborator) => ({
                            label: collaborator.name,
                            id: collaborator.id!,
                            contact:
                              collaborator.contact1 && collaborator.contact2
                                ? collaborator.contact1 +
                                  " \u26AB " +
                                  collaborator.contact2
                                : collaborator.contact1
                                  ? collaborator.contact1
                                  : collaborator.contact2
                                    ? collaborator.contact2
                                    : "",
                          }),
                        )}
                        value={
                          collaboratorsOutsideProject
                            .map((collaborator) => ({
                              label: collaborator.name,
                              id: collaborator.id!,
                              contact:
                                collaborator.contact1 +
                                " " +
                                collaborator.contact2,
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
                              boxShadow: errors.collaboratorId
                                ? "0px 0px 12px 2px rgba(255,0,0,0.5)"
                                : "",
                            }}
                            error={Boolean(errors.collaboratorId)}
                          />
                        )}
                      />

                      <StyledFormHelperText component="p">
                        {errors.collaboratorId?.message}
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
                                if (!isThereContractorInProject) {
                                  // Exibir apenas CONTRACTOR quando for nulo ou false
                                  if (mode.code === "CONTRACTOR") {
                                    // TODO: Ajustar para que nesse caso o CONTRACTOR venha selecionado por padrão
                                    return (
                                      <MenuItem
                                        key={mode.code}
                                        value={mode.code}
                                      >
                                        {mode.name}
                                      </MenuItem>
                                    );
                                  }
                                } else {
                                  // Exibir todas as opções exceto CONTRACTOR quando houver CONTRACTOR
                                  if (mode.code !== "CONTRACTOR") {
                                    return (
                                      <MenuItem
                                        key={mode.code}
                                        value={mode.code}
                                      >
                                        {mode.name}
                                      </MenuItem>
                                    );
                                  }
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
        title="Criar colaborador"
      >
        <FormCreateCollaboratorOnProject />
      </FullScreenDialog>

      <MainContextSnackbar />
    </>
  );
};
