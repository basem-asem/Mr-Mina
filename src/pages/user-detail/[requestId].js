import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { Printer } from "mdi-material-ui";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { db } from "src/configs/firebaseConfig";
import UserDetailCard from "src/views/cards/UserDetailCard";
import HotelsTable from "src/views/tables/HotelsTable";
import UserOrders from "src/views/tables/UserOrders";
import { useSelector } from 'react-redux';

const UserDetail = () => {
  const router = useRouter();
  const { requestId } = router.query;
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [primeDetail, setPrimeDetail] = useState();
  const [hotels, setHotels] = useState([]);
  const { t } = useTranslation();
  const booleanValue = useSelector((state) => state.boolean.value);
 console.log(booleanValue)
  const childRef = useRef();

  const print = () => {
    if (childRef.current) {
      childRef.current.downloadPDF();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (requestId) {
        const requestRef = doc(db, "requests", requestId);
        const requestSnap = await getDoc(requestRef);
        if (requestSnap.exists()) {
          const requestData = requestSnap.data();
          if (requestData.request && requestData.department) {
            const requestDoc = await getDoc(
              doc(db, "categories", requestData.department, "requests", requestData.request)
            );
            if (requestDoc.exists()) {
              const userData = requestDoc.data();
              requestData.request = userData.areaEN;
              requestData.requestAR = userData.areaAR;
            }
          }
          if (requestData.department) {
            const userDoc = await getDoc(doc(db, "categories", requestData.department));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              requestData.department = userData.nameEN;
              requestData.departmentAR = userData.nameAR;
            }
          }
          if (requestData.orderTaker) {
            const userDoc = await getDoc(doc(db, "users", requestData.orderTaker));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              requestData.orderTaker = userData.display_name;
            }
          }
          setUserDetail(requestData);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [requestId]);

  return (
    <div>
      {!loading ? (
        <>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 4 }}>
            <Grid item>
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                {t("request.requestDetails")}
              </Typography>
            </Grid>
          {!booleanValue&&  <Grid item textAlign="right">
              <Button variant="contained" onClick={print}>
                <Printer sx={{ marginRight: 1.5 }} />
                {t("request.print")}
              </Button>
            </Grid>}
          </Grid>

          <Card>
            <CardContent>
              <UserDetailCard userDetails={userDetail} ref={childRef} />
            </CardContent>
          </Card>

          {/* table of order detail */}
          {/* <UserOrders userOrder={bookings} type={userDetail?.type} /> */}

          {/* Product of Supplier
          {userDetail?.type == "SP" ? (
            <HotelsTable hotels={hotels} />
          ) : null} */}
        </>
      ) : (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default UserDetail;
