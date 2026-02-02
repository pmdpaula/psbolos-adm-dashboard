"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoginIcon from "@mui/icons-material/Login";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Snackbar,
  type SnackbarCloseReason,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

import googleIcon from "@/assets/google-logo-color.svg";
import { type SignInFormData, signInSchema } from "@/data/dto/user-dto";
import { signInWithGoogle } from "@/http/auth/sign-in-with-google";
import type { AlertType } from "@/lib/alert";

import { signInWithEmailAndPassword } from "./actions";

// type AlertType = {
//   isOpen: boolean;
//   success: boolean;
//   message: string;
//   errorCode: string | number | null;
// };

export const SignInForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isLoading, isValid, isDirty },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
    mode: "all", // Valida onChange + onBlur
  });

  const [openAlert, setOpenAlert] = useState({
    isOpen: false,
    success: true,
    message: "",
    errorCode: null,
  } as AlertType);

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    const submitResponse = await signInWithEmailAndPassword(data);

    setOpenAlert({
      isOpen: true,
      success: submitResponse.success,
      message: submitResponse.message,
      errorCode: submitResponse.errors,
    });
  };

  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert({
      isOpen: false,
      success: true,
      message: "",
      errorCode: null,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Box>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={errors.email ? true : false}
                  color={errors.email ? "error" : "secondary"}
                >
                  <InputLabel htmlFor="email">E-mail</InputLabel>
                  <OutlinedInput
                    id="email"
                    label="E-mail"
                    {...field}
                    value={field.value || ""}
                    sx={{
                      boxShadow: errors.email
                        ? "0px 0px 12px 2px rgba(255,0,0,0.5)"
                        : "",
                    }}
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
                    {errors.email?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <Stack mb={3}>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={errors.password ? true : false}
                    color={errors.password ? "error" : "secondary"}
                  >
                    <InputLabel htmlFor="password">Senha</InputLabel>
                    <OutlinedInput
                      id="password"
                      label="Senha"
                      type="password"
                      {...field}
                      value={field.value || ""}
                      sx={{
                        boxShadow: errors.password
                          ? "0px 0px 12px 2px rgba(255,0,0,0.5)"
                          : "",
                      }}
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
                      {errors.password?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Link
                href="/auth/forgot-password"
                style={{
                  alignSelf: "flex-end",
                  marginTop: 4,
                  fontSize: "0.875rem",
                  color: "GrayText",
                }}
              >
                Esqueceu a senha?
              </Link>
            </Stack>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              sx={{ mt: 2, height: 42 }}
              disabled={isLoading || !isDirty || !isValid}
            >
              {isLoading ? (
                <CircularProgress
                  enableTrackSlot
                  size={24}
                  color="warning"
                />
              ) : (
                <Stack
                  direction="row"
                  alignItems="start"
                  justifyContent="center"
                >
                  <LoginIcon sx={{ mr: 1 }} /> Acessar
                </Stack>
              )}
            </Button>
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Typography color="GrayText">Não tem conta?</Typography>

            <Typography color="primary">
              <Link href="/auth/sign-up">Criar conta</Link>
            </Typography>
          </Stack>
        </Stack>
      </form>

      <Button
        type="button"
        variant="outlined"
        fullWidth
        size="large"
        sx={{ mt: 2, height: 42 }}
        onClick={() => signInWithGoogle()}
      >
        <Image src={googleIcon} alt="Google" height={24} width={24} />
        <span style={{ marginLeft: 8 }}>Acessar com Google</span>
      </Button>

      <Snackbar
        open={openAlert.isOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {openAlert.success ? (
          <Alert
            onClose={handleCloseAlert}
            severity="success"
          >
            {openAlert.message}
          </Alert>
        ) : (
          <Alert
            onClose={handleCloseAlert}
            severity="error"
            sx={{ width: "100%" }}
          >
            {openAlert.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};
