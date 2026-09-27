import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import useTranslation from "src/@core/hooks/useTranslation";

const SubscriptionCard = ({ item, code, SubcriptionPrice }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ marginBottom: 3.5 }} key={item.id}>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={7}>
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 3.5 }}>
              {item.data.name}
            </Typography>
            <Typography variant="body2">{item.data.description}</Typography>
          </CardContent>
        </Grid>
        <Grid
          item
          sm={5}
          xs={12}
          sx={{
            paddingTop: ["0 !important", "1.5rem !important"],
            paddingLeft: ["1.5rem !important", "0 !important"],
          }}
        >
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "action.hover",
            }}
          >
            <Box>
              <Box
                sx={{
                  mb: 3.5,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    lineHeight: 1,
                    fontWeight: 600,
                    fontSize: "1.75rem !important",
                  }}
                >
                  {code
                    ? new Intl.NumberFormat("en", {
                        style: "currency",
                        currency: code,
                      }).format(SubcriptionPrice)
                    : ""}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <span>
                  {item.PriceDetail?.interval_count}{" "}
                  {item.PriceDetail?.interval}
                </span>
                <span>
                  {item.PriceDetail?.active
                    ? t("subscription.Active")
                    : t("subscription.InActive")}
                </span>
              </Typography>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default SubscriptionCard;
