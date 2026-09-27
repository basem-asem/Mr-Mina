import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "src/configs/firebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgress, Typography } from "@mui/material";
import AlertMessage from "src/views/Alert/AlertMessage";
import useTranslation from "src/@core/hooks/useTranslation";
import { useRouter } from "next/router";

function Categoryform(props) {
  // ** States
  const [categoryTitle, setCategoryTitle] = useState();
  const [categoryTitleAr, setCategoryTitleAr] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [deletefilePath, setdeletefilePath] = useState();
  const [file, setFile] = useState();
  const [errorMessage, setErrorMessage] = useState({
    NameError: "",
    imageError: "",
  });
  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const router = useRouter();
  const { t } = useTranslation(router?.locale);

  // ** Add category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    categoryTitle = categoryTitle.trim();
    categoryTitleAr = categoryTitleAr.trim();
    if (!categoryTitle) {
      setIsLoading(false);
      setErrorMessage({
        NameError: t("forms.errormessage.inputText"),
      });
    } else if (!categoryTitleAr) {
      setIsLoading(false);
      setErrorMessage({
        NameError: t("forms.errormessage.inputText"),
      });
    } else {
            if (props.CategoriesEditId) {
              const updatePLAN = doc(db, "categories", props.CategoriesEditId);
              await updateDoc(updatePLAN, {
                nameEN: categoryTitle,
                nameAR: categoryTitleAr,
              }).then(() => {
                setErrorMessage("");
                setCategoryTitle("");
                setCategoryTitleAr("");
                setIsLoading(false);
                props.handleClose();
                //Update Alert
                setAlertpop({
                  open: true,
                  message: t("data.update"),
                });
              });
            } else {
              const newCityRef = doc(collection(db, "categories"));
              await setDoc(newCityRef, {
                nameEN: categoryTitle,
                nameAR: categoryTitleAr,
              }).then(() => {
                setErrorMessage("");
                setCategoryTitle("");
                setCategoryTitleAr("");
                setIsLoading(false);
                props.handleClose();
                //Insert Alert
                setAlertpop({
                  open: true,
                  message: t("data.insert"),
                });
              });
            }
          }
        }


  useEffect(() => {
    const fetchserviceDetail = async () => {
      const docRef = doc(db, "categories", props.CategoriesEditId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCategoryTitle(data.nameEN);
        setCategoryTitleAr(data.nameAR)
      } else {
        console.log("No such document!");
      }
    };

    if (props.CategoriesEditId) {
      fetchserviceDetail();
    } else {
      setCategoryTitle("");
      setCategoryTitleAr("");
    }
  }, [props.CategoriesEditId]);

  return (
    <>
      <Dialog open={props.open}>
        <Card>
          <CardHeader
            title={
              props.CategoriesEditId ? `${t("cities.editCity")}` : `${t("cities.newCity")}`
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("cities.nameEN")}
                    value={categoryTitle}
                    helperText={
                      errorMessage.NameError ? errorMessage.NameError : ""
                    }
                    error={errorMessage.NameError ? true : false}
                    onChange={(e) => {
                      setCategoryTitle(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("cities.nameAR")}
                    value={categoryTitleAr}
                    helperText={
                      errorMessage.NameError ? errorMessage.NameError : ""
                    }
                    error={errorMessage.NameError ? true : false}
                    onChange={(e) => {
                      setCategoryTitleAr(e.target.value);
                    }}
                  />
                </Grid>
                
                {/* <Grid item xs={12} display="flex" gap="1rem">
                  <Button variant="contained" component="label">
                    {t("form.btn.choosefile")}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        setErrorMessage("");
                        setImageAsFile((imageFile) => e.target.files[0]);
                        setFile(URL.createObjectURL(e.target.files[0]));
                      }}
                    />
                  </Button>
                  <Typography variant="body2" color="red" alignSelf="center">
                    {errorMessage.imageError ? errorMessage.imageError : ""}
                  </Typography>
                </Grid>
                {file ? (
                  <Grid item xs={12} textAlign="center">
                    <img
                      src={file}
                      alt="preview of seleted image"
                      height="150px"
                      style={{ borderRadius: "10px" }}
                    />
                  </Grid>
                ) : (
                  ""
                )} */}
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
                      {props.CategoriesEditId ? `${t("forms.btn.Update")}` : `${t("forms.btn.Submit")}`}
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setErrorMessage("");
                      setCategoryTitle("");
                      setCategoryTitleAr("");
                      setIsLoading(false);
                      props.handleClose();
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
}

export default Categoryform;