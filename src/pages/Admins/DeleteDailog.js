import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import useTranslation from "src/@core/hooks/useTranslation";

const DeleteDailog = ({ showPop, handlePopclose, handleDelete }) => {
  const { t } = useTranslation();

  return (
    <>
      <Dialog
        open={showPop}
        onClose={handlePopclose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("dailog.delete.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("dailog.delete.message")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopclose}>
            {t("dailog.btn.disagree")}
          </Button>
          <Button onClick={handleDelete} autoFocus>
            {t("dailog.btn.agree")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteDailog;
