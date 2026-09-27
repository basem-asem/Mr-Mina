import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { db } from "src/configs/firebaseConfig";

const BlockDailog = ({ Blockpop, handlePopclose }) => {
  const { t } = useTranslation();

  const handleDelete = () => {
    const userRef = doc(db, "user", Blockpop.blockid);
    setDoc(userRef, { IsBlocked: !Blockpop.isblock }, { merge: true }).then(
      () => {
        handlePopclose();
      }
    );
  };

  return (
    <>
      <Dialog
        open={Blockpop.open}
        onClose={handlePopclose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("dailog.block.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {Blockpop.isblock
              ? t("dailog.unblock.message")
              : t("dailog.block.message")}
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

export default BlockDailog;
