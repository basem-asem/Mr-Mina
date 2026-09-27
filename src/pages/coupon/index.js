import { Grid, Typography } from "@mui/material";
import { collection, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { db } from "src/configs/firebaseConfig";
import CouponTable from "src/views/tables/CouponTable";

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const couponRef = collection(db, "Offers");
    onSnapshot(couponRef, (couponsnap) => {
      setLoading(true);
      setCoupons([]);

      if (couponsnap.docs.length == 0) {
        setLoading(false);
      } else {
        couponsnap.docs.map(async (item) => {
          const product = item.data();

          // Delivery Company Details fetch
          if (product.User) {
            const Userdoc = await getDoc(product.User);
            if (Userdoc.exists()) {
              product.UserRef = Userdoc.data();
            }
          }

          setCoupons((oldarr) => [...oldarr, { ...product, docid: item.id }]);
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
            {t("navbar.Manage Coupons")}
          </Typography>
        </Grid>
      </Grid>

      {/* return coupons data in card */}
      <CouponTable coupons={coupons} loading={loading} />
    </>
  );
};

export default Coupon;
