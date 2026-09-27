import { Grid, Typography } from "@mui/material";
import { collection, getDoc, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { db } from "src/configs/firebaseConfig";
import WithdrawTable from "src/views/tables/WithdrawTable";

const Withdraw = () => {
  const [withdraw, setwithdraw] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const q = collection(db, "Withdraw");
    onSnapshot(q, (querySnapshot) => {
      setLoading(true);
      setwithdraw([]);

      if (querySnapshot.docs.length == 0) {
        setLoading(false);
      } else {
        querySnapshot.docs.map(async (doc) => {
          const docSnap = await getDoc(doc.data().User);

          if (docSnap.exists()) {
            setwithdraw((oldarry) => [
              ...oldarry,
              {
                docid: doc.id,
                ...doc.data(),
                name: docSnap.data().display_name,
                email: docSnap.data().email,
              },
            ]);
          }

          setLoading(false);
        });
      }
    });
  }, []);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ marginBottom: 4 }}>
            {t("navbar.Withdraw History")}
          </Typography>
        </Grid>
      </Grid>

      <WithdrawTable loading={loading} withdraw={withdraw} />
    </>
  );
};

export default Withdraw;
