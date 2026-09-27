import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  Grid,
  TextField,
} from "@mui/material";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { Create_Update_Doc } from "src/@core/utils/firebaseutils";
import { db } from "src/configs/firebaseConfig";
import AlertMessage from "../Alert/AlertMessage";

const FaqForm = (props) => {
  // ** States
  const [faqData, setFaqData] = useState({
    question: "",
    answer: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // state for error handle
  const [errorMessage, setErrorMessage] = useState({
    Queerror: "",
    Anserror: "",
  });

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  // ** Add FAQ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (faqData.question || faqData.answer) {
      faqData.question = faqData?.question?.trim();
      faqData.answer = faqData?.answer?.trim();
    }

    if (!faqData.question) {
      setIsLoading(false);
      setErrorMessage({
        Queerror: t("forms.errormessage.inputText"),
      });
    } else if (!faqData.answer) {
      setIsLoading(false);
      setErrorMessage({
        Anserror: t("forms.errormessage.inputText"),
      });
    } else {
      Create_Update_Doc("FAQs", faqData, props.faqId).then((action_message) => {
        props.handleClose();

        // Alert
        setAlertpop({
          open: true,
          message: t(action_message),
        });
      });
    }
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "FAQs", props.faqId)).then(() => {
      props.handleClose();

      // Delete Alert
      setAlertpop({
        open: true,
        message: t("data.delete"),
      });
    });
  };

  useEffect(() => {
    setFaqData("");
    setErrorMessage("");
    setIsLoading(false);

    const fetchFAQdetails = async () => {
      const docRef = doc(db, "FAQs", props.faqId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFaqData(docSnap.data());
      }
    };

    if (props.faqId) {
      fetchFAQdetails();
    }
  }, [props.faqId]);

  return (
    <>
      <Dialog open={props.open} scroll="body">
        <Card>
          <CardHeader
            title={props.faqId ? t("faq.form.edit") : t("faq.form.add")}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("faq.form.input.question")}
                    value={faqData.question ? faqData.question : ""}
                    helperText={
                      errorMessage.Queerror ? errorMessage.Queerror : ""
                    }
                    error={errorMessage.Queerror ? true : false}
                    onChange={(e) =>
                      setFaqData({ ...faqData, question: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    label={t("faq.form.input.answer")}
                    value={faqData.answer ? faqData.answer : ""}
                    helperText={
                      errorMessage.Anserror ? errorMessage.Anserror : ""
                    }
                    error={errorMessage.Anserror ? true : false}
                    sx={{
                      "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                    }}
                    onChange={(e) =>
                      setFaqData({ ...faqData, answer: e.target.value })
                    }
                  />
                </Grid>

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
                      {props.faqId
                        ? t("forms.btn.Update")
                        : t("forms.btn.Submit")}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setIsLoading(false);
                      setErrorMessage("");
                      props.handleClose();
                    }}
                  >
                    {t("forms.btn.Cancel")}
                  </Button>
                  {props.faqId ? (
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

export default FaqForm;
