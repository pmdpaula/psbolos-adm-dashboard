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
  Stack,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useEffect, useState } from "react";
import {
  Controller,
  type Resolver,
  type SubmitHandler,
  useForm,
} from "react-hook-form";

import { StyledFormHelperText } from "@/components/form-fields/StyledFormHelperText";
import { StyledOutlinedInput } from "@/components/form-fields/StyledOutlinedInput";
import { GradientPaper } from "@/components/GradientPaper";
import {
  type CreatePaymentDto,
  createPaymentDtoSchema,
} from "@/data/dto/payment-dto";

import { useProjectContext } from "../../ProjectContext";
import { addPaymentToProjectAction } from "./actions";

const typedResolver = zodResolver(
  createPaymentDtoSchema,
) as Resolver<CreatePaymentDto>;

interface FormAddPaymentToProjectProps {
  projectId: string;
}

export const FormAddPaymentToProject = ({
  projectId,
}: FormAddPaymentToProjectProps) => {
  const { setOpenAlertSnackBar, setRefreshKey } = useProjectContext();

  const {
    control,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<CreatePaymentDto>({
    defaultValues: {
      projectId,
      amount: 0,
      paidDate: new Date(),
      note: "",
    },
    resolver: typedResolver,
    mode: "onChange",
  });

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

  const onSubmit: SubmitHandler<CreatePaymentDto> = async (data) => {
    const submitData = { ...data, projectId };

    const submitResponse = await addPaymentToProjectAction(submitData);

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
        <GradientPaper label="Adicionar novo pagamento ao projeto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                name="amount"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.amount ? true : false}
                    color={errors.amount ? "error" : "secondary"}
                  >
                    <InputLabel
                      size="small"
                      htmlFor="amount"
                    >
                      Valor
                    </InputLabel>

                    <StyledOutlinedInput
                      size="small"
                      id="amount"
                      label="Valor"
                      type="number"
                      {...field}
                      // value={field.value}
                      error={errors.amount ? true : false}
                      startAdornment={
                        <InputAdornment position="start">R$</InputAdornment>
                      }
                    />

                    <StyledFormHelperText component="p">
                      {errors.amount?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="paidDate"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.paidDate ? true : false}
                    color={errors.paidDate ? "error" : "secondary"}
                  >
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={ptBR}
                    >
                      <DatePicker
                        label="Data do Pagamento"
                        // value={field.value}
                        onChange={(date: Date | null) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            size: "small",
                            error: errors.paidDate ? true : false,
                          },
                        }}
                      />
                    </LocalizationProvider>

                    <StyledFormHelperText component="p">
                      {errors.paidDate?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.note ? true : false}
                    color={errors.note ? "error" : "secondary"}
                  >
                    <InputLabel
                      size="small"
                      htmlFor="note"
                    >
                      Observação
                    </InputLabel>

                    <StyledOutlinedInput
                      size="small"
                      id="note"
                      label="Observação"
                      multiline
                      rows={3}
                      {...field}
                      error={errors.note ? true : false}
                    />

                    <StyledFormHelperText component="p">
                      {errors.note?.message}
                    </StyledFormHelperText>
                  </FormControl>
                )}
              />
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
