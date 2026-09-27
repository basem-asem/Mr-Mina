import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

const FaqCard = ({ handleClickOpen, value }) => {
  return (
    <>
      <Card
        sx={{ marginBottom: "1rem" }}
        onClick={(e) => {
          handleClickOpen(value.docid);
        }}
      >
        <CardContent>
          <Typography variant="h5">{value.question}</Typography>
          <Typography>{value.answer}</Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default FaqCard;
