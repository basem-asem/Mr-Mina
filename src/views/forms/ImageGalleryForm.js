import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import {
  Create_Update_Doc,
  imageUploading,
} from "src/@core/utils/firebaseutils";
import AlertMessage from "../Alert/AlertMessage";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "src/configs/firebaseConfig";

const ImageGalleryForm = ({ open, setOpen, ImageRef }) => {
  const filepreview = [];
  const [isLoading, setIsLoading] = useState(false);
  const [selectFileArr, setSelectFileArr] = useState();
  // state for error handle
  const [errorMessage, setErrorMessage] = useState({
    imageerror: "",
  });
  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  // Loop for create preview for selected images
  for (let i = 0; i < selectFileArr?.length; i++) {
    const newObject = URL.createObjectURL(selectFileArr[i]);
    filepreview.push(newObject);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!selectFileArr) {
      setIsLoading(false);
      setErrorMessage({
        imageerror: t("forms.errormessage.inputfile"),
      });
    } else {
      for (let i = 0; i < selectFileArr?.length; i++) {
        const firebase_url = await imageUploading("ImageGallary", selectFileArr[i]);
        const newDocRef = doc(collection(db, "ImageGallary"));
        await setDoc(newDocRef, {
          image: firebase_url,
        });
      }
      filepreview = [];
      setIsLoading(false);
      setSelectFileArr("");
      setOpen(false);
      //Insert Alert
      setAlertpop({
        open: true,
        message: t("data.insert"),
      });
    }
  };

  return (
    <>
      {/* Image Input */}
      <Dialog open={open} scroll="body">
        <Card>
          <CardHeader
            title={t("imagegallery.form.title")}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12} display="flex" gap="1rem">
                  <Button variant="contained" component="label">
                    {t("form.lables.Choose File")}
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        setErrorMessage("");
                        setSelectFileArr(e.target.files);
                      }}
                    />
                  </Button>
                  <Typography variant="body2" color="red" alignSelf="center">
                    {errorMessage.imageerror ? errorMessage.imageerror : ""}
                  </Typography>
                </Grid>
                {filepreview
                  ? filepreview.map((value) => (
                      <Grid item xs={6}>
                        <img
                          src={value}
                          alt="preview of seleted image"
                          height="130px"
                          style={{ borderRadius: "10px" }}
                        />
                      </Grid>
                    ))
                  : ""}
                <Grid item xs={12}>
                  {isLoading ? (
                    <Button size="large" sx={{ marginRight: 4 }}>
                      <CircularProgress />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ marginRight: 4 }}
                    >
                      {t("forms.btn.Submit")}
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setSelectFileArr("");
                      filepreview = "";
                      setIsLoading(false);
                      setErrorMessage("");
                      setOpen(false);
                    }}
                  >
                    {t("forms.btn.Cancel")}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Dialog>

      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
    </>
  );
};

export default ImageGalleryForm;
