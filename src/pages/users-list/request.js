import React, { useEffect, useMemo, useState } from "react";
import { Grid, Typography, Button } from "@mui/material";
import { Plus } from "mdi-material-ui";
import useTranslation from "src/@core/hooks/useTranslation";
import UserTable from "src/views/tables/RequestTable";
import RequestForm from "src/views/forms/RequestForm";
import SearchField from "src/@core/components/SearchField";
import { collection, onSnapshot, orderBy, query, getDoc, doc } from "firebase/firestore";
import { db } from "src/configs/firebaseConfig";

const Request = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const visibleRequests = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return requests;
    return requests.filter((request) => [request.guestName, request.request, request.requestAR, request.department, request.departmentAR]
      .some((value) => String(value || "").toLowerCase().includes(term)));
  }, [requests, search]);

  useEffect(() => {
    const requestQuery = query(collection(db, "requests"), orderBy("created_At", "desc"));
    const unsubscribe = onSnapshot(requestQuery, async (snapshot) => {
      try {
        const allRequests = snapshot.docs.map((requestDoc) => ({ docid: requestDoc.id, ...requestDoc.data() }));
        const updatedRequests = await Promise.all(allRequests.map(async (request) => {
          if (request.request && request.department) {
            const requestDoc = await getDoc(doc(db, "categories", request.department, "requests", request.request));
            if (requestDoc.exists()) {
              const requestData = requestDoc.data();
              request.request = requestData.areaEN;
              request.requestAR = requestData.areaAR;
            }
          }
          if (request.department) {
            const departmentDoc = await getDoc(doc(db, "categories", request.department));
            if (departmentDoc.exists()) {
              const departmentData = departmentDoc.data();
              request.department = departmentData.nameEN;
              request.departmentAR = departmentData.nameAR;
            }
          }
          return request;
        }));
        setRequests(updatedRequests);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }, (error) => { console.error(error); setLoading(false); });
    return unsubscribe;
  }, []);

  return <>
    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}><Typography variant="h5">{t("navbar.Users")}</Typography></Grid>
      <Grid item xs={12} sm={8} md={5}><SearchField value={search} onChange={setSearch} placeholder={t("form.search.name")} fullWidth /></Grid>
      <Grid item xs={12} sm={4} md={3} sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "flex-end" } }}><Button fullWidth variant="contained" onClick={handleClickOpen} sx={{ maxWidth: { sm: 220 } }}><Plus sx={{ mr: 1.5 }} />{t("request.page.form.add.request")}</Button></Grid>
    </Grid>
    <RequestForm open={open} handleClose={handleClose} />
    <UserTable children={visibleRequests} loading={loading} setLoading={setLoading} />
  </>;
};

export default Request;
