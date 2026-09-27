import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Delete, Pencil } from "mdi-material-ui";
import React from "react";

const SubCategoryCard = ({ handleClickOpen, handlePopopen, value }) => {
  return (
    <>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardMedia sx={{ height: "14.5625rem" }} image={value.image} />
          <CardContent>
            <Typography display="flex">
              <Typography
                variant="h6"
                width="100%"
                alignSelf="center"
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
              >
                {value.name}
              </Typography>
              <IconButton
                onClick={(e) => {
                  handleClickOpen(e, value.subCategoryid);
                }}
              >
                <Pencil htmlColor="blue" />
              </IconButton>
              <IconButton
                onClick={() => {
                  handlePopopen(value.subCategoryid);
                }}
              >
                <Delete htmlColor="red" />
              </IconButton>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default SubCategoryCard;
