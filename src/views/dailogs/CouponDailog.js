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

const CouponDailog = ({ CouponPop, handlePopclose }) => {
  const { t } = useTranslation();
  let Coupon_Update_Data;

  const handel_Status_Update = () => {
    if (CouponPop.isapproving) {
      Coupon_Update_Data = {
        Status: "active",
      };
    } else {
      Coupon_Update_Data = {
        Status: "Cancelled",
      };
    }

    Create_Update_Doc("Offers", Coupon_Update_Data, CouponPop.couponId).then(
      (action_message) => {
        handlePopclose(action_message);
      }
    );
  };

  return (
    <>
      <Dialog
        open={CouponPop.open}
        onClose={() => handlePopclose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {CouponPop.isapproving
            ? t("dailog.block.title.approve")
            : t("dailog.block.title.Reject")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {CouponPop.isapproving
              ? t("dailog.coupon.approve.message")
              : t("dailog.coupon.reject.message")}
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

export default CouponDailog;
