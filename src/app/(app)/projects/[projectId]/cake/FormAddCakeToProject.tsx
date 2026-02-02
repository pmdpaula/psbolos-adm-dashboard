"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import SaveIcon from "@mui/icons-material/Save";
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Controller,
  type Resolver,
  type SubmitHandler,
  useForm,
} from "react-hook-form";

import { useMainContext } from "@/app/MainContext";
import { StyledFormHelperText } from "@/components/form-fields/StyledFormHelperText";
import { StyledOutlinedInput } from "@/components/form-fields/StyledOutlinedInput";
import { GradientPaper } from "@/components/GradientPaper";
import { type CreateCakeDto, createCakeDtoSchema } from "@/data/dto/cake-dto";
import { getCakeBatters } from "@/http/data-types/get-cake-batters";
import { getCakeFillings } from "@/http/data-types/get-cake-fillings";

import { useProjectContext } from "../../ProjectContext";
import { addCakeToProjectAction } from "./actions";

const typedResolver = zodResolver(
  createCakeDtoSchema,
) as Resolver<CreateCakeDto>;

interface FormAddCakeToProjectProps {
  projectId: string;
}

export const FormAddCakeToProject = ({
  projectId,
}: FormAddCakeToProjectProps) => {
  const { setOpenAlertSnackBar } = useMainContext();
  const { setRefreshKey } = useProjectContext();

  const { data: cakeBattersData, isLoading: isLoadingCakeBatters } = useQuery({
    queryKey: ["cake-batters"],
    queryFn: async () => await getCakeBatters(),
  });

  const { data: cakeFillingsData, isLoading: isLoadingCakeFillings } = useQuery(
    {
      queryKey: ["cake-fillings"],
      queryFn: async () => await getCakeFillings(),
    },
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<CreateCakeDto>({
    defaultValues: {
      projectId,
      description: "",
      price: 0,
      tiers: 1,
      // imageUrl: null,
      // referenceUrl: null,
      batterCode: "",
      fillingCode1: "",
      fillingCode2: "",
      fillingCode3: "",
    },
    resolver: typedResolver,
    mode: "onChange", // Valida onChange + onBlur
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(isLoading);
  const [isReadingData, setIsReadingData] = useState(true);

  useEffect(() => {
    setOpenAlertSnackBar({
      isOpen: false,
      success: true,
      message: "",
      errorCode: null,
    });
  }, []);

  useEffect(() => {
    if (isLoading || isLoadingCakeBatters || isLoadingCakeFillings) {
      setIsReadingData(true);
    } else {
      setIsReadingData(false);
    }

    setIsButtonDisabled(isReadingData);
  }, [isLoading, isLoadingCakeBatters, isLoadingCakeFillings, isReadingData]);

  const onSubmit: SubmitHandler<CreateCakeDto> = async (data) => {
    const submitData = { ...data, projectId };

    const submitResponse = await addCakeToProjectAction(submitData);

    // setOpenForm(false);

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

  return (
    <>
      <Backdrop
        sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {!isLoading && (
        <GradientPaper label="Adicionar novo bolo ao projeto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
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
                      label="Nome"
                      {...field}
                      // value={field.value}
                      error={errors.description ? true : false}
                    />

                    <StyledFormHelperText component="p">
                      {errors.description?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="price"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.price ? true : false}
                    color={errors.price ? "error" : "secondary"}
                  >
                    <InputLabel
                      size="small"
                      htmlFor="price"
                    >
                      Valor
                    </InputLabel>

                    <StyledOutlinedInput
                      size="small"
                      id="price"
                      label="Valor"
                      type="number"
                      {...field}
                      value={field.value}
                      error={errors.price ? true : false}
                      startAdornment={
                        <InputAdornment position="start">R$</InputAdornment>
                      }
                    />

                    <StyledFormHelperText component="p">
                      {errors.price?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="tiers"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.tiers ? true : false}
                    color={errors.tiers ? "error" : "secondary"}
                  >
                    <InputLabel
                      size="small"
                      htmlFor="tiers"
                    >
                      Andares
                    </InputLabel>

                    <StyledOutlinedInput
                      size="small"
                      id="tiers"
                      label="Andares"
                      type="number"
                      {...field}
                      // value={field.value}
                      error={errors.tiers ? true : false}
                    />

                    <StyledFormHelperText component="p">
                      {errors.tiers?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="batterCode"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.batterCode ? true : false}
                    color={errors.batterCode ? "error" : "secondary"}
                  >
                    <InputLabel
                      size="small"
                      htmlFor="batterCode"
                    >
                      Massa
                    </InputLabel>

                    <Select
                      labelId="select-label-batterCode"
                      id="batterCode"
                      {...field}
                      // value={field.value || ""}
                      label="Tipo"
                      size="small"
                      // onChange={handleChangeSelectField}
                    >
                      <MenuItem value="">
                        <em>Selecione uma massa</em>
                      </MenuItem>

                      {cakeBattersData?.cakeBatters.map((mode) => {
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

                    <StyledFormHelperText component="p">
                      {errors.batterCode?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="fillingCode1"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.fillingCode1 ? true : false}
                    color={errors.fillingCode1 ? "error" : "secondary"}
                  >
                    <InputLabel
                      size="small"
                      htmlFor="fillingCode1"
                    >
                      Recheio 1
                    </InputLabel>

                    <Select
                      labelId="select-label-fillingCode1"
                      id="fillingCode1"
                      {...field}
                      // value={field.value || ""}
                      label="Tipo"
                      size="small"
                      // onChange={handleChangeSelectField}
                    >
                      <MenuItem value="">
                        <em>Selecione um recheio</em>
                      </MenuItem>

                      {cakeFillingsData?.cakeFillings.map((mode) => {
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

                    <StyledFormHelperText component="p">
                      {errors.fillingCode1?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="fillingCode2"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.fillingCode2 ? true : false}
                    color={errors.fillingCode2 ? "error" : "secondary"}
                  >
                    <InputLabel
                      size="small"
                      htmlFor="fillingCode2"
                    >
                      Recheio 2
                    </InputLabel>

                    <Select
                      labelId="select-label-fillingCode2"
                      id="fillingCode2"
                      {...field}
                      // value={field.value || ""}
                      label="Tipo"
                      size="small"
                      // onChange={handleChangeSelectField}
                    >
                      <MenuItem value="">
                        <em>Selecione um recheio</em>
                      </MenuItem>

                      {cakeFillingsData?.cakeFillings.map((mode) => {
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

                    <StyledFormHelperText component="p">
                      {errors.fillingCode2?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="fillingCode3"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.fillingCode3 ? true : false}
                    color={errors.fillingCode3 ? "error" : "secondary"}
                  >
                    <InputLabel
                      size="small"
                      htmlFor="fillingCode3"
                    >
                      Recheio 3
                    </InputLabel>

                    <Select
                      labelId="select-label-fillingCode3"
                      id="fillingCode3"
                      {...field}
                      // value={field.value || ""}
                      label="Tipo"
                      size="small"
                      // onChange={handleChangeSelectField}
                    >
                      <MenuItem value="">
                        <em>Selecione um recheio</em>
                      </MenuItem>

                      {cakeFillingsData?.cakeFillings.map((mode) => {
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

                    <StyledFormHelperText component="p">
                      {errors.fillingCode3?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              />

              {/* <Controller
                name="referenceUrl"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.referenceUrl ? true : false}
                    color={errors.referenceUrl ? "error" : "secondary"}
                  >
                    <InputLabel
                      size="small"
                      htmlFor="referenceUrl"
                    >
                      Bolo de referência
                    </InputLabel>

                    <StyledOutlinedInput
                      size="small"
                      id="referenceUrl"
                      label="CEP"
                      disabled
                      hidden
                      {...field}
                      value={field.value}
                      error={errors.referenceUrl ? true : false}
                    />

                    <StyledFormHelperText component="p">
                      {errors.referenceUrl?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.imageUrl ? true : false}
                    color={errors.imageUrl ? "error" : "secondary"}
                  >
                    <InputLabel
                      size="small"
                      htmlFor="imageUrl"
                    >
                      Bolo pronto
                    </InputLabel>

                    <StyledOutlinedInput
                      size="small"
                      id="imageUrl"
                      label="Endereço"
                      disabled
                      {...field}
                      value={field.value}
                      error={errors.imageUrl ? true : false}
                    />

                    <StyledFormHelperText component="p">
                      {errors.imageUrl?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              /> */}
            </Stack>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
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
              Salvar
            </Button>
          </form>
        </GradientPaper>
      )}
    </>
  );
};
