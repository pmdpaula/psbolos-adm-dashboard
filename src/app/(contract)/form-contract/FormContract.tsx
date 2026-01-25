"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";

import { GradientPaper } from "@/components/GradientPaper";
import { companyData } from "@/data/companyData";
import {
  BatterOptions,
  FillingOptions,
  formSkeleton,
} from "@/data/formSkeleton";

export interface FormData {
  nomeCliente: string;
  dadosContratada: string;
  qtdFatias: string;
  massaBolo: string;
  recheio1: string;
  recheio2: string;
  recheio3: string;
  observacoesBolo: string;
  modeloBolo: string;
  valorBolo: string;
  sinalBolo: string;
  saldoBolo: string;
  formaPagamentoBolo: string;
  localEntrega: string;
  dataEntrega: string;
  horaEntrega: string;
  telefoneCliente: string;
  telefoneAdicional: string;
  nomeContatoEvento: string;
  telefoneContatoEvento: string;
}

export const initialFormState: FormData = {
  nomeCliente: "",
  dadosContratada: `${companyData.representativeName}, ${companyData.representativeRole}, representante da ${companyData.name}, localizada na ${companyData.address} , inscrita no ${companyData.companyIdType}: ${companyData.companyIdNumber}`,
  qtdFatias: "",
  massaBolo: "",
  recheio1: "",
  recheio2: "",
  recheio3: "",
  observacoesBolo: "",
  modeloBolo: "",
  valorBolo: "",
  sinalBolo: "",
  saldoBolo: "",
  formaPagamentoBolo: "",
  localEntrega: "",
  dataEntrega: "",
  horaEntrega: "",
  telefoneCliente: "",
  telefoneAdicional: "",
  nomeContatoEvento: "",
  telefoneContatoEvento: "",
};

const FormContract = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);

  useEffect(() => {
    const checkAvaibilityOfFormData = async () => {
      const isFormDataAvailable = hasCookie("formData");
      const availableFormData = isFormDataAvailable
        ? (JSON.parse((await getCookie("formData")) as string) as FormData)
        : initialFormState;

      setFormData(availableFormData);
    };

    checkAvaibilityOfFormData();
  }, []);

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setCookie("formData", JSON.stringify(formData), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 1 month
    });
  }, [formData]);

  return (
    <form>
      {formSkeleton.map((section) => (
        <GradientPaper
          key={section.step}
          label={section.label}
        >
          <Stack
            spacing={2}
            mb={2}
          >
            {section.fields.map((field) => (
              <Box key={field.name}>
                {field.name === "saldoBolo" ? (
                  <TextField
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    value={
                      Number(formData.valorBolo) - Number(formData.sinalBolo)
                    }
                    disabled
                    fullWidth
                    size="small"
                  />
                ) : (
                  (field.type === "text" ||
                    field.type === "number" ||
                    field.type === "date" ||
                    field.type === "textarea") && (
                    <TextField
                      id={field.name}
                      name={field.name}
                      label={field.label}
                      type={field.type}
                      value={formData[field.name as keyof FormData]}
                      onChange={handleInputChange}
                      required={field.required}
                      disabled={field.disabled}
                      fullWidth
                      size="small"
                      multiline={field.type === "textarea"}
                      minRows={field.type === "textarea" ? 3 : undefined}
                    />
                  )
                )}

                {field.type === "selection" && (
                  <FormControl
                    fullWidth
                    size="small"
                  >
                    <InputLabel id={`select-label-${field.name}`}>
                      {field.label}
                    </InputLabel>
                    <Select
                      labelId={`select-label-${field.name}`}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name as keyof FormData]}
                      label={field.label}
                      onChange={handleSelectChange}
                    >
                      {field.name === "massaBolo" &&
                        BatterOptions.map((option) => (
                          <MenuItem
                            key={option}
                            value={option}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      {field.name.startsWith("recheio") &&
                        FillingOptions.map((option) => (
                          <MenuItem
                            key={option}
                            value={option}
                          >
                            {option}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            ))}
          </Stack>
        </GradientPaper>
      ))}
    </form>
  );
};

export default FormContract;
