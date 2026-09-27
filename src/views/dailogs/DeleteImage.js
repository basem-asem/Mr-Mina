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

const DeleteImage = ({ showPop, setShowPop, deleteImage, handleDelete }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Dialog for delete Image */}
      <Dialog
        open={showPop}
        onClose={() => {
          setShowPop(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("dailog.delete.image.message")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText textAlign="center">
            <img
              src={deleteImage}
              alt="preview of seleted image"
              height="300px"
              style={{ borderRadius: "5px" }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowPop(false);
            }}
          >
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

export default DeleteImage;
