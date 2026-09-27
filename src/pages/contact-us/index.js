import { CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { getStaticData } from "src/@core/utils/firebaseutils";
import FeedbackTable from "src/views/tables/FeedbackTable";

const index = () => {
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    getStaticData("ContactUs").then((allContacts) => {
      setContactInfo(allContacts);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ marginBottom: 4 }}>
            {t("navbar.Contact Us Requests")}
          </Typography>
        </Grid>
      </Grid>

      {loading ? (
        <Grid item xs={12} textAlign="center">
          <CircularProgress />
        </Grid>
      ) : // check articles length
      !contactInfo.length ? (
        <Grid item xs={12} textAlign="center">
          <Typography variant="h5">{t("NoRecord")} </Typography>
        </Grid>
      ) : (
        <FeedbackTable loading={loading} contactInfo={contactInfo} />
      )}
    </>
  );
};

export default index;
