"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import SaveIcon from "@mui/icons-material/Save";
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { createCustomerAction } from "@/app/(app)/customer/action";
import { useMainContext } from "@/app/MainContext";
import { StyledFormHelperText } from "@/components/form-fields/StyledFormHelperText";
import { StyledOutlinedInput } from "@/components/form-fields/StyledOutlinedInput";
import type { CustomerDto } from "@/data/dto/customer-dto";
import { customerDtoSchema } from "@/data/dto/customer-dto";
import {
  customerContactTypeDescription,
  customerContactTypeType,
} from "@/lib/customer-contact-type";

import { useProjectContext } from "../../ProjectContext";

export const FormCreateCustomerOnProject = () => {
  const { setOpenAlertSnackBar } = useMainContext();
  const { setRefreshKey, setOpenForm } = useProjectContext();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isLoading, isValid, isDirty },
  } = useForm<CustomerDto>({
    defaultValues: {
      name: "",
      registerNumber: null,
      contact1: null,
      contactType1: null,
      contact2: null,
      contactType2: null,
      address: null,
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: null,
      country: "Brasil",
    },
    resolver: zodResolver(customerDtoSchema),
    mode: "all", // Valida onChange + onBlur
  });

  const [contactType1, contactType2] = watch(["contactType1", "contactType2"]);

  function handleChangeContactType1(event: SelectChangeEvent<string>) {
    const selectedType = event.target.value as string;

    if (!selectedType) {
      // Se o tipo for limpo, também limpa o contato correspondente
      setValue("contact1", null);
      setValue("contactType1", null);
    } else {
      setValue("contactType1", selectedType);
    }
  }

  function handleChangeContactType2(event: SelectChangeEvent<string>) {
    const selectedType = event.target.value as string;

    if (!selectedType) {
      // Se o tipo for limpo, também limpa o contato correspondente
      setValue("contact2", null);
      setValue("contactType2", null);
    } else {
      setValue("contactType2", selectedType);
    }
  }

  const [isButtonDisabled, setIsButtonDisabled] = useState(isLoading);

  useEffect(() => {
    setOpenAlertSnackBar({
      isOpen: false,
      success: true,
      message: "",
      errorCode: null,
    });
  }, []);

  useEffect(() => {
    setIsButtonDisabled(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (!isDirty) {
      setIsButtonDisabled(true);
    } else if (isDirty && !isValid) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [isDirty, isValid, isLoading]);

  const onSubmit: SubmitHandler<CustomerDto> = async (data) => {
    const submitResponse = await createCustomerAction(data);

    setRefreshKey((k) => k + 1);
    setOpenForm(false);

    setOpenAlertSnackBar({
      isOpen: true,
      success: submitResponse.success,
      message: submitResponse.message,
      errorCode: submitResponse.errors,
    });
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={2}
            style={{
              width: "100%",
              maxWidth: 800,
            }}
          >
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
              name="registerNumber"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.registerNumber ? true : false}
                  color={errors.registerNumber ? "error" : "secondary"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="registerNumber"
                  >
                    CPF/CNPJ
                  </InputLabel>

                  <StyledOutlinedInput
                    size="small"
                    id="registerNumber"
                    label="CPF/CNPJ"
                    {...field}
                    value={field.value || ""}
                    error={errors.registerNumber ? true : false}
                  />

                  <FormHelperText
                    component="p"
                    sx={{
                      display: "flex",
                      textAlign: "end",
                      alignSelf: "end",
                      height: 6,
                    }}
                  >
                    {errors.registerNumber?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="contactType1"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.contactType1 ? true : false}
                  color={errors.contactType1 ? "error" : "secondary"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="contactType1"
                  >
                    Tipo
                  </InputLabel>

                  <Select
                    labelId="select-label-contactType1"
                    id="contactType1"
                    {...field}
                    value={field.value || ""}
                    label="Tipo"
                    size="small"
                    onChange={handleChangeContactType1}
                  >
                    <MenuItem value="">
                      <em>Selecione um tipo</em>
                    </MenuItem>

                    {Object.values(customerContactTypeType).map((type) => {
                      const description = customerContactTypeDescription[type];

                      return (
                        <MenuItem
                          key={type}
                          value={type}
                        >
                          {description}
                        </MenuItem>
                      );
                    })}
                  </Select>

                  {/* <StyledFormHelperText component="p">
                    {errors.contactType1?.message}
                  </StyledFormHelperText> */}
                </FormControl>
              )}
            />

            <Controller
              name="contact1"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.contact1 ? true : false}
                  color={errors.contact1 ? "error" : "secondary"}
                  disabled={!contactType1}
                >
                  <InputLabel
                    size="small"
                    htmlFor="contact1"
                  >
                    Contato
                  </InputLabel>

                  <StyledOutlinedInput
                    size="small"
                    id="contact1"
                    label="Contato"
                    {...field}
                    value={field.value || ""}
                    error={errors.contact1 ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.contact1
                      ? errors.contact1.message
                      : contactType1 &&
                          contactType1 !== customerContactTypeType.OTHER
                        ? "Campo obrigatório quando tipo selecionado"
                        : "Selecione um tipo de contato primeiro"}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="contactType2"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.contactType2 ? true : false}
                  color={errors.contactType2 ? "error" : "secondary"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="contactType2"
                  >
                    Tipo
                  </InputLabel>

                  <Select
                    labelId="select-label-contactType2"
                    id="contactType2"
                    {...field}
                    value={field.value || ""}
                    label="Tipo"
                    size="small"
                    onChange={handleChangeContactType2}
                  >
                    <MenuItem value="">
                      <em>Selecione um tipo</em>
                    </MenuItem>

                    {Object.values(customerContactTypeType).map((type) => {
                      const description = customerContactTypeDescription[type];

                      return (
                        <MenuItem
                          key={type}
                          value={type}
                        >
                          {description}
                        </MenuItem>
                      );
                    })}
                  </Select>

                  {/* <StyledFormHelperText component="p">
                    {errors.contactType2?.message}
                  </StyledFormHelperText> */}
                </FormControl>
              )}
            />

            <Controller
              name="contact2"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.contact2 ? true : false}
                  color={errors.contact2 ? "error" : "secondary"}
                  disabled={!contactType2}
                >
                  <InputLabel
                    size="small"
                    htmlFor="contact2"
                  >
                    Contato
                  </InputLabel>

                  <StyledOutlinedInput
                    size="small"
                    id="contact2"
                    label="Contato"
                    {...field}
                    value={field.value || ""}
                    error={errors.contact2 ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.contact2
                      ? errors.contact2.message
                      : contactType2 &&
                          contactType2 !== customerContactTypeType.OTHER
                        ? "Campo obrigatório quando tipo selecionado"
                        : "Selecione um tipo de contato primeiro"}
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
              name="zipCode"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.zipCode ? true : false}
                  color={errors.zipCode ? "error" : "secondary"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="zipCode"
                  >
                    CEP
                  </InputLabel>

                  <StyledOutlinedInput
                    size="small"
                    id="zipCode"
                    label="CEP"
                    {...field}
                    value={field.value || ""}
                    error={errors.zipCode ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.zipCode?.message}
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
              name="country"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.country ? true : false}
                  color={errors.country ? "error" : "secondary"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="country"
                  >
                    País
                  </InputLabel>

                  <StyledOutlinedInput
                    size="small"
                    id="country"
                    label="País"
                    {...field}
                    value={field.value || ""}
                    error={errors.country ? true : false}
                  />

                  <StyledFormHelperText component="p">
                    {errors.country?.message}
                  </StyledFormHelperText>
                </FormControl>
              )}
            />
          </Stack>

          {
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
          }
        </form>
      )}
    </>
  );
};
