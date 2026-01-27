import { Alert, Snackbar, type SnackbarCloseReason } from "@mui/material";

import { useMainContext } from "@/app/MainContext";

export const MainContextSnackbar = () => {
  const { openAlertSnackBar, setOpenAlertSnackBar } = useMainContext();

  function handleCloseAlert(
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlertSnackBar({
      isOpen: false,
      success: true,
      message: "",
      errorCode: null,
    });
  }

  return (
    <Snackbar
      open={openAlertSnackBar.isOpen}
      autoHideDuration={5000}
      onClose={handleCloseAlert}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleCloseAlert}
        severity={openAlertSnackBar.success ? "success" : "error"}
        sx={{ textAlign: "right" }}
      >
        {openAlertSnackBar.message}
      </Alert>
    </Snackbar>
  );
};
