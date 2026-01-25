import { Input, styled } from "@mui/material";

export const StyledInput = styled(Input, {
  shouldForwardProp: (prop) => prop !== "error",
})<{ error?: boolean }>(({ error }) => ({
  boxShadow: error ? "0px 0px 12px 2px rgba(255,0,0,0.5)" : "",
}));
