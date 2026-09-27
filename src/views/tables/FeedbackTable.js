import {
  Paper,
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

const FeedbackTable = ({ loading, contactInfo }) => {
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

  return (
    <Paper elevation={10}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>{t("contact.detail.name")}</TableCell>
              <TableCell>{t("contact.detail.email")}</TableCell>
              <TableCell>{t("contact.detail.help_by")}</TableCell>
              <TableCell>{t("contact.detail.comment")}</TableCell>
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
            ) : !contactInfo?.length ? (
              <TableRow hover>
                <TableCell colSpan={4} sx={{ textAlignLast: "center" }}>
                  {t("NoRecord")}
                </TableCell>
              </TableRow>
            ) : (
              contactInfo
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((value) => (
                  <TableRow hover key={value.docid}>
                    <TableCell>{value.name}</TableCell>
                    <TableCell>{value.email}</TableCell>
                    <TableCell>{value.help_by}</TableCell>
                    <TableCell>{value.comment}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!contactInfo?.length ? (
        ""
      ) : (
        <TablePagination
          labelRowsPerPage={t("Rows per page")}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={contactInfo?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default FeedbackTable;
