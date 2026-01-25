"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
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
  type SelectChangeEvent,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { StyledFormHelperText } from "@/components/form-fields/StyledFormHelperText";
import { StyledInput } from "@/components/form-fields/StyledInput";
import { StyledOutlinedInput } from "@/components/form-fields/StyledOutlinedInput";
import { type CustomerDto, customerDtoSchema } from "@/data/dto/customer-dto";
import {
  customerContactTypeDescription,
  customerContactTypeType,
} from "@/lib/customer-contact-type";

import { deleteCustomerAction, editCustomerAction } from "./action";
import { useCustomerContext } from "./CustomerContext";

// export const StyledOutlinedInput = styled(OutlinedInput, {
//   shouldForwardProp: (prop) => prop !== "error",
// })<{ error?: boolean }>(({ error }) => ({
//   boxShadow: error ? "0px 0px 12px 2px rgba(255,0,0,0.5)" : "",
// }));

// export const StyledInput = styled(Input, {
//   shouldForwardProp: (prop) => prop !== "error",
// })<{ error?: boolean }>(({ error }) => ({
//   boxShadow: error ? "0px 0px 12px 2px rgba(255,0,0,0.5)" : "",
// }));

export const FormCustomer = () => {
  const { openForm, setOpenForm, setOpenAlertSnackBar, customerContext } =
    useCustomerContext();

  const action = openForm.action;

  if (action === "edit" && !customerContext) {
    throw new Error("Os dados do cliente são obrigatórios para edição.");
  }

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isLoading, isValid, isDirty },
  } = useForm<CustomerDto>({
    defaultValues: {
      ...customerContext,
      registerNumber: customerContext.registerNumber || null,
      contactType1: customerContext.contactType1 || null,
      contact1: customerContext.contact1 || null,
      contactType2: customerContext.contactType2 || null,
      contact2: customerContext.contact2 || null,
      address: customerContext.address || null,
      city: customerContext.city || null,
      state: customerContext.state || null,
      zipCode: customerContext.zipCode || null,
      country: customerContext.country || null,
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
    setIsButtonDisabled(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (action === "edit") {
      if (!isDirty || (isDirty && !isValid)) {
        setIsButtonDisabled(true);
      } else {
        setIsButtonDisabled(false);
      }
    } else {
      // delete
      setIsButtonDisabled(isLoading);
    }
  }, [isDirty, isValid, action, isLoading]);

  const onSubmit: SubmitHandler<CustomerDto> = async (data) => {
    let submitResponse;

    if (action === "edit") {
      submitResponse = await editCustomerAction(data);
    } else {
      submitResponse = await deleteCustomerAction(data.id!);
    }

    if (submitResponse.success) {
      setOpenForm({ open: false, action: "none" });
    }

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
            alignSelf="center"
            justifyContent="center"
            sx={{ mt: 2, maxWidth: 600 }}
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
                  variant={action === "delete" ? "standard" : "outlined"}
                >
                  <InputLabel
                    htmlFor="name"
                    size="small"
                  >
                    Nome
                  </InputLabel>
                  {action === "delete" ? (
                    <StyledInput
                      size="small"
                      id="name"
                      {...field}
                      value={field.value}
                      disabled={action === "delete"}
                    />
                  ) : (
                    <StyledOutlinedInput
                      size="small"
                      id="name"
                      label="Nome"
                      {...field}
                      value={field.value || ""}
                      error={errors.name ? true : false}
                    />
                  )}

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
                  disabled={action === "delete"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="registerNumber"
                  >
                    CPF/CNPJ
                  </InputLabel>
                  {action === "delete" ? (
                    <StyledInput
                      size="small"
                      id="registerNumber"
                      {...field}
                      value={field.value || ""}
                      disabled={action === "delete"}
                    />
                  ) : (
                    <StyledOutlinedInput
                      size="small"
                      id="registerNumber"
                      label="CPF/CNPJ"
                      {...field}
                      value={field.value || ""}
                      error={errors.registerNumber ? true : false}
                    />
                  )}

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
                  variant={action === "delete" ? "standard" : "outlined"}
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
                    disabled={action === "delete"}
                  >
                    <MenuItem>...</MenuItem>

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
                  variant={action === "delete" ? "standard" : "outlined"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="contact1"
                  >
                    Contato
                  </InputLabel>
                  {action === "delete" ? (
                    <StyledInput
                      size="small"
                      id="contact1"
                      {...field}
                      value={field.value || ""}
                      disabled={action === "delete"}
                    />
                  ) : (
                    <StyledOutlinedInput
                      size="small"
                      id="contact1"
                      label="Contato"
                      {...field}
                      value={field.value || ""}
                      error={errors.contact1 ? true : false}
                    />
                  )}

                  <StyledFormHelperText component="p">
                    {errors.contact1?.message}
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
                  variant={action === "delete" ? "standard" : "outlined"}
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
                    disabled={action === "delete"}
                  >
                    <MenuItem>...</MenuItem>

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

                  {action === "delete" ? (
                    <StyledInput
                      size="small"
                      id="contact2"
                      {...field}
                      value={field.value || ""}
                      disabled={action === "delete"}
                    />
                  ) : (
                    <StyledOutlinedInput
                      size="small"
                      id="registerNumber"
                      label="CPF/CNPJ"
                      {...field}
                      value={field.value || ""}
                      error={errors.contact2 ? true : false}
                    />
                  )}

                  <StyledFormHelperText component="p">
                    {errors.contact2
                      ? errors.contact2.message
                      : "habilitado quando o telefone 1 for preenchido"}
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
                  disabled={action === "delete"}
                  variant={action === "delete" ? "standard" : "outlined"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="address"
                  >
                    Endereço
                  </InputLabel>
                  {action === "delete" ? (
                    <StyledInput
                      size="small"
                      id="address"
                      {...field}
                      value={field.value}
                      disabled={action === "delete"}
                    />
                  ) : (
                    <StyledOutlinedInput
                      size="small"
                      id="address"
                      label="Endereço"
                      {...field}
                      value={field.value || ""}
                      error={errors.address ? true : false}
                    />
                  )}

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
                  disabled={action === "delete"}
                  variant={action === "delete" ? "standard" : "outlined"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="zipCode"
                  >
                    CEP
                  </InputLabel>
                  {action === "delete" ? (
                    <StyledInput
                      size="small"
                      id="zipCode"
                      {...field}
                      value={field.value || ""}
                      disabled={action === "delete"}
                    />
                  ) : (
                    <StyledOutlinedInput
                      size="small"
                      id="zipCode"
                      label="CEP"
                      {...field}
                      value={field.value || ""}
                      error={errors.zipCode ? true : false}
                    />
                  )}

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
                  disabled={action === "delete"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="city"
                  >
                    Cidade
                  </InputLabel>
                  {action === "delete" ? (
                    <StyledInput
                      size="small"
                      id="city"
                      {...field}
                      value={field.value || ""}
                      disabled={action === "delete"}
                    />
                  ) : (
                    <StyledOutlinedInput
                      size="small"
                      id="city"
                      label="Cidade"
                      {...field}
                      value={field.value || ""}
                      error={errors.city ? true : false}
                    />
                  )}

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
                  disabled={action === "delete"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="state"
                  >
                    Estado
                  </InputLabel>
                  {action === "delete" ? (
                    <StyledInput
                      size="small"
                      id="state"
                      {...field}
                      value={field.value}
                      disabled={action === "delete"}
                    />
                  ) : (
                    <StyledOutlinedInput
                      size="small"
                      id="state"
                      label="Estado"
                      {...field}
                      value={field.value || ""}
                      error={errors.state ? true : false}
                    />
                  )}

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
                  disabled={action === "delete"}
                >
                  <InputLabel
                    size="small"
                    htmlFor="country"
                  >
                    País
                  </InputLabel>
                  {action === "delete" ? (
                    <StyledInput
                      size="small"
                      id="country"
                      {...field}
                      value={field.value}
                      disabled={action === "delete"}
                    />
                  ) : (
                    <StyledOutlinedInput
                      size="small"
                      id="country"
                      label="País"
                      {...field}
                      value={field.value || ""}
                      error={errors.country ? true : false}
                    />
                  )}

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
              color={action === "delete" ? "error" : "secondary"}
              fullWidth
              size="large"
              sx={{ mt: 5, height: 42 }}
              disabled={isButtonDisabled}
              startIcon={
                isLoading ? (
                  <CircularProgress size={24} />
                ) : action === "delete" ? (
                  <DeleteSharpIcon fontSize="small" />
                ) : (
                  <SaveIcon fontSize="small" />
                )
              }
            >
              {action === "delete" ? "Deletar" : "Salvar"}
            </Button>
          }
        </form>
      )}
    </>
  );
};
