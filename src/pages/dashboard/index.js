import { Grid } from "@mui/material";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { AccountGroupOutline, AccountSupervisorCircleOutline, Calendar, FrequentlyAskedQuestions, GiftOutline, Home, PostOutline, TicketPercentOutline, ViewDashboardOutline } from "mdi-material-ui";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import { db } from "src/configs/firebaseConfig";
import LinkCard from "src/views/dashboard/LinkCard";
import SimpleCard from "src/views/dashboard/SimpleCard";
import RequestChart from "./RequestChart"
const Dashboard = () => {
  const [count, setCount] = useState({
    user: "",
    supplier: "",
    hotelCategory: "",
    articles: "",
    faqs: "",
    plan: "",
    bookings: "",
    hotels: "",
    coupons: "",
  });
  const [countload, setCountload] = useState(true);
  const { t } = useTranslation();

  useEffect(async () => {
    const UsersQuery = query(
      collection(db, "users"),
      where("Role", "==", "Admin")
    );
    const supplierQuery = query(
      collection(db, "users"),
      where("Role", "==", "Employee")
    );
    const hotelCategoryQuery = query(collection(db, "categories"));
    const ArticlesQuery = collection(db, "Articles");
    const FAQSQuery = collection(db, "FAQ");
    const bookingsQuery = collection(db, "Orders");
    const hotelsQuery = collection(db, "Products");
    const SubscriptionPlanQuery = collection(db, "requests");
    const CouponQuery = collection(db, "Offers");

    const userSnap = await getCountFromServer(UsersQuery);
    const supplierSnap = await getCountFromServer(supplierQuery);
    const hotelCategorySnap = await getCountFromServer(hotelCategoryQuery);
    const articlesSnap = await getCountFromServer(ArticlesQuery);
    const FAQSSnap = await getCountFromServer(FAQSQuery);
    const SubscriptionPlanSnap = await getCountFromServer(
      SubscriptionPlanQuery
    );
    const CouponSnap = await getCountFromServer(CouponQuery);
    const bookingsnap = await getCountFromServer(bookingsQuery);
    const hotelsSnap = await getCountFromServer(hotelsQuery);

    setCount({
      user: userSnap.data().count,
      supplier: supplierSnap.data().count,
      hotelCategory: hotelCategorySnap.data().count,
      articles: articlesSnap.data().count,
      faqs: FAQSSnap.data().count,
      plan: SubscriptionPlanSnap.data().count,
      bookings: bookingsnap.data().count,
      hotels: hotelsSnap.data().count,
      coupons: CouponSnap.data().count,
    });
    setCountload(false);
  }, []);

  return (
    <div>
    <ApexChartWrapper sx={{ marginBottom: "1.5rem"}}>
      <Grid container sx={12} >
        <Grid item xs={12}>
        <RequestChart/>
        </Grid>
      </Grid>
    </ApexChartWrapper>

      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <LinkCard
              title={t("dashboard.Total Users")}
              count={count.user}
              countload={countload}
              icon={<AccountGroupOutline />}
              url="/Admins"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <LinkCard
              title={t("dashboard.Total Supplier")}
              count={count.supplier}
              countload={countload}
              icon={<AccountSupervisorCircleOutline />}
              url="/Admins"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <LinkCard
              title={t("dashboard.Total Hotels Category")}
              count={count.hotelCategory}
              countload={countload}
              icon={<ViewDashboardOutline />}
              url="/categories"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <LinkCard
              title={t("dashboard.Total Subscription Packages")}
              count={count.plan}
              countload={countload}
              icon={<PostOutline />}
              url="/users-list/request"
            />
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <LinkCard
              title={t("dashboard.Total Coupons")}
              count={count.coupons}
              countload={countload}
              icon={<TicketPercentOutline />}
              url="/coupon"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <LinkCard
              title={t("dashboard.Total Articles")}
              count={count.articles}
              countload={countload}
              icon={<PostOutline />}
              url="/article"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <LinkCard
              title={t("dashboard.Total FAQS")}
              count={count.faqs}
              countload={countload}
              icon={<FrequentlyAskedQuestions />}
              url="/faq"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SimpleCard
              title={t("dashboard.Total Bookings")}
              count={count.bookings}
              countload={countload}
              icon={<Calendar />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SimpleCard
              title={t("dashboard.Total Hotels")}
              count={count.hotels}
              countload={countload}
              icon={<Home />}
            />
          </Grid> */}
        </Grid>
      </ApexChartWrapper>

    </div>
  );
};

export default Dashboard;
