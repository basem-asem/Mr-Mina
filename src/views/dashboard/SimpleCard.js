import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import React from "react";

const SimpleCard = ({ title, count, countload, icon }) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent
        sx={{
          padding: (theme) => `${theme.spacing(3, 5.25, 0)} !important`,
        }}
      >
        <Typography variant="body2" sx={{ letterSpacing: "0.25px" }}>
          {icon}
        </Typography>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h5" sx={{ my: 4, color: "primary.main" }}>
          {!countload ? count : <CircularProgress />}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SimpleCard;
