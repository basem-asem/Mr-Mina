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
  Autocomplete,
  Chip,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import AlertMessage from "../Alert/AlertMessage";
import useTranslation from "src/@core/hooks/useTranslation";
import MuiPhoneNumber from "material-ui-phone-number";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Create_Update_Doc } from "src/@core/utils/firebaseutils";
import { useRouter } from "next/router";

const AppInfoForm = (props) => {
  const {
    updatefield,
    updatedoc,
    updateTitle,
    updateValue,
    open,
    handleClose,
  } = props;

  const { locale } = useRouter();

  // ** States
  const [isLoading, setIsLoading] = useState(false);
  const [infovalue, setInfovalue] = useState();

  // state for error handle
  const [errorMessage, setErrorMessage] = useState("");

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  // ** Add Subscription Packages
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (updatefield !== "Feedback") {
      infovalue = infovalue.trim();
    }

    if (!infovalue) {
      setIsLoading(false);
      setErrorMessage(t("forms.errormessage.inputText"));
      setInfovalue("");
    } else if (!errorMessage) {
      const updateData = {};

      if (updatefield == "vat") {
        updateData[`${updatefield}`] = Number(infovalue);
      } else {
        updateData[`${updatefield}`] = infovalue;
      }

      Create_Update_Doc("AppData", updateData, updatedoc).then(
        (action_message) => {
          setIsLoading(false);
          setInfovalue("");
          handleClose();
          setErrorMessage("");

          // Alert
          setAlertpop({
            open: true,
            message: t(action_message),
          });
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setInfovalue(updateValue);
  }, [open]);

  return (
    <>
      <Dialog open={open} scroll="body">
        <Card>
          <CardHeader
            title={
              locale == "ar" ? `تعديل ${updateTitle}` : `Edit ${updateTitle}`
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                {updatefield == "VAT" ||
                updatefield == "facebook" ||
                updatefield == "Instragram" ||
                updatefield == "tweeter" ? (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type={updatefield == "VAT" ? "number" : "text"}
                      label={updateTitle}
                      value={infovalue}
                      error={errorMessage ? true : false}
                      inputProps={{
                        pattern: updatefield == "VAT" ? "/^d+$/" : null,
                      }}
                      onChange={(e) => {
                        setInfovalue(e.target.value);
                      }}
                    />
                    <FormHelperText
                      variant="standard"
                      error={true}
                      sx={{ height: 10 }}
                    >
                      {errorMessage ? errorMessage : ""}
                    </FormHelperText>
                  </Grid>
                ) : updatefield == "phone" ? (
                  <Grid item xs={12}>
                    <MuiPhoneNumber
                      defaultCountry={"us"}
                      variant="outlined"
                      fullWidth
                      label={updateTitle}
                      value={infovalue}
                      disableAreaCodes={true}
                      onChange={(e) => {
                        if (isValidPhoneNumber(e)) {
                          setErrorMessage(t("forms.errormessage.phone"));
                        } else {
                          setErrorMessage();
                        }
                        setInfovalue(e);
                      }}
                      error={errorMessage ? errorMessage : false}
                    />
                    <FormHelperText
                      variant="standard"
                      error={true}
                      sx={{ height: 8 }}
                    >
                      {errorMessage ? errorMessage : ""}
                    </FormHelperText>
                  </Grid>
                ) : updatefield == "Email" ? (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={updateTitle}
                      value={infovalue}
                      error={errorMessage ? errorMessage : false}
                      onChange={(e) => {
                        if (updatefield == "Email") {
                          const validRegex =
                            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
                          if (!e.target.value.match(validRegex)) {
                            setErrorMessage(t("forms.errormessage.email"));
                          } else {
                            setErrorMessage();
                          }
                        }
                        setInfovalue(e.target.value);
                      }}
                    />
                    <FormHelperText
                      variant="standard"
                      error={true}
                      sx={{ height: 8 }}
                    >
                      {errorMessage ? errorMessage : ""}
                    </FormHelperText>
                  </Grid>
                ) : updatefield == "Feedback" ? (
                  <Grid item xs={12}>
                    <Autocomplete
                      fullWidth
                      multiple
                      id="tags-filled"
                      options={[]}
                      defaultValue={infovalue}
                      freeSolo
                      onChange={(event, newValue, reason) => {
                        setInfovalue(newValue);
                      }}
                      renderTags={(value, getTagProps) => {
                        return value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                          />
                        ));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("aboutapp.Contact Feedback List")}
                        />
                      )}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={20}
                      label={updateTitle}
                      value={infovalue}
                      error={errorMessage ? true : false}
                      sx={{
                        "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                      }}
                      onChange={(e) => {
                        setErrorMessage();
                        setInfovalue(e.target.value);
                      }}
                    />
                    <FormHelperText
                      variant="outlined"
                      error={true}
                      sx={{ height: 10 }}
                    >
                      {errorMessage ? errorMessage : ""}
                    </FormHelperText>
                  </Grid>
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
                      {t("forms.btn.Update")}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setInfovalue("");
                      setIsLoading(false);
                      handleClose();
                      setErrorMessage("");
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

export default AppInfoForm;
