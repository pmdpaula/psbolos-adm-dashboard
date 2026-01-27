"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import BackspaceIcon from "@mui/icons-material/Backspace";
import SaveIcon from "@mui/icons-material/Save";
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Controller,
  type Resolver,
  type SubmitHandler,
  useForm,
} from "react-hook-form";

import { useMainContext } from "@/app/MainContext";
import { StyledFormHelperText } from "@/components/form-fields/StyledFormHelperText";
import { StyledOutlinedInput } from "@/components/form-fields/StyledOutlinedInput";
import { MainContextSnackbar } from "@/components/MainContextSnackbar";
import type { CreateProjectDto, ProjectDto } from "@/data/dto/project-dto";
import { createProjectDtoSchema } from "@/data/dto/project-dto";
import { getDeliveryModes } from "@/http/data-types/get-delivery-modes";
import { getEventTypes } from "@/http/data-types/get-event-types";
import { getProjectStatuses } from "@/http/data-types/get-project-statuses";

import { useProjectContext } from "../ProjectContext";
import { createProjectAction, getProjectByNameAction } from "./actions";

const typedResolver = zodResolver(
  createProjectDtoSchema,
) as Resolver<CreateProjectDto>;

const snackbarDuration = 6000;

export const FormCreateProject = () => {
  const { setOpenAlertSnackBar } = useMainContext();
  const { setProjectContext } = useProjectContext();

  const router = useRouter();

  const { data: eventTypesData, isLoading: isLoadingEventTypes } = useQuery({
    queryKey: ["event-types"],
    queryFn: async () => await getEventTypes(),
  });

  const { data: deliveryModesData, isLoading: isLoadingDeliveryModes } =
    useQuery({
      queryKey: ["delivery-modes"],
      queryFn: async () => await getDeliveryModes(),
    });

  const { data: projectStatusesData, isLoading: isLoadingProjectStatuses } =
    useQuery({
      queryKey: ["project-statuses"],
      queryFn: async () => await getProjectStatuses(),
    });

  const [eventTypeSelected, _setEventTypeSelected] = useState<string>("OTHER");
  const [deliveryModeSelected, _setDeliveryModeSelected] =
    useState<string>("DELIVERY");
  const [statusSelected, _setStatusSelected] = useState<string>("PLANNING");

  const {
    control,
    handleSubmit,
    formState: { errors, isLoading, isValid, isDirty },
  } = useForm<CreateProjectDto>({
    defaultValues: {
      name: "",
      description: "",
      eventTypeCode: eventTypeSelected,
      eventDate: new Date().toLocaleDateString("pt-BR"),
      localName: null,
      deliveryModeCode: deliveryModeSelected,
      address: null,
      city: "Rio de Janeiro",
      state: "RJ",
      shippingCost: 0,
      statusCode: statusSelected,
    },
    resolver: typedResolver,
    // resolver: zodResolver(createProjectDtoSchema),
    mode: "all", // Valida onChange + onBlur
  });

  const [isReadingData, setIsReadingData] = useState(true);

  // function handleChangeEventType(event: SelectChangeEvent<string>) {
  //   const selectedType = event.target.value as string;

  //   if (!selectedType) {
  //     setValue("eventTypeCode", "");
  //   } else {
  //     setValue("eventTypeCode", selectedType);
  //   }
  // }

  // function handleChangeDeliveryMode(event: SelectChangeEvent<string>) {
  //   const selectedType = event.target.value as string;

  //   if (!selectedType) {
  //     setValue("deliveryModeCode", "");
  //   } else {
  //     setValue("deliveryModeCode", selectedType);
  //   }
  // }

  // function handleChangeProjectStatus(event: SelectChangeEvent<string>) {
  //   const selectedType = event.target.value as string;

  //   if (!selectedType) {
  //     setValue("statusCode", "");
  //   } else {
  //     setValue("statusCode", selectedType);
  //   }
  // }

  const [isButtonDisabled, setIsButtonDisabled] = useState(isLoading);

  const [_progressStep, setProgressStep] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isReadingData && setIsReadingData(false);
  }, [isReadingData]);

  useEffect(() => {
    if (
      isLoading ||
      isLoadingEventTypes ||
      isLoadingDeliveryModes ||
      isLoadingProjectStatuses
    ) {
      setIsReadingData(true);
    } else {
      setIsReadingData(false);
    }

    setIsButtonDisabled(isReadingData);
  }, [
    isLoading,
    isLoadingEventTypes,
    isLoadingDeliveryModes,
    isLoadingProjectStatuses,
  ]);

  useEffect(() => {
    if (!isDirty || (isDirty && !isValid)) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [isDirty, isValid, isLoading]);

  const onSubmit: SubmitHandler<CreateProjectDto> = async (data) => {
    setIsButtonDisabled(true);

    const submitResponse = await createProjectAction(data);
    let createdProject: ProjectDto | null = null;

    if (submitResponse.success) {
      createdProject = await getProjectByNameAction(data.name);

      setProjectContext(createdProject);

      setCookie("newProject", JSON.stringify(createdProject), {
        path: "/",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });
    } else {
      setIsButtonDisabled(false);
    }

    setOpenAlertSnackBar({
      isOpen: true,
      success: submitResponse.success,
      message: submitResponse.message,
      errorCode: submitResponse.errors,
    });

    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }

    progressTimerRef.current = setInterval(() => {
      setProgressStep((prevProgress) => {
        if (prevProgress > 100) {
          clearInterval(progressTimerRef.current!);
          progressTimerRef.current = null;

          setOpenAlertSnackBar({
            isOpen: false,
            success: true,
            message: "",
            errorCode: null,
          });

          return 0;
        }

        return prevProgress + 5;
      });
    }, snackbarDuration / 20);

    setTimeout(() => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }

      if (submitResponse.success && createdProject) {
        router.push(`/projects/${createdProject.id}/connect`);
      }
    }, snackbarDuration + 200);
  };

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <Backdrop
        sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
        open={isReadingData}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {!isReadingData && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            width: "100%",
            maxWidth: 800,
          }}
        >
          <Stack spacing={2}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.name ? true : false}
                  color={errors.name ? "error" : "secondary"}
                >
                  <InputLabel
                    htmlFor="name"
                    size="small"
                  >
                    Nome
                  </InputLabel>
                  <StyledOutlinedInput
                    size="small"
                    id="name"
                    label="Nome"
                    {...field}
                    value={field.value || ""}
                    error={errors.name ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.name?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.description ? true : false}
                  color={errors.description ? "error" : "secondary"}
                >
                  <InputLabel
                    htmlFor="description"
                    size="small"
                  >
                    Descrição
                  </InputLabel>
                  <StyledOutlinedInput
                    size="small"
                    id="description"
                    label="Descrição"
                    {...field}
                    value={field.value || ""}
                    error={errors.description ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.description?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="eventTypeCode"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.eventTypeCode ? true : false}
                  color={errors.eventTypeCode ? "error" : "secondary"}
                >
                  {isLoadingEventTypes ? (
                    <CircularProgress size={40} />
                  ) : (
                    <>
                      <InputLabel
                        size="small"
                        htmlFor="eventTypeCode"
                      >
                        Tipo de Evento
                      </InputLabel>

                      <Select
                        labelId="select-label-eventTypeCode"
                        id="eventTypeCode"
                        {...field}
                        value={field.value || ""}
                        label="Tipo de Evento"
                        size="small"
                        // autoWidth
                        // onChange={handleChangeEventType}
                      >
                        {eventTypesData?.eventTypes.map((type) => {
                          return (
                            <MenuItem
                              key={type.code}
                              value={type.code}
                            >
                              {type.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </>
                  )}

                  <StyledFormHelperText component="p">
                    {errors.eventTypeCode?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="eventDate"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.eventDate ? true : false}
                  color={errors.eventDate ? "error" : "secondary"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="eventDate"
                  >
                    Data do Evento
                  </InputLabel>
                  <StyledOutlinedInput
                    size="small"
                    id="eventDate"
                    type="date"
                    placeholder=""
                    {...field}
                    value={field.value || ""}
                    error={errors.eventDate ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.eventDate?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="localName"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.localName ? true : false}
                  color={errors.localName ? "error" : "secondary"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="localName"
                  >
                    Local do Evento
                  </InputLabel>

                  <StyledOutlinedInput
                    size="small"
                    id="registerNumber"
                    label="CPF/CNPJ"
                    {...field}
                    value={field.value || ""}
                    error={errors.localName ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.localName?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="deliveryModeCode"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.deliveryModeCode ? true : false}
                  color={errors.deliveryModeCode ? "error" : "secondary"}
                >
                  {isLoadingDeliveryModes ? (
                    <CircularProgress size={40} />
                  ) : (
                    <>
                      <InputLabel
                        size="small"
                        htmlFor="deliveryModeCode"
                      >
                        Tipo de Entrega
                      </InputLabel>

                      <Select
                        labelId="select-label-deliveryModeCode"
                        id="deliveryModeCode"
                        {...field}
                        value={field.value || ""}
                        label="Tipo de Entrega"
                        size="small"
                        // onChange={handleChangeDeliveryMode}
                      >
                        {/* <MenuItem>...</MenuItem> */}

                        {deliveryModesData?.deliveryModes.map((mode) => {
                          return (
                            <MenuItem
                              key={mode.code}
                              value={mode.code}
                            >
                              {mode.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </>
                  )}

                  <StyledFormHelperText component="p">
                    {errors.deliveryModeCode?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.address ? true : false}
                  color={errors.address ? "error" : "secondary"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="address"
                  >
                    Endereço
                  </InputLabel>
                  <StyledOutlinedInput
                    size="small"
                    id="address"
                    label="Endereço"
                    {...field}
                    value={field.value || ""}
                    error={errors.address ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.address?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.city ? true : false}
                  color={errors.city ? "error" : "secondary"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="city"
                  >
                    Cidade
                  </InputLabel>
                  <StyledOutlinedInput
                    size="small"
                    id="city"
                    label="Cidade"
                    {...field}
                    value={field.value || ""}
                    error={errors.city ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.city?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.state ? true : false}
                  color={errors.state ? "error" : "secondary"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="state"
                  >
                    Estado
                  </InputLabel>
                  <StyledOutlinedInput
                    size="small"
                    id="state"
                    label="Estado"
                    {...field}
                    value={field.value || ""}
                    error={errors.state ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.state?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="shippingCost"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.shippingCost ? true : false}
                  color={errors.shippingCost ? "error" : "secondary"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="shippingCost"
                  >
                    Custo de Entrega
                  </InputLabel>
                  <StyledOutlinedInput
                    size="small"
                    id="shippingCost"
                    label="Custo de Entrega"
                    type="number"
                    {...field}
                    value={field.value || 0}
                    error={errors.shippingCost ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.shippingCost?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="statusCode"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.statusCode ? true : false}
                  color={errors.statusCode ? "error" : "secondary"}
                >
                  {isLoadingDeliveryModes ? (
                    <CircularProgress size={40} />
                  ) : (
                    <>
                      <InputLabel
                        size="small"
                        htmlFor="statusCode"
                      >
                        Estado do Projeto
                      </InputLabel>

                      <Select
                        labelId="select-label-statusCode"
                        id="statusCode"
                        {...field}
                        value={field.value}
                        label="Tipo"
                        size="small"
                        // onChange={handleChangeProjectStatus}
                      >
                        {/* <MenuItem>...</MenuItem> */}

                        {projectStatusesData?.projectStatuses.map((mode) => {
                          return (
                            <MenuItem
                              key={mode.code}
                              value={mode.code}
                            >
                              {mode.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </>
                  )}

                  <StyledFormHelperText component="p">
                    {errors.statusCode?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />
          </Stack>

          <Stack
            spacing={8}
            direction="row"
            justifyContent="space-between"
            mt={4}
          >
            <Button
              color="error"
              fullWidth
              size="large"
              sx={{ mt: 5, height: 42, maxWidth: 200 }}
              startIcon={<BackspaceIcon fontSize="small" />}
              onClick={() => router.back()}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              // color={action === "delete" ? "error" : "secondary"}
              fullWidth
              size="large"
              sx={{ mt: 5, height: 42 }}
              disabled={isButtonDisabled}
              startIcon={
                isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  <SaveIcon fontSize="small" />
                )
              }
            >
              "Salvar"
            </Button>
          </Stack>
        </form>
      )}

      <MainContextSnackbar />
    </>
  );
};
