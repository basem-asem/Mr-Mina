import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { Plus } from "mdi-material-ui";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { getStaticData } from "src/@core/utils/firebaseutils";
import ArticleCard from "src/views/cards/ArticleCard";
import ArticleForm from "src/views/forms/ArticleForm";

const Articles = () => {
  const [articles, setArticles] = useState();
  const [open, setOpen] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [articleId, setArticleId] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const handleClick = (index) => {
    if (collapse[index]) {
      setCollapse({ [index]: false });
    } else {
      setCollapse({ [index]: true });
    }
  };

  // Function for open Article Add/Edit popup
  const handleClickOpen = (id) => {
    setArticleId(id);
    setOpen(true);
  };

  // Function for close popup
  const handleClose = () => {
    setArticleId();
    setOpen(false);
  };

  useEffect(() => {
    getStaticData("Article").then((allarticles) => {
      setArticles(allarticles);
      setLoading(false);
    });
  }, [open]);

  return (
    <>
      <Grid container spacing={6} justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">{t("navbar.Articles")}</Typography>
        </Grid>
        <Grid item textAlign="right" sx={{ marginBottom: 4 }}>
          <Button
            variant="contained"
            onClick={() => {
              handleClickOpen();
            }}
            sx={{ marginRight: 1.5 }}
          >
            <Plus sx={{ marginRight: 1.5 }} />
            {t("article.page.btn.add")}
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Grid item xs={12} textAlign="center">
          <CircularProgress />
        </Grid>
      ) : // check articles length
      !articles.length ? (
        <Grid item xs={12} textAlign="center">
          <Typography variant="h5">{t("NoRecord")} </Typography>
        </Grid>
      ) : (
        // return Article data in card
        <Grid container spacing={6}>
          {articles?.map((value, index) => (
            <ArticleCard
              key={value.docid}
              value={value}
              index={index}
              handleClick={handleClick}
              collapse={collapse}
              handleClickOpen={handleClickOpen}
            />
          ))}
        </Grid>
      )}

      <ArticleForm
        open={open}
        handleClose={handleClose}
        articleId={articleId}
      />
    </>
  );
};

export default Articles;
