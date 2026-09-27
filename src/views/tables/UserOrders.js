import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";

const UserOrders = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { userOrder, type } = props;
  const { t } = useTranslation();
  console.log(userOrder);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Typography variant="h5" sx={{ textAlign: "center", margin: "1.5rem" }}>
        {t("user-bookings.table.title")}
      </Typography>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ textAlignLast: "center" }}>
                {type == "SP" ? (
                  <>
                    <TableCell>{t("user-bookings.table.guest name")}</TableCell>
                    <TableCell>
                      {t("user-bookings.table.guest contact number")}
                    </TableCell>
                  </>
                ) : (
                  <TableCell>{t("user-bookings.table.Hotel")}</TableCell>
                )}
                <TableCell>{t("user-bookings.table.room type")}</TableCell>
                <TableCell>{t("user-bookings.table.rooms")}</TableCell>
                <TableCell>{t("user-bookings.table.booking date")}</TableCell>
                <TableCell>{t("user-bookings.table.check in")}</TableCell>
                <TableCell>{t("user-bookings.table.check out")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!userOrder.length ? (
                <TableRow >
                  <TableCell colSpan={6} sx={{ textAlign: "center" }}>{t("NoRecord")}</TableCell>
                </TableRow>
              ) : (
                userOrder
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                        sx={{ textAlignLast: "center" }}
                      >
                        {type == "SP" ? (
                          <>
                            <TableCell>{row.price}</TableCell>
                            <TableCell>{row.price}</TableCell>
                          </>
                        ) : (
                          <TableCell>{row.price}</TableCell>
                        )}
                        <TableCell>{row.price}</TableCell>
                        <TableCell>{row.rooms}</TableCell>
                        <TableCell>
                          {row.bookingdate &&
                            new Date(
                              row.bookingdate.seconds * 1000
                            ).toDateString()}
                        </TableCell>
                        <TableCell>
                          {row["check-in"] &&
                            new Date(
                              row["check-in"].seconds * 1000
                            ).toDateString()}
                        </TableCell>
                        <TableCell>
                          {row["check-Out"] &&
                            new Date(
                              row["check-Out"].seconds * 1000
                            ).toDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!userOrder?.length ? (
          ""
        ) : (
          <TablePagination
            labelRowsPerPage={t("Rows per page")}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={userOrder?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </>
  );
};

export default UserOrders;
