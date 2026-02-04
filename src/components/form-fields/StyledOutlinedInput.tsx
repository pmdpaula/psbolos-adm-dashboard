"use client";

import { alpha, OutlinedInput, styled } from "@mui/material";

export const StyledOutlinedInput = styled(OutlinedInput, {
  shouldForwardProp: (prop) => prop !== "error",
})<{ error?: boolean }>(({ error, theme }) => ({
  // boxShadow: error ? "0px 0px 12px 2px rgba(255,0,0,0.5)" : "",
  boxShadow: error
    ? `0px 0px 12px 2px ${alpha(theme.palette.error.main, 0.8)}`
    : "",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: error ? theme.palette.error.main : "",
  },
}));
