import { CircularProgress, Grid, Typography, Button } from "@mui/material";
import { Plus } from "mdi-material-ui";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { db } from "src/configs/firebaseConfig";
import SubscriptionCard from "src/views/cards/SubscriptionCard";

const Subscriptions = () => {
  const [Package, setPackage] = useState([]);
  const [PriceDetail, setPriceDetail] = useState([]);
  const [StaticLoading, setStaticLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const handleClickOpen = (_, id) => {
    setCategoriesId(id);
    setOpen(true);
  };

  const subscriptionQuery = collection(db, "products");

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      const q = query(subscriptionQuery);
      onSnapshot(q, (querySnapshot) => {
        const newArray = [];
        querySnapshot.docs.map(async (doc, index) => {
          const collectionRef = collection(
            db,
            "products",
            doc.id,
            "prices"
          );

          const objectNew = {
            data: doc.data(),
            id: doc.id,
            PriceDetail,
          };
          onSnapshot(collectionRef, (querySnapshot) => {
            const data = querySnapshot.docs && querySnapshot.docs[0].data();
            newArray[index].PriceDetail = data;
            setPriceDetail(data);
            setStaticLoading(!StaticLoading);
          });
          newArray.push(objectNew);
          if (querySnapshot.docs.length == index + 1) {
            setPackage(newArray);
            setStaticLoading(!StaticLoading);
          }
        });
        setLoading(false);
      });
    };
    fetchSubscriptionData();
  }, []);
  return (
    <>
      <Grid container spacing={6} justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">{t("navbar.Subscription Package")}</Typography>
        </Grid>

        <Grid
          item
          textAlign="right"
          sx={{
            display: "flex",
            gap: "1rem",
            marginBottom: 4,
          }}
        >
          <Button variant="contained" onClick={handleClickOpen}>
            <Plus sx={{ marginRight: 1.5 }} />
            {t("subscription.page.btn.newsubscription")}
          </Button>
          
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          {loading ? (
            <Typography
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress />
            </Typography>
          ) : Package?.length == 0 ? (
            <Typography
              variant="h5"
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {t("NoRecord")}
            </Typography>
          ) : (
            Package.map((item, i) => {
              const SubcriptionPrice = item.PriceDetail.unit_amount;
              const code = item?.PriceDetail?.currency;

              return (
                <SubscriptionCard
                  key={i}
                  SubcriptionPrice={SubcriptionPrice}
                  code={code}
                  item={item}
                />
              );
            })
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Subscriptions;
