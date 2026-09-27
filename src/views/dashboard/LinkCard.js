import React from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { ArrowRightThin } from "mdi-material-ui";
import { useRouter } from "next/router";
import useTranslation from "src/@core/hooks/useTranslation";

const LinkCard = ({ title, count, countload, icon, url }) => {
  const route = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Card>
        <CardContent
          sx={{
            padding: (theme) => `${theme.spacing(3, 5.25, 0)} !important`,
          }}
        >
          <Typography variant="body2" sx={{ letterSpacing: "0.25px" }}>
            {icon}
          </Typography>
          <Typography variant="h6">{title}</Typography>

          {!countload ? (
            <Typography variant="h5" sx={{ my: 4, color: "primary.main" }}>
              {count}
            </Typography>
          ) : (
            <CircularProgress />
          )}
        </CardContent>
        <Divider />
        <Button
          variant="text"
          sx={{
            py: 2.5,
            marginLeft: "1rem",
            width: "100%",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            justifyContent: "start",
          }}
          onClick={() => {
            route.push(url, url, { locale: route?.locale });
          }}
        >
          {t("dashboard.viewall")}
          <ArrowRightThin />
        </Button>
      </Card>
    </>
  );
};

export default LinkCard;
