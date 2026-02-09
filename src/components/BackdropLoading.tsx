import { Backdrop, CircularProgress } from "@mui/material";

type BackdropLoadingProps = {
  isLoading: boolean;
};

export const BackdropLoading = ({ isLoading }: BackdropLoadingProps) => {
  return (
    <Backdrop open={isLoading}>
      <CircularProgress
        color="primary"
        size={60}
        thickness={8}
      />
    </Backdrop>
  );
};
