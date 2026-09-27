import { CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { getStaticData } from "src/@core/utils/firebaseutils";
import AppInfoCard from "src/views/cards/AppInfoCard";
import AppInfoForm from "src/views/forms/AppInfoForm";

const index = () => {
  const [appInfo, setAppInfo] = useState();
  const [open, setOpen] = useState(false);
  const [updatefield, setUpdatefield] = useState();
  const [updateTitle, setUpdateTitle] = useState();
  const [updateValue, setUpdateValue] = useState();
  const [updatedoc, setUpdatedoc] = useState();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const handlePopup = (field, title, value) => {
    setUpdateValue(value);
    setUpdateTitle(title);
    setUpdatefield(field);
    setOpen(true);
  };

  const handleClose = () => {
    setUpdatefield("");
    setOpen(false);
  };

  useEffect(() => {
    getStaticData("AppData").then((appinfo) => {
      setUpdatedoc(appinfo[0]);
      setAppInfo(appinfo[0]);
      setLoading(false);
    });
  }, [open]);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ marginBottom: 4 }}>
            {t("navbar.About App")}
          </Typography>
        </Grid>
      </Grid>

      {loading ? (
        <Grid item xs={12} textAlign="center">
          <CircularProgress />
        </Grid>
      ) : (
        // check articles length
        <AppInfoCard appInfo={appInfo} handlePopup={handlePopup} />
      )}

      <AppInfoForm
        open={open}
        handleClose={handleClose}
        updatefield={updatefield}
        updateTitle={updateTitle}
        updateValue={updateValue}
        updatedoc={updatedoc}
      />
    </>
  );
};

export default index;
