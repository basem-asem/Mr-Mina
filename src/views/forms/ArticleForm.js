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
import { deleteDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import {
  Create_Update_Doc,
  imageUploading,
} from "src/@core/utils/firebaseutils";
import { db } from "src/configs/firebaseConfig";
import AlertMessage from "../Alert/AlertMessage";

const ArticleForm = (props) => {
  // ** States
  const [articleData, setArticleData] = useState({
    name: "",
    description: "",
    dateTime: "",
    image: "",
    profile: "",
    addby: "Admin",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState();
  const [imageAsFile, setImageAsFile] = useState("");

  // state for error handle
  const [errorMessage, setErrorMessage] = useState({
    titleerror: "",
    shortdeserror: "",
    longdeserror: "",
    dateerror: "",
    imageerror: "",
  });

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  // ** Add Article
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!props.articleId) {
      articleData.dateTime = serverTimestamp();
      articleData.addby = "Admin";
      articleData.profile =
        "https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png";
    }

    if (articleData.name && articleData.description) {
      articleData.name = articleData?.name.trim();
      articleData.description = articleData?.description.trim();
    }

    if (!articleData.name) {
      setIsLoading(false);
      setErrorMessage({
        titleerror: t("forms.errormessage.inputText"),
      });
    } else if (!articleData.description) {
      setIsLoading(false);
      setErrorMessage({
        longdeserror: t("forms.errormessage.inputText"),
      });
    } else if (!imageAsFile && !file) {
      setIsLoading(false);
      setErrorMessage({
        imageerror: t("forms.errormessage.inputfile"),
      });
    } else {
      imageUploading("Article", imageAsFile).then((firebase_url) => {
        if (!imageAsFile) {
          articleData.image = file;
        } else {
          articleData.image = firebase_url;
        }
        Create_Update_Doc("Article", articleData, props.articleId).then(
          (action_message) => {
            setErrorMessage("");
            setArticleData("");
            setImageAsFile("");
            setFile("");
            setIsLoading(false);
            props.handleClose();

            // Update Alert
            setAlertpop({
              open: true,
              message: t(action_message),
            });
          }
        );
      });
    }
  };

  // Delete Article
  const handleDelete = async () => {
    await deleteDoc(doc(db, "Article", props.articleId)).then(() => {
      props.handleClose();

      // Delete Alert
      setAlertpop({
        open: true,
        message: t("data.delete"),
      });
    });
  };

  useEffect(() => {
    const fetchFAQdetails = async () => {
      const docRef = doc(db, "Article", props.articleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFile(data.image);
        setArticleData(data);
      }
    };

    if (props.articleId) {
      fetchFAQdetails();
    } else {
      setArticleData("");
      setImageAsFile("");
      setFile("");
      setIsLoading(false);
    }
  }, [props.articleId]);

  return (
    <>
      <Dialog open={props.open} scroll="body">
        <Card>
          <CardHeader
            title={
              props.articleId ? t("article.form.edit") : t("article.form.add")
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("article.form.input.name")}
                    value={articleData.name ? articleData.name : ""}
                    placeholder="What is Relax app?"
                    helperText={
                      errorMessage.titleerror ? errorMessage.titleerror : ""
                    }
                    error={errorMessage.titleerror ? true : false}
                    onChange={(e) =>
                      setArticleData({
                        ...articleData,
                        name: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    label={t("article.page.form.description")}
                    value={
                      articleData.description ? articleData.description : ""
                    }
                    placeholder="Answer..."
                    sx={{
                      "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                    }}
                    helperText={
                      errorMessage.longdeserror ? errorMessage.longdeserror : ""
                    }
                    error={errorMessage.longdeserror ? true : false}
                    onChange={(e) =>
                      setArticleData({
                        ...articleData,
                        description: e.target.value,
                      })
                    }
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
                      alt="preview of seleted ArticleImage"
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
                      {props.articleId
                        ? t("forms.btn.Update")
                        : t("forms.btn.Submit")}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setErrorMessage("");
                      setArticleData("");
                      setImageAsFile("");
                      setFile("");
                      setIsLoading(false);
                      props.handleClose();
                    }}
                  >
                    {t("forms.btn.Cancel")}
                  </Button>
                  {props.articleId ? (
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

export default ArticleForm;
