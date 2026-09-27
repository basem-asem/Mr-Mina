import { Alert, Snackbar } from "@mui/material";
import React from "react";

const AlertMessage = (props) => {
  const { Alertpop, setAlertpop } = props;

  return (
    <Snackbar
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={Alertpop.open}
      onClose={() =>
        setAlertpop({
          open: false,
        })
      }
    >
      <Alert severity="success">{Alertpop.message}</Alert>
    </Snackbar>
  );
};

export default AlertMessage;
