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
import { Create_Update_Doc } from "src/@core/utils/firebaseutils";

const WithdrawDailog = ({ WithdrawPop, handlePopclose }) => {
  const { t } = useTranslation();
  let Withdraw_Update;

  const handel_Status_Update = () => {
    if (WithdrawPop.isapproving) {
      Withdraw_Update = {
        Status: "Accepted",
      };
    } else {
      Withdraw_Update = {
        Status: "Rejected",
      };
    }

    Create_Update_Doc("Withdraw", Withdraw_Update, WithdrawPop.withdrawId).then(
      (action_message) => {
        handlePopclose(action_message);
      }
    );
  };

  return (
    <>
      <Dialog
        open={WithdrawPop.open}
        onClose={() => handlePopclose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {WithdrawPop.isapproving
            ? t("dailog.block.title.approve")
            : t("dailog.block.title.Reject")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {WithdrawPop.isapproving
              ? t("dailog.approve.message")
              : t("dailog.reject.message")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlePopclose()}>
            {t("dailog.btn.disagree")}
          </Button>
          <Button onClick={handel_Status_Update} autoFocus>
            {t("dailog.btn.agree")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WithdrawDailog;
