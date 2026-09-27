import {
  Button,
  Grid,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Magnify, Pencil } from "mdi-material-ui";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useTranslation from "src/@core/hooks/useTranslation";
import LanguageForm from "../../views/forms/LanguageForm";

const Languages = () => {
  const [updateKey, setUpdateKey] = useState();
  const [keys, setKeys] = useState([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { t } = useTranslation();
  const { en, ar } = useSelector((state) => state.Translation);

  const filterData = (string = "") => {
    const arr = [];
    for (const key in en) {
      arr.push(key);
    }
    const filteredArray = arr.filter(
      (obj) =>
        obj.toLowerCase().match(string.toLowerCase()) ||
        en[obj].toLowerCase().match(string.toLowerCase()) ||
        ar[obj].toLowerCase().match(string.toLowerCase())
    );
    setKeys(filteredArray);
  };

  useEffect(() => {
    filterData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Grid container spacing={6} justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" sx={{ marginBottom: 6 }}>
            {t("navbar.Languages")}
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
            placeholder={t("form.search")}
            autoFocus={true}
            focused={true}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Magnify fontSize="small" />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              filterData(e.target.value.trim());
            }}
          />
        </Grid>
      </Grid>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>{t("language.table.Key")}</TableCell>
                <TableCell>{t("language.table.English")}</TableCell>
                <TableCell align="right">
                  {t("language.table.Arabic")}
                </TableCell>
                <TableCell align="center">{t("table.action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keys
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((key) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{en[key]}</TableCell>
                      <TableCell align="right">{ar[key]}</TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => {
                            setUpdateKey(key);
                            setOpen(true);
                          }}
                        >
                          <Pencil htmlColor="blue" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelRowsPerPage={t("Rows per page")}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={keys?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <LanguageForm
        open={open}
        setOpen={setOpen}
        updateKey={updateKey}
        setUpdateKey={setUpdateKey}
      />
    </>
  );
};

export default Languages;
