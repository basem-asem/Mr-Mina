import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import React from "react";
import useTranslation from "src/@core/hooks/useTranslation";

const AppInfoCard = ({ appInfo, handlePopup }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Grid container spacing={6} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() => {
              handlePopup("phone", t("aboutapp.Phone"), appInfo?.phone);
            }}
          >
            <CardHeader title={t("aboutapp.Phone")} />
            <Typography>{appInfo?.phone}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() => {
              handlePopup("email", t("aboutapp.Email"), appInfo?.email);
            }}
          >
            <CardHeader title={t("aboutapp.Email")} />
            <Typography>{appInfo?.email}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() => {
              handlePopup("vat", t("aboutapp.VAT"), appInfo?.vat);
            }}
          >
            <CardHeader title={t("aboutapp.VAT")} />
            <Typography>{appInfo?.vat}</Typography>
          </Card>
        </Grid>
      </Grid>

      <Card
        sx={{ marginBottom: 4 }}
        onClick={() => {
          handlePopup(
            "Feedback",
            t("aboutapp.Contact Feedback List"),
            appInfo?.Feedback
          );
        }}
      >
        <CardHeader title={t("aboutapp.Contact Feedback List")} />
        <CardContent>
          <Typography variant="body2" sx={{ marginBottom: 3.25 }}>
            {appInfo?.Feedback?.join(", ")}
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{ marginBottom: 4 }}
        onClick={() => {
          handlePopup(
            "mission_vision",
            t("aboutapp.Mission"),
            appInfo?.mission_vision
          );
        }}
      >
        <CardHeader title={t("aboutapp.Mission")} />
        <CardContent>
          <Typography variant="body2" sx={{ marginBottom: 3.25 }}>
            {appInfo?.mission_vision}
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{ marginBottom: 4 }}
        onClick={() => {
          handlePopup("aboutUs", t("aboutapp.About Us"), appInfo?.aboutUs);
        }}
      >
        <CardHeader title={t("aboutapp.About Us")} />
        <CardContent>
          <Typography variant="body2" sx={{ marginBottom: 3.25 }}>
            {appInfo?.aboutUs}
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{ marginBottom: 4 }}
        onClick={() => {
          handlePopup(
            "privacy_policy",
            t("aboutapp.Privacy Policy"),
            appInfo?.privacy_policy
          );
        }}
      >
        <CardHeader title={t("aboutapp.Privacy Policy")} />
        <CardContent>
          <Typography variant="body2" sx={{ marginBottom: 3.25 }}>
            {appInfo?.privacy_policy}
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{ marginBottom: 4 }}
        onClick={() => {
          handlePopup(
            "terms_condition",
            t("aboutapp.Terms And Condition"),
            appInfo?.terms_condition
          );
        }}
      >
        <CardHeader title={t("aboutapp.Terms And Condition")} />
        <CardContent>
          <Typography variant="body2" sx={{ marginBottom: 3.25 }}>
            {appInfo?.terms_condition}
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{ marginBottom: 4 }}
        onClick={() => {
          handlePopup(
            "facebook",
            t("aboutapp.Facebook Link"),
            appInfo?.facebook
          );
        }}
      >
        <CardHeader title={t("aboutapp.Facebook Link")} />
        <CardContent>
          <Typography variant="body2" sx={{ marginBottom: 3.25 }}>
            {appInfo?.facebook}
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{ marginBottom: 4 }}
        onClick={() => {
          handlePopup(
            "Instragram",
            t("aboutapp.Instagram Link"),
            appInfo?.Instragram
          );
        }}
      >
        <CardHeader title={t("aboutapp.Instagram Link")} />
        <CardContent>
          <Typography variant="body2" sx={{ marginBottom: 3.25 }}>
            {appInfo?.Instragram}
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{ marginBottom: 4 }}
        onClick={() => {
          handlePopup(
            "tweeter",
            t("aboutapp.Twitter Link"),
            appInfo?.tweeter
          );
        }}
      >
        <CardHeader title={t("aboutapp.Twitter Link")} />
        <CardContent>
          <Typography variant="body2" sx={{ marginBottom: 3.25 }}>
            {appInfo?.tweeter}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppInfoCard;
