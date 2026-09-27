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
import WithdrawDailog from "../dailogs/WithdrawDailog";

const WithdrawTable = ({ withdraw, loading }) => {
  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  const [WithdrawPop, setWithdrawPop] = useState({
    open: false,
    withdrawId: "",
    isapproving: "",
  });
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
    setWithdrawPop({
      open: false,
      withdrawId: "",
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
          <Table aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>{t("withdraw.page.table.SupplierName")}</TableCell>
                <TableCell>{t("withdraw.page.table.Email")}</TableCell>
                <TableCell>{t("withdraw.page.table.Date")}</TableCell>
                <TableCell>{t("withdraw.page.table.Amount")}</TableCell>
                <TableCell align="center">
                  {t("withdraw.page.table.Status")}
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
              ) : !withdraw?.length ? (
                <TableRow hover>
                  <TableCell colSpan={5} sx={{ textAlignLast: "center" }}>
                    {t("NoRecord")}
                  </TableCell>
                </TableRow>
              ) : (
                withdraw
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((value) => (
                    <TableRow hover key={value.docid}>
                      <TableCell>{value.name}</TableCell>
                      <TableCell>{value.email}</TableCell>
                      <TableCell>
                        {value.Date &&
                          new Date(value.Date.seconds * 1000).toDateString()}
                      </TableCell>
                      <TableCell>{value.Amount}</TableCell>
                      <TableCell align="center">
                        {value.Status == "Pending" ? (
                          <Stack
                            spacing={2}
                            direction="row"
                            justifyContent="center"
                          >
                            <Button
                              variant="contained"
                              color="success"
                              onClick={(e) =>
                                setWithdrawPop({
                                  open: true,
                                  withdrawId: value.docid,
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
                                setWithdrawPop({
                                  open: true,
                                  withdrawId: value.docid,
                                  isapproving: false,
                                })
                              }
                            >
                              {t("Status.Reject")}
                            </Button>
                          </Stack>
                        ) : value.Status == "Accepted" ? (
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
        {!withdraw?.length ? (
          ""
        ) : (
          <TablePagination
            labelRowsPerPage={t("Rows per page")}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={withdraw?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      <WithdrawDailog
        WithdrawPop={WithdrawPop}
        handlePopclose={handlePopclose}
      />

      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
    </>
  );
};

export default WithdrawTable;
