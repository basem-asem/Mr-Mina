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
} from "firebase/firestore";
import { db } from "src/configs/firebaseConfig";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import AlertMessage from "../Alert/AlertMessage";
import useTranslation from "src/@core/hooks/useTranslation";
import { imageUploading } from "src/@core/utils/firebaseutils";

const SubService = (props) => {
  // ** States
  const [serviceName, setserviceName] = useState();
  const [imageAsFile, setImageAsFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState();

  const [Category, setCategory] = useState({
    Id: "",
    Name: "",
  });
  const [open, setOpen] = useState(false);

  // state for error handle
  const [errorMessage, setErrorMessage] = useState({
    categoryerror: "",
    nameerror: "",
    imageerror: "",
  });

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  // Create new Sub Category
  const createSubCategory = async (imageurl) => {
    const newSubCategory = doc(
      collection(db, "category", Category.Id, "SubCategory")
    );
    await setDoc(newSubCategory, {
      category: Category.Name,
      name: serviceName,
      image: imageurl,
    }).then(async () => {
      setErrorMessage("");
      setserviceName("");
      setImageAsFile("");
      setFile("");
      setIsLoading(false);
      props.handleClose();
      if (props.subCategoryId) {
        // Update Alert
        setAlertpop({
          open: true,
          message: t("data.update"),
        });
      } else {
        // Insert Alert
        setAlertpop({
          open: true,
          message: t("data.insert"),
        });
      }
    });
  };

  // Update Sub Category
  const updateSubCategory = async (imageurl) => {
    const updateSubCategory = doc(
      db,
      "category",
      Category.Id,
      "SubCategory",
      props.subCategoryId
    );
    await updateDoc(updateSubCategory, {
      name: serviceName,
      image: imageurl,
    }).then(() => {
      setErrorMessage("");
      setserviceName("");
      setImageAsFile("");
      setFile("");
      setIsLoading(false);
      props.handleClose();

      // Update Alert
      setAlertpop({
        open: true,
        message: t("data.update"),
      });
    });
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    serviceName = serviceName.trim();
    if (!Category.Id) {
      setIsLoading(false);
      setErrorMessage({
        categoryerror: t("forms.errormessage.select"),
      });
    } else if (!serviceName) {
      setIsLoading(false);
      setErrorMessage({
        nameerror: t("forms.errormessage.inputText"),
      });
    } else if (!imageAsFile && !file) {
      setIsLoading(false);
      setErrorMessage({
        imageerror: t("forms.errormessage.inputfile"),
      });
    } else {
      imageUploading("SubCategory", imageAsFile).then((firebase_url) => {
        if (props.subCategoryId) {
          if (imageAsFile) {
            file = firebase_url;
          }

          if (props.CategoryId == Category.Id) {
            updateSubCategory(file);
          } else {
            createSubCategory(file);
            handleDelete();
          }
        } else {
          createSubCategory(firebase_url);
        }
      });
    }
  };

  const handleDelete = async () => {
    await deleteDoc(
      doc(db, "category", props.CategoryId, "SubCategory", props.subCategoryId)
    ).then(async () => {
      props.handleClose();

      // Delete Alert
      setAlertpop({
        open: true,
        message: t("data.delete"),
      });
    });
  };

  useEffect(() => {
    const fetchserviceDetail = async () => {
      setCategory({
        Id: props.CategoryId,
      });

      const Subdocref = doc(
        db,
        "category",
        props.CategoryId,
        "SubCategory",
        props.subCategoryId
      );
      const SubdocSnap = await getDoc(Subdocref);
      if (SubdocSnap.exists()) {
        const SubdocData = SubdocSnap.data();
        setserviceName(SubdocData.name);
        setFile(SubdocData.image);
      }
    };

    if (props.subCategoryId) {
      fetchserviceDetail();
    } else {
      setserviceName("");
      setImageAsFile("");
      setFile("");
    }
  }, [props.subCategoryId]);

  return (
    <div>
      <Dialog open={props.openSubService}>
        <Card>
          <CardHeader
            title={
              props.subCategoryId
                ? t("subcategory.page.form.edit")
                : t("subcategory.page.form.add")
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <FormControl sx={{ m: 1 }} fullWidth>
                    <InputLabel id="demo-controlled-open-select-label">
                      {t("subcategory.page.form.selectCategory")}
                    </InputLabel>
                    <Select
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      open={open}
                      onClose={() => setOpen(false)}
                      onOpen={() => setOpen(true)}
                      value={Category.Id}
                      label={t("subcategory.page.form.selectCategory")}
                      error={errorMessage.categoryerror ? true : false}
                    >
                      {props.categories.map((value) => (
                        <MenuItem
                          value={value.docid}
                          id={value.category}
                          key={value.docid}
                          onClick={(e) => {
                            setCategory({
                              // Id store Selected item Id
                              Id: e.target.dataset.value,

                              // Name Store Selected Item name
                              Name: e.target.id,
                            });
                          }}
                        >
                          {value.category}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText style={{ color: "red" }}>
                      {errorMessage.categoryerror
                        ? errorMessage.categoryerror
                        : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("subcategory.page.form.Name")}
                    value={serviceName}
                    placeholder="Home Cleaning"
                    helperText={
                      errorMessage.nameerror ? errorMessage.nameerror : ""
                    }
                    error={errorMessage.nameerror ? true : false}
                    onChange={(e) => {
                      setserviceName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} display="flex" gap="1rem">
                  <Button variant="contained" component="label">
                    {t("form.lables.Choose File")}
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
                    {errorMessage.imageerror ? errorMessage.imageerror : ""}
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
                )}
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
                      {props.subCategoryId
                        ? t("forms.btn.Update")
                        : t("forms.btn.Submit")}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setErrorMessage("");
                      setCategory("");
                      setserviceName("");
                      setImageAsFile("");
                      setFile("");
                      setIsLoading(false);
                      props.handleClose();
                    }}
                  >
                    {t("forms.btn.Cancel")}
                  </Button>
                  {props.subCategoryId ? (
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ float: "right" }}
                      size="large"
                      onClick={() => {
                        handleDelete();
                      }}
                    >
                      {t("forms.btn.Delete")}
                    </Button>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Dialog>
      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
    </div>
  );
};

export default SubService;
