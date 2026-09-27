import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { AccountSearch } from "mdi-material-ui";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { getStaticData } from "src/@core/utils/firebaseutils";
import UserTable from "src/views/tables/UserTable";

const Suppliers = () => {
  // ** State
  const { t } = useTranslation();
  const [suppliers, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const filterData = (string = "") => {
    getStaticData("users").then((allusers) => {
      const filteredArray = allusers.filter((obj) =>
        obj.display_name?.toLowerCase().match(string.toLowerCase())
      );
      setUsers(filteredArray);
      setLoading(false);
    });
  };

  useEffect(() => {
    filterData();
  }, [loading]);

  return (
    <>
      <Grid container spacing={6} justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" sx={{ marginBottom: 6 }}>
            {t("navbar.Supplier")}
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
            placeholder={t("form.search.name")}
            autoFocus={true}
            focused={true}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountSearch fontSize="small" />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              filterData(e.target.value.trim());
            }}
          />
        </Grid>
      </Grid>

      <UserTable
        children={suppliers}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};

export default Suppliers;
