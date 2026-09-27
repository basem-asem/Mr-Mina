import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { Plus } from "mdi-material-ui";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { getStaticData } from "src/@core/utils/firebaseutils";
import FaqCard from "src/views/cards/FaqCard";
import FaqForm from "src/views/forms/FaqForm";

const Faqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [faqId, setFaqId] = useState("");
  const { t } = useTranslation();

  // Function for close popup
  const handleClose = () => {
    setFaqId("");
    setOpen(false);
  };

  // Function for open FAQ Add/Edit popup
  const handleClickOpen = (id) => {
    setFaqId(id);
    setOpen(true);
  };

  useEffect(() => {
    getStaticData("FAQs").then((allfaqs) => {
      setFaqs(allfaqs);
      setLoading(false);
    });
  }, [open]);

  return (
    <>
      <Grid container spacing={6} justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">{t("navbar.FAQs")}</Typography>
        </Grid>
        <Grid item textAlign="right" sx={{ marginBottom: 4 }}>
          <Button
            variant="contained"
            onClick={() => handleClickOpen()}
            sx={{ marginRight: 1.5 }}
          >
            <Plus sx={{ marginRight: 1.5 }} />
            {t("faq.page.btn.add")}
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Grid item xs={12} textAlign="center">
          <CircularProgress />
        </Grid>
      ) : !faqs.length ? (
        <Grid item xs={12} textAlign="center">
          <Typography variant="h5">{t("NoRecord")} </Typography>
        </Grid>
      ) : (
        faqs.map((value) => (
          <FaqCard
            handleClickOpen={handleClickOpen}
            value={value}
            key={value.docid}
          />
        ))
      )}

      <FaqForm open={open} handleClose={handleClose} faqId={faqId} />
    </>
  );
};

export default Faqs;
