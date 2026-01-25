import {
  FormHelperText,
  type FormHelperTextProps,
  styled,
} from "@mui/material";

export const StyledFormHelperText = styled(FormHelperText)<FormHelperTextProps>(
  {
    display: "flex",
    textAlign: "end",
    alignSelf: "end",
    height: 6,
  },
);
