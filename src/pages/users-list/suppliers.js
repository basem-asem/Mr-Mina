import { Grid, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { getStaticData } from "src/@core/utils/firebaseutils";
import UserTable from "src/views/tables/UserTable";
import SearchField from "src/@core/components/SearchField";

const Suppliers = () => {
  // ** State
  const { t } = useTranslation();
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const suppliers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? allSuppliers.filter((supplier) => String(supplier.display_name || "").toLowerCase().includes(term)) : allSuppliers;
  }, [allSuppliers, search]);

  useEffect(() => {
    getStaticData("users").then(setAllSuppliers).catch((error) => console.error(error)).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Grid container spacing={6} justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" sx={{ marginBottom: 6 }}>
            {t("navbar.Supplier")}
          </Typography>
        </Grid>
        <Grid item>
          <SearchField value={search} onChange={setSearch} placeholder={t("form.search.name")} />
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
