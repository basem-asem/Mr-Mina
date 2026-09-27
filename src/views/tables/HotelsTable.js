import {
  IconButton,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { HomeMapMarker } from "mdi-material-ui";
import React, { useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";

const HotelsTable = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { hotels } = props;
  const { t } = useTranslation();

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
        {t("hotel.title")}
      </Typography>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 480 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ textAlignLast: "center" }}>
                <TableCell>{t("hotel.Image")}</TableCell>
                <TableCell>{t("hotel.Name")}</TableCell>
                <TableCell>{t("hotel.Price")}</TableCell>
                <TableCell>{t("hotel.offer")}</TableCell>
                <TableCell>{t("hotel.Category")}</TableCell>
                <TableCell>{t("hotel.SubCategory")}</TableCell>
                <TableCell>{t("hotel.Rating")}</TableCell>
                <TableCell>{t("hotel.Location")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!hotels.length ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlignLast: "center" }}>
                    {t("NoRecord")}
                  </TableCell>
                </TableRow>
              ) : (
                hotels
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((value, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                        sx={{ textAlignLast: "center" }}
                      >
                        <TableCell>
                          <img
                            src={value.image}
                            height={50}
                            width={50}
                            style={{ borderRadius: "50px" }}
                          />
                        </TableCell>
                        <TableCell>{value.name}</TableCell>
                        <TableCell>{value.price}</TableCell>
                        <TableCell>
                          {value.IsOffer
                            ? `${t("hotel.offer.status")}`
                            : `${t("hotel.offer.status.not")}`}
                        </TableCell>
                        <TableCell>{value.category}</TableCell>
                        <TableCell>{value.subcategory}</TableCell>
                        <TableCell>
                          <Rating
                            name="read-only"
                            value={value.ratting}
                            readOnly
                          />
                        </TableCell>
                        <TableCell>
                          <a
                            target="_blank"
                            href={`https://www.google.com/maps/search/?api=1&query=${value.latlang._lat}%2C${value.latlang._long}`}
                            rel="noopener noreferrer"
                          >
                            <IconButton>
                              <HomeMapMarker />
                            </IconButton>
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!hotels?.length ? (
          ""
        ) : (
          <TablePagination
            labelRowsPerPage={t("Rows per page")}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={hotels?.length}
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

export default HotelsTable;
