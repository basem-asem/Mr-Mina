import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "src/configs/firebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import AlertMessage from "src/views/Alert/AlertMessage";
import useTranslation from "src/@core/hooks/useTranslation";
import { useRouter } from "next/router";

function SubCategory(props) {
  // ** States
  const [AreaEN, setAreaEN] = useState();
  const [AreaAR, setAreaAR] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [SubCategoryId, setSubCategoryId] = useState("");
  const [open, setOpen] = useState(false);
  const [deletefilePath, setdeletefilePath] = useState();
  const [file, setFile] = useState();
  const [imageAsFile, setImageAsFile] = useState("");
  // const [categoryName, setCategoryName] = useState(props.Categories.category);
// console.log('props', categoryName);
  // state for error handle
  const [errorMessage, setErrorMessage] = useState({
    categoryError: "",
    nameError: "",
    imageError: "",
  });
  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const router = useRouter();
  const { t } = useTranslation(router?.locale);

  useEffect(() => {
    setAlertpop({
      open: false,
      message: "",
    });
  }, []);

  // ** Add Subscription Packages
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    AreaEN = AreaEN.trim();
    AreaAR = AreaAR.trim();
    if (!SubCategoryId) {
      setIsLoading(false);
      setErrorMessage({
        categoryError: t("form.errormessage.categoryerror"),
      });
    } else if (!AreaEN) {
      setIsLoading(false);
      setErrorMessage({
        nameError: t("form.errormessage.nameerror"),
      });
    } else if (!AreaAR) {
      setIsLoading(false);
      setErrorMessage({
        nameError: t("form.errormessage.nameerror"),
      });
    } else {if(props.SubcategoryEditId && SubCategoryId !== props.CategoriesEditId) {
              const oldSubCategory = doc(db, "categories",props.CategoriesEditId ,"requests",props.SubcategoryEditId)
              await deleteDoc(oldSubCategory)
                const newCityRef = doc(
                  collection(db, "categories", SubCategoryId, "requests")
                );
                await setDoc(newCityRef, {
                  areaEN: AreaEN,
                  areaAR: AreaAR,
                }).then(() => {
                  setErrorMessage("");
                  setAreaEN("");
                  setAreaAR("");
                  setSubCategoryId("");
                  setIsLoading(false);
                  props.handleClose();
                  //Insert Alert
                  setAlertpop({
                    open: true,
                    message: t("data.insert"),
                  });
                });
            } else if (props.SubcategoryEditId) {
                const updatePLAN = doc(
                  db,
                  "categories",
                  props.CategoriesEditId,
                  "requests",
                  props.SubcategoryEditId
                );
                await updateDoc(updatePLAN, {
                  areaEN: AreaEN,
                  areaAR: AreaAR,
                }).then(() => {
                  setErrorMessage("");
                  setAreaAR("");
                  setAreaEN("");
                  setIsLoading(false);
                  setFile();
                  props.handleClose();
                  // Update Alert
                  setAlertpop({
                    open: true,
                    message: t("data.update"),
                  });
                });
              }else{
              const newCityRef = doc(
                collection(db, "categories", SubCategoryId, "requests")
              );
              await setDoc(newCityRef, {
                areaEN: AreaEN,
                areaAR: AreaAR,
              }).then(() => {
                setErrorMessage("");
                setAreaEN("");
                setAreaAR("");
                setSubCategoryId("");
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
  };

  useEffect(() => {
    const fetchserviceDetail = async () => {
      setSubCategoryId(props.CategoriesEditId);
      const Subdocref = doc(
        db,
        "categories",
        props.CategoriesEditId,
        "requests",
        props.SubcategoryEditId
        );
        const SubdocSnap = await getDoc(Subdocref);
      if (SubdocSnap.exists()) {
        const SubdocData = SubdocSnap.data();
        setAreaEN(SubdocData.areaEN);
        setAreaAR(SubdocData.areaAR);
      } else {
        console.log("No such document!");
      }
    };
    
    if (props.SubcategoryEditId) {
      fetchserviceDetail();
    } else {
      setAreaEN("");
    }
  }, [props.SubcategoryEditId]);
  
  console.log(SubCategoryId);
  console.log(props.CategoriesEditId);
  return (
    <div>
      <Dialog open={props.openSubService}>
        <Card>
          <CardHeader
            title={
              props.SubcategoryEditId ? `${t("cities.editArea")}` : `${t("cities.newArea")}`
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <FormControl sx={{ m: 1 }} fullWidth>
                    <InputLabel id="demo-controlled-open-select-label">
                    {t("cities.selectCity")}
                    </InputLabel>
                    <Select
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      open={open}
                      onClose={() => setOpen(false)}
                      onOpen={() => setOpen(true)}
                      value={SubCategoryId}
                      label={t("cities.selectCity")}
                      error={errorMessage.categoryError ? true : false}
                      onChange={(e) => setSubCategoryId(e.target.value)}
                    >
                      {props.Categories && props.Categories.map((value, index) => (
                        router.locale == "ar"? (<MenuItem value={value.id} key={index}>
                          {value.nameAR}
                        </MenuItem>): (<MenuItem value={value.id} key={index}>
                          {value.nameEN}
                        </MenuItem>)
                      ))}
                    </Select>
                    <FormHelperText style={{ color: "red" }}>
                      {errorMessage.categoryError
                        ? errorMessage.categoryError
                        : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("cities.AreanameEN")}
                    value={AreaEN}
                    helperText={
                      errorMessage.nameError ? errorMessage.nameError : ""
                    }
                    error={errorMessage.nameError ? true : false}
                    onChange={(e) => {
                      setAreaEN(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("cities.AreanameAR")}
                    value={AreaAR}
                    helperText={
                      errorMessage.nameError ? errorMessage.nameError : ""
                    }
                    error={errorMessage.nameError ? true : false}
                    onChange={(e) => {
                      setAreaAR(e.target.value);
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
                      {props.SubcategoryEditId ? `${t("forms.btn.Update")}` : `${t("forms.btn.Submit")}`}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setErrorMessage("");
                      setSubCategoryId("");
                      setAreaEN("");
                      setAreaAR("");
                      setFile();
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
    </div>
  );
}

export default SubCategory;
