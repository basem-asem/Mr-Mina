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
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTranslation from "src/@core/hooks/useTranslation";
import { db } from "src/configs/firebaseConfig";
import {
  setArabicTrans,
  setEnglishTrans,
} from "src/redux/features/TranslationSlice";

const LanguageForm = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [inputvalues, setInputvalues] = useState({
    en: "",
    ar: "",
  });

  // state for error handle
  const [errorMessage, setErrorMessage] = useState({
    englisherror: "",
    arabicerror: "",
  });
  const { t } = useTranslation();
  const { en, ar } = useSelector((state) => state.Translation);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    inputvalues.en = inputvalues?.en?.trim();
    inputvalues.ar = inputvalues?.ar?.trim();

    if (!inputvalues.en) {
      setIsLoading(false);
      setErrorMessage({
        englisherror: t("forms.errormessage.englishTranslation"),
      });
    } else if (!inputvalues.ar) {
      setIsLoading(false);
      setErrorMessage({
        arabicerror: t("forms.errormessage.arabicTranslation"),
      });
    } else {
      const tempAr = { ...ar };
      tempAr[props.updateKey] = inputvalues.ar;
      const tempEn = { ...en };
      tempEn[props.updateKey] = inputvalues.en;

      const enRef = doc(db, "Translation", "English");
      await setDoc(enRef, {
        english: tempEn,
      });

      const arRef = doc(db, "Translation", "Arabic");
      await setDoc(arRef, {
        arabic: tempAr,
      });

      dispatch(setEnglishTrans(tempEn));
      dispatch(setArabicTrans(tempAr));

      setErrorMessage("");
      setInputvalues("");
      setIsLoading(false);
      props.setUpdateKey("");
      props.setOpen(false);
    }
  };

  useEffect(() => {
    setInputvalues({
      en: en[props.updateKey],
      ar: ar[props.updateKey],
    });
  }, [props.updateKey]);

  return (
    <div>
      <Dialog open={props.open} onClose={() => props.setOpen(false)}>
        <Card>
          <CardHeader
            title={t("language.forms.edit.Translation")}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("language.forms.Language Key")}
                    value={props.updateKey}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("language.forms.English Translet")}
                    value={inputvalues.en}
                    helperText={
                      errorMessage.englisherror ? errorMessage.englisherror : ""
                    }
                    error={errorMessage.englisherror ? true : false}
                    onChange={(e) => {
                      setInputvalues({ ...inputvalues, en: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("language.forms.Arabic Translet")}
                    value={inputvalues.ar}
                    helperText={
                      errorMessage.arabicerror ? errorMessage.arabicerror : ""
                    }
                    error={errorMessage.arabicerror ? true : false}
                    onChange={(e) => {
                      setInputvalues({ ...inputvalues, ar: e.target.value });
                    }}
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
                      {t("forms.btn.Update")}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setErrorMessage("");
                      setInputvalues("");
                      setIsLoading(false);
                      props.setUpdateKey("");
                      props.setOpen(false);
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
    </div>
  );
};

export default LanguageForm;
