import React, { useEffect, useRef, useState } from "react";
import { Grid, Typography, Button } from "@mui/material";
import { AccountSearch, Magnify, Plus } from "mdi-material-ui";
import useTranslation from "src/@core/hooks/useTranslation";
import UserTable from "src/views/tables/RequestTable";
import RequestForm from "src/views/forms/RequestForm";
import { collection, onSnapshot, orderBy, query, getDoc, doc } from "firebase/firestore";
import { db } from "src/configs/firebaseConfig";
import styles from './request.module.css';

const Request = () => {
  // ** State
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [inputSearch, setInputSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const targetRef = useRef(null);

  const showSearchInput = isHovered || isFocused;

  useEffect(() => {
    targetRef.current.value = "";
  }, [showSearchInput]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filterData = (srt) => {
    const inputSerch = users.filter((curName) =>
      curName.guestName?.toLowerCase().startsWith(srt)
    );
    setInputSearch(inputSerch);
  };

  useEffect(() => {
    const Query = query(
      collection(db, "requests"),
      orderBy("created_At", "desc")
    );
    onSnapshot(Query, async (snapshot) => {
      const allRequests = [];
      snapshot.forEach((doc) => {
        allRequests.push({ docid: doc.id, ...doc.data() });
      });

      const updatedRequests = await Promise.all(
        allRequests.map(async (SingleRequest) => {
          if (SingleRequest.request && SingleRequest.department) {
            const requestDoc = await getDoc(
              doc(db, "categories", SingleRequest.department,"requests", SingleRequest.request)
            );
            console.log(SingleRequest.request, SingleRequest.department)
            if (requestDoc.exists()) {
              const userData = requestDoc.data();
              SingleRequest.request = userData.areaEN; // Assuming the user object has a "nameEN" property
              SingleRequest.requestAR = userData.areaAR; // Assuming the user object has a "nameEN" property
            }
          }
          if (SingleRequest.department) {
            const userDoc = await getDoc(
              doc(db, "categories", SingleRequest.department)
            );
            if (userDoc.exists()) {
              const userData = userDoc.data();
              SingleRequest.department = userData.nameEN; // Assuming the user object has a "nameEN" property
              SingleRequest.departmentAR = userData.nameAR; // Assuming the user object has a "nameEN" property
            }
          }
          return SingleRequest;
        })
      );

      setInputSearch(updatedRequests);
      setUsers(updatedRequests);
      setLoading(false);
    });
  }, [loading]);

  return (
    <>
      <Grid container spacing={6} justifyContent="space-between" alignItems="center">
        <Grid item display="flex" justifyContent="space-between" alignItems="center" marginBottom={4}>
          <Typography variant="h5" sx={{ paddingRight: 6}}>
            {t("navbar.Users")}
          </Typography>
        <Grid>
          <div
            className={`${styles.container} ${showSearchInput ? styles.hover : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            >
            <input
              ref={targetRef}
              className={`${styles.searchInput} ${showSearchInput ? styles.showSearchInput : ''}`}
              placeholder={t("form.search.name")}
              onChange={(e) => {
                filterData(e.target.value.trim());
              }}
            />
            {showSearchInput ? (
              <Magnify className={`${styles.iconCommon} ${styles.iconRightArrow}`} />
            ) : (
              <Magnify className={styles.iconCommon} />
            )}
          </div>
        </Grid>
        </Grid>
        <Grid
          item
          textAlign="right"
          sx={{
            display: "flex",
            gap: "1rem",
            marginBottom: 4,
          }}
        >
          <Button variant="contained" onClick={handleClickOpen}>
            <Plus sx={{ marginRight: 1.5 }} />
            {t("request.page.form.add.request")}
          </Button>
        </Grid>
      </Grid>
      <RequestForm open={open} handleClose={handleClose} />
      <UserTable
        children={inputSearch}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};

export default Request;
