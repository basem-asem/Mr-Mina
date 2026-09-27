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
import Link from "next/link";
import { useRouter } from "next/router";

const CategoryCard = ({ handleClickOpen, handlePopopen, value }) => {
  const { locale } = useRouter();

  return (
    <>
      <Grid item xs={12} md={6} lg={3}>
        <Card style={{ cursor: "pointer" }}>
          <Link passHref href={`/categories/${value.docid}`} locale={locale}>
            <CardMedia sx={{ height: "14.5625rem" }} image={value.categoryImage} className="catImage"  />
          </Link>
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
                  handleClickOpen(e, value.docid);
                }}
              >
                <Pencil htmlColor="blue" />
              </IconButton>
              <IconButton
                onClick={() => {
                  handlePopopen(value.docid);
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

export default CategoryCard;
