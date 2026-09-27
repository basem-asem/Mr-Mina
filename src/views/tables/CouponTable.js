import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import AlertMessage from "../Alert/AlertMessage";
import CouponDailog from "../dailogs/CouponDailog";

const CouponTable = ({ coupons, loading }) => {
  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });

  const [CouponPop, setCouponPop] = useState({
    open: false,
    couponId: "",
    isapproving: "",
  });
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePopclose = (alert_message) => {
    setCouponPop({
      open: false,
      couponId: "",
      isapproving: "",
    });
    if (alert_message) {
      setAlertpop({
        open: true,
        message: t(alert_message),
      });
    }
  };

  return (
    <>
      <Paper elevation={10}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t("coupon.page.table.code")}</TableCell>
                <TableCell>{t("coupon.page.table.discount")}</TableCell>
                <TableCell>{t("coupon.page.table.ExpiryDate")}</TableCell>
                <TableCell>{t("coupon.page.table.name")}</TableCell>
                <TableCell>{t("coupon.page.table.suppliername")}</TableCell>
                <TableCell align="center" width={260}>
                  {t("table.action")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    colSpan={5}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : !coupons.length ? (
                <TableRow hover>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    colSpan={5}
                  >
                    {t("NoRecord")}
                  </TableCell>
                </TableRow>
              ) : (
                coupons
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((value) => (
                    <TableRow key={value.docid}>
                      <TableCell>{value.code}</TableCell>
                      <TableCell>{value.discount} %</TableCell>
                      <TableCell>
                        {value?.ExpiryDate &&
                          new Date(
                            value?.ExpiryDate.seconds * 1000
                          ).toDateString()}
                      </TableCell>
                      <TableCell>
                        {value.Products
                          ? value.Products.join(", ")
                          : "For All Products"}
                      </TableCell>
                      <TableCell>{value.UserRef.display_name}</TableCell>
                      <TableCell align="center">
                        {value.Status == "Panding" ? (
                          <Stack spacing={2} direction="row">
                            <Button
                              variant="contained"
                              color="success"
                              onClick={(e) =>
                                setCouponPop({
                                  open: true,
                                  couponId: value.docid,
                                  isapproving: true,
                                })
                              }
                            >
                              {t("Status.Approve")}
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={(e) =>
                                setCouponPop({
                                  open: true,
                                  couponId: value.docid,
                                  isapproving: false,
                                })
                              }
                            >
                              {t("Status.Reject")}
                            </Button>
                          </Stack>
                        ) : value.Status == "active" ? (
                          t("Status.Approve")
                        ) : (
                          t("Status.Reject")
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!coupons?.length ? (
          ""
        ) : (
          <TablePagination
            labelRowsPerPage={t("Rows per page")}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={coupons?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      <CouponDailog CouponPop={CouponPop} handlePopclose={handlePopclose} />

      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
    </>
  );
};

export default CouponTable;
