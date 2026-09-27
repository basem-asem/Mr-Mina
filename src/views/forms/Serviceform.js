import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import {
  Create_Update_Doc,
  imageUploading,
} from "src/@core/utils/firebaseutils";
import { db } from "src/configs/firebaseConfig";
import AlertMessage from "../Alert/AlertMessage";

const Serviceform = (props) => {
  // ** States
  const [serviceName, setserviceName] = useState();
  const [imageAsFile, setImageAsFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState();

  // state for error handle
  const [errorMessage, setErrorMessage] = useState({
    nameerror: "",
    imageerror: "",
  });

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  // ** Add Subscription Packages
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    serviceName = serviceName.trim();

    if (!serviceName) {
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
      imageUploading("categoryImages", imageAsFile).then((firebase_url) => {
        if (imageAsFile) {
          file = firebase_url;
        }

        Create_Update_Doc(
          "category",
          { name: serviceName, categoryImage: file },
          props.CategoriesId
        ).then((action_message) => {
          props.handleClose();

          // Insert Alert
          setAlertpop({
            open: true,
            message: t(action_message),
          });
        });
      });
    }
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "category", props.CategoriesId)).then(() => {
      props.handleClose();

      // Delete Alert
      setAlertpop({
        open: true,
        message: t("data.delete"),
      });
    });
  };

  useEffect(() => {
    setErrorMessage("");
    setserviceName("");
    setImageAsFile("");
    setFile("");
    setIsLoading(false);

    const fetchserviceDetail = async () => {
      const docRef = doc(db, "category", props.CategoriesId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setserviceName(data.category);
        setFile(data.image);
      }
    };

    if (props.CategoriesId) {
      fetchserviceDetail();
    }
  }, [props.open]);

  return (
    <>
      <Dialog open={props.open}>
        <Card>
          <CardHeader
            title={
              props.CategoriesId
                ? t("category.page.form.edit.Category")
                : t("category.page.form.add.Category")
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("category.page.form.Name")}
                    value={serviceName}
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
                      {props.CategoriesId
                        ? t("forms.btn.Update")
                        : t("forms.btn.Submit")}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setErrorMessage("");
                      setserviceName("");
                      setImageAsFile("");
                      setFile("");
                      setIsLoading(false);
                      props.handleClose();
                    }}
                  >
                    {t("forms.btn.Cancel")}
                  </Button>
                  {props.CategoriesId ? (
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
    </>
  );
};

export default Serviceform;
