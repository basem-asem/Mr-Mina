import {
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { AccountLock, AccountLockOpen, Eye } from "mdi-material-ui";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useTranslation from "src/@core/hooks/useTranslation";
import { useRouter } from "next/router";
import BlockDailog from "../dailogs/BlockDailog";
import { Button } from "@mui/material";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "src/configs/firebaseConfig";
import Switch from "@mui/material/Switch";
import { Delete, Pencil } from "mdi-material-ui";
import DeleteDailog from "src/views/dailogs/DeleteDailog";
import AlertMessage from "src/views/Alert/AlertMessage";
import UserForm from "src/views/forms/RequestForm";




const UserTable = ({ children, loading, setLoading, type }) => {
  const { locale } = useRouter();
  const [userId, setUserId] = useState("");
  const [open, setOpen] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });

  const [Blockpop, setBlockpop] = useState({
    open: false,
    blockid: "",
    isblock: "",
  });
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleClickOpen = (_, id) => {
    setUserId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setUserId("");
    setOpen(false);
  };
// function for close delete popup
const handlePopcloses = () => {
  setShowPop(false);
};
  const handlePopopen = (serviceid, id) => {
    setUserId(serviceid);
    setShowPop(true);
  };
  // function for delete Service details
  const handleDelete = async () => {
    // delete service
    const deleteService = doc(db, "users", userId);
    await deleteDoc(deleteService).then(() => {
      console.log(userId);
      setShowPop(false);
      setUserId("");

      // Delete Alert
      setAlertpop({
        open: true,
        message: t("data.delete"),
      });
    });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // function for close popup
  const handlePopclose = () => {
    setBlockpop({
      open: false,
      blockid: "",
    });
    setLoading(true);
  };

  const title = children.some((item) => item.type !== "SP")
    ? ""
    : `${t("supplier.cash.on.delivery")}`;



  const handleSwitch = async (id, value) => {
    const newValue = !value;
    const SupplierStatus = doc(db, "users", id);
    await updateDoc(SupplierStatus, {
      isAvailableCOD: newValue,
    });
    setLoading(true);
  };

  useEffect(() => {
    setUserId("")
  }, [children]);

  return (
    <>
      <Paper elevation={10}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t("user-detail.table.image")}</TableCell>
                <TableCell align="center">{t("user-detail.table.name")}</TableCell>
                <TableCell align="center">{t("user-detail.table.email")}</TableCell>
                <TableCell align="center">{t("user-detail.table.phone")}</TableCell>
                {/* <TableCell>{t("supplier.cash.on.delivery")}</TableCell> */}
                <TableCell align="center">{t("table.action")}</TableCell>
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
              ) : children.length == 0 ? (
                <TableRow>
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
                children
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((value) => (
                    <TableRow key={value.docid}>
                      <TableCell>
                        <img
                          src={
                            value.photo_url ? value.photo_url : value.License
                          }
                          height={50}
                          width={50}
                          style={{ borderRadius: "50px" }}
                        />
                      </TableCell>
                      <TableCell align="center">{value.display_name}</TableCell>
                      <TableCell align="center">{value.email}</TableCell>
                      <TableCell align="center">{value.phone_number}</TableCell>

                      {/* <TableCell>
                        {value.type !== "SP" ? (
                          ""
                        ) : value.subscriptionpackage ? (
                          ""
                        ) : (
                          <Switch
                            sx={{ color: "#9155FD" }}
                            checked={value.isAvailableCOD}
                            onClick={() =>
                              handleSwitch(value.uid, value.isAvailableCOD)
                            }
                          />
                        )}
                      </TableCell> */}
                      <TableCell align="center">
                        <IconButton>
                          <Link
                            passHref
                            href={`/user-detail/${value.uid}`}
                            locale={locale}
                          >
                            <Eye color="info" />
                          </Link>
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setBlockpop({
                              open: true,
                              blockid: value.uid,
                              isblock: value.IsBlocked,
                            });
                          }}
                        >
                          {value.IsBlocked ? (
                            <AccountLock color="warning" />
                          ) : (
                            <AccountLockOpen color="success" />
                          )}
                        </IconButton>
                        <IconButton
                onClick={(e) => {
                  handleClickOpen(e, value.docid);
                }}
              >
                <Pencil htmlColor="blue" />
              </IconButton>
              <IconButton
                onClick={() => {
                  handlePopopen(value.docid);
                }}
              >
                <Delete htmlColor="red" />
              </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!children?.length ? (
          ""
        ) : (
          <TablePagination
            labelRowsPerPage={t("Rows per page")}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={children?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      <BlockDailog
        Blockpop={Blockpop}
        setBlockpop={setBlockpop}
        handlePopclose={handlePopclose}
      />
      <DeleteDailog
        handleDelete={handleDelete}
        showPop={showPop}
        handlePopclose={handlePopcloses}
      />
      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
      <UserForm
        open={open}
        handleClose={handleClose}
        CategoriesId={userId}
      />
    </>
  );
};

export default UserTable;
