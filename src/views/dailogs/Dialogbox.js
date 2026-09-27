import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from "@mui/material";
  import React from "react";
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "src/configs/firebaseConfig";
  import { useRouter } from "next/router";
import useTranslation from "src/@core/hooks/useTranslation";
  
  const BlockDialog = ({ Blockpop, handlePopclose }) => {
    const router = useRouter();
    const { t } = useTranslation(router?.locale);
  
    const handleDelete = () => {
      const userRef = doc(db, "users", Blockpop.blockid);
      if (Blockpop.isAllowed == "q"){
        setDoc(userRef, { IsBlock: !Blockpop.isblock }, { merge: true }).then(
          () => {
            handlePopclose();
          }
        );
      }else if (Blockpop.isblock == "q"){
        setDoc(userRef, {  isAllowed: !Blockpop.isAllowed}, { merge: true }).then(
          () => {
            handlePopclose();
          }
          );
        }
    };
    console.log(Blockpop)
  
    return (
      <>
        <Dialog
          open={Blockpop.open}
          onClose={handlePopclose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {Blockpop.isblock ? `${t("form.dialogtitle.unblock")}`:`${t("form.dialogtitle.block")}`}
            </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {Blockpop.isblock
                ? `${t("form.confirmunblockcontent")}`
                : `${t("form.confirmblockcontent")}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePopclose}>{t("form.btn.disagree")}</Button>
            <Button onClick={handleDelete} autoFocus>
            {t("form.btn.agree")}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
  
  export default BlockDialog;
  