import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { ChevronDown, ChevronUp } from "mdi-material-ui";
import moment from "moment";
import "moment/locale/ar";
import { useRouter } from "next/router";
import React from "react";
import useTranslation from "src/@core/hooks/useTranslation";

const ArticleCard = ({
  value,
  handleClick,
  index,
  collapse,
  handleClickOpen,
}) => {
  const { t } = useTranslation();
  const { locale } = useRouter();

  return (
    <>
      <Grid item xs={12} md={6} lg={4} key={value.docid}>
        <Card>
          <CardHeader
            title={value.addby}
            avatar={<Avatar src={value.profile} aria-label="recipe" />}
            subheader={
              value.dateTime &&
              moment.unix(value.dateTime.seconds).locale(locale).format("LLL")
            }
            titleTypographyProps={{ color: "text.primary" }}
          />
          <CardMedia
            component="img"
            height="194"
            image={value.image}
            alt="Paella dish"
            onClick={(e) => {
              handleClickOpen(value.docid);
            }}
            sx={{ cursor: "pointer", objectFit: "fill" }}
          />
          <CardContent
            onClick={(e) => {
              handleClickOpen(value.docid);
            }}
            sx={{ cursor: "pointer" }}
          >
            <Typography
              variant="h6"
              color="text.primary"
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
            >
              {value.name}
            </Typography>
          </CardContent>
          <CardActions className="card-action-dense">
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button onClick={() => handleClick(index)}>
                {t("article.page.card.detail")}
              </Button>
              <IconButton size="small" onClick={() => handleClick(index)}>
                {collapse[index] ? (
                  <ChevronUp sx={{ fontSize: "1.875rem" }} />
                ) : (
                  <ChevronDown sx={{ fontSize: "1.875rem" }} />
                )}
              </IconButton>
            </Box>
          </CardActions>
          <Collapse in={collapse[index]}>
            <Divider sx={{ margin: 0 }} />
            <CardContent>
              <Typography variant="body2">{value.description}</Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
    </>
  );
};

export default ArticleCard;
