import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  Grid,
  TextField,
  Typography,
  Menu,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import {
  Create_Update_Doc,
  imageUploading,
} from "src/@core/utils/firebaseutils";
import { db } from "src/configs/firebaseConfig";
import AlertMessage from "../Alert/AlertMessage";
import { BorderAll, BorderColor } from "mdi-material-ui";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const RequestForm = (props) => {
  // ** States
  const [Categories, setCategories] = useState([]);
  const [guestName, setguestName] = useState("");
  const [guestRM, setguestRM] = useState("");
  const [request, setrequest] = useState("");
  const [requests, setrequests] = useState([]);
  const [department, setdepartment] = useState();
  const [status, setStatus] = useState("");
  const [requestDoneTime, setRequestDoneTime] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [guestCalled, setguestCalled] = useState(false);
  const [followUp, setfollowUp] = useState(null);
  const [noCalls, setNoCalls] = useState(null);
  
  const statusType = ["Pending", "Work on it", "Completed"];
  const orderTakerId = Cookies.get("_isAdmin");
  // const [imageAsFile, setImageAsFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [file, setFile] = useState();
  const [open, setOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [statusOpen, setStatudOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setdepartment(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // state for error handle
  const [errorMessage, setErrorMessage] = useState({
    nameerror: "",
    imageerror: "",
  });

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  // ** Add Subscription Packages
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    guestName = guestName.trim();
    request = request.trim();
    department = department.trim();
    !props.CategoriesId ? (status = "Pending") : (status = status);
    if (!guestName) {
      setIsLoading(false);
      setErrorMessage({
        nameerror: t("forms.errormessage.inputText"),
      });
      // } else if (!imageAsFile && !file) {
      //   setIsLoading(false);
      //   setErrorMessage({
      //     imageerror: t("forms.errormessage.inputfile"),
      //   });
    } else if (!guestRM) {
      setIsLoading(false);
      setErrorMessage({
        nameerror: t("forms.errormessage.inputText"),
      });
    } else {
      // imageUploading("photo_url", imageAsFile).then((firebase_url) => {
      //   if (imageAsFile) {
      //     file = firebase_url;
      //   }
  
      const requestData = {
        guestName: guestName,
        guestRM: guestRM,
        orderTaker: orderTakerId,
        department: department,
        request: request,
        orderRes: selectedUser,
        status: !props.CategoriesId ? "Pending" : status,
        requestDoneTime: requestDoneTime,
        responseTime: responseTime,
        guestCalled: guestCalled,
        followUp: followUp,
        noCalls: noCalls,
      };
      
      if (!props.CategoriesId) {
        requestData.created_At = new Date();
      }
      if (status == "Work on it"){
        requestData.responseTime = new Date();
      }
      if (status == "Completed"){
        requestData.requestDoneTime = new Date();
      }
      Create_Update_Doc("requests", requestData, props.CategoriesId
      ).then((action_message) => {
        props.handleClose();

        // Insert Alert
        setAlertpop({
          open: true,
          message: t(action_message),
        });
      });
    }
  };

  // const handleDelete = async () => {
  //   await deleteDoc(doc(db, "users", props.CategoriesId)).then(() => {
  //     props.handleClose();

  //     // Delete Alert
  //     setAlertpop({
  //       open: true,
  //       message: t("data.delete"),
  //     });
  //   });
  // };

  useEffect(() => {
    setErrorMessage("");
    setguestName("");
    setguestRM("");
    setdepartment("");
    setrequest("");
    // setImageAsFile("");
    // setFile("");
    setIsLoading(false);
    setStatus("");

    const fetchserviceDetail = async () => {
      const docRef = doc(db, "requests", props.CategoriesId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(data.orderRes);
    
        // // Fetch user data using the orderRes ID
        // const userDoc = await getDoc(doc(db, "users", data.orderRes));
        // const userData = userDoc.data();
    
        setguestName(data.guestName);
        setguestRM(data.guestRM);
        setdepartment(data.department);
        setrequest(data.request);
        setfollowUp(data.followUp);
        setNoCalls(data.noCalls)
        setguestCalled(data.guestCalled);
        setResponseTime(data.responseTime);
        setRequestDoneTime(data.requestDoneTime);
        setStatus(data.status);
        setSelectedUser(data.orderRes); // Set user data to selectedUser state
      }
    };
    
    if (props.CategoriesId) {
      fetchserviceDetail();
    }
  }, [props.open]);
  //get the use of the department
  useEffect(() => {
    const fetchUser = async () => {
      const querySnapshot = await getDocs(
        query(
          collection(db, "users"),
          where("Role", "==", "Employee"),
          where("department", "==", department)
        )
      );
      const fetchedUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name:doc.data().display_name,
      }));
      setUsers(fetchedUsers);
    };
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(
        query(
          collection(db, "categories", department, "requests")
        )
      );
      const fetchRequest = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nameAR:doc.data().areaAR,
        nameEN:doc.data().areaEN,
      }));
      setrequests(fetchRequest);
    };
    if (department) {
      fetchRequests();
      fetchUser();
    }
  }, [department]);

  useEffect(() => {
    const fetchAllService = async () => {
      const categoryQuery = collection(db, "categories");
      await onSnapshot(categoryQuery, async (categorySnapshot) => {
        const categoryarr = [];
        for (const category of categorySnapshot.docs) {
          const categorydata = category.data();
          categorydata.id = category.id;
          
          // Listen to changes in requests for the current city
          const requestsRef = collection(db, "categories", category.id, "requests");
          const unsubscribe = onSnapshot(requestsRef, (requestsSnapshot) => {
            const requestsData = requestsSnapshot.docs.map(area => ({ ...area.data(), id: area.id }));
            categorydata.requests = requestsData;
            setCategories((prevCategories) => {
              // Update only the category that has changed
              return prevCategories.map((prevCategory) => {
                if (prevCategory.id === categorydata.id) {
                  return categorydata;
                }
                return prevCategory;
              });
            });
          });
  
          categoryarr.push(categorydata);
        }
        setCategories(categoryarr);
        setIsLoading(false);
      });
    };    
    fetchAllService();
  }, []);
  return (
    <>
      <Dialog open={props.open} fullWidth={true} maxWidth={"lg"}>
        <Card style={{ overflowY: "auto" }}>
          <CardHeader
            title={
              props.CategoriesId
                ? t("request.page.form.edit.request")
                : t("request.page.form.add.request")
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("request.guestName")}
                    value={guestName}
                    style={{ marginBottom: "15px" }}
                    helperText={
                      errorMessage.nameerror ? errorMessage.nameerror : ""
                    }
                    error={errorMessage.nameerror ? true : false}
                    onChange={(e) => {
                      setguestName(e.target.value);
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t("request.guestRM")}
                    value={guestRM}
                    style={{ marginBottom: "15px" }}
                    helperText={
                      errorMessage.nameerror ? errorMessage.nameerror : ""
                    }
                    error={errorMessage.nameerror ? true : false}
                    onChange={(e) => {
                      setguestRM(e.target.value);
                    }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-controlled-open-select-label">
                          {t("request.department")}
                        </InputLabel>
                        <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          open={open}
                          style={{ marginBottom: "15px" }}
                          onClose={() => setOpen(false)}
                          onOpen={() => setOpen(true)}
                          value={department}
                          label={t("request.department")}
                          onChange={(e) => setdepartment(e.target.value)}
                        >
                          {Categories && Categories.map((value, index) => (
                             router.locale == "ar"? (<MenuItem value={value.id} key={index}>
                              {value.nameAR}
                            </MenuItem>): (<MenuItem value={value.id} key={index}>
                              {value.nameEN}
                            </MenuItem>)
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      {department && (
                        <FormControl fullWidth>
                        <InputLabel id="select-Request-label">Select Request</InputLabel>
                        <Select
                          labelId="select-Request-label"
                          id="select-Request"
                          value={request}
                          onChange={(e) => {
                            setrequest(e.target.value);
                          }}
                          label="Select Request"
                        >
                          {requests && requests.map((value, index) => (
                             router.locale == "ar"? (<MenuItem value={value.id} key={index}>
                              {value.nameAR}
                            </MenuItem>): (<MenuItem value={value.id} key={index}>
                              {value.nameEN}
                            </MenuItem>)
                          ))}
                        </Select>
                      </FormControl>                      
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      {request && (
                        <FormControl fullWidth>
                        <InputLabel id="select-user-label">Select User</InputLabel>
                        <Select
                          labelId="select-user-label"
                          id="select-user"
                          value={selectedUser}
                          onChange={(e) => {
                            setSelectedUser(e.target.value);
                          }}
                          label="Select User"
                        >
                          {users.map((user) => (
                            <MenuItem key={user.id} value={user.name}>
                              {user.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>                      
                      )}
                    </Grid>
                    <Grid item xs={6} style={{ marginBottom: "15px", paddingTop:0 }}>
                      {props.CategoriesId && (
                        <FormControl>
                          <InputLabel id="demo-controlled-open-select-label">
                            {t("request.status")}
                          </InputLabel>
                          <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={statusOpen}
                            onClose={() => setStatudOpen(false)}
                            onOpen={() => setStatudOpen(true)}
                            value={status}
                            label={t("request.status")}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            {statusType.map((e, i) => (
                              <MenuItem onClick={handleClose} value={e} key={i}>
                                {e}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                  </Grid>
                  {props.CategoriesId && (
                    <Grid container spacing={2}>
                      <Grid
                        item
                        sm={4}
                        xs={12}
                        style={{ marginBottom: "15px" }}
                      >
                        <FormControl fullWidth>
                          <InputLabel id="demo-controlled-open-select-label">
                            {t("request.guestCalled")}
                          </InputLabel>
                          <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={callOpen}
                            onClose={() => setCallOpen(false)}
                            onOpen={() => setCallOpen(true)}
                            value={guestCalled}
                            label={t("request.guestCalled")}
                            onChange={(e) => setguestCalled(e.target.value)}
                          >
                            <MenuItem value={false}>No</MenuItem>
                            <MenuItem value={true}>Yes</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      {guestCalled&&<Grid item sm={4} xs={12}>
                        <TextField
                          fullWidth
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            min: 0,
                          }}
                          type="number"
                          label={t("request.calles")}
                          value={noCalls}
                          helperText={
                            errorMessage.nameerror ? errorMessage.nameerror : ""
                          }
                          error={errorMessage.nameerror ? true : false}
                          onChange={(e) => {
                            setNoCalls(e.target.value);
                          }}
                        />
                      </Grid>}
                      <Grid item sm={4} xs={12}>
                        <TextField
                          fullWidth
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            min: 0,
                          }}
                          type="number"
                          label={t("request.followUp")}
                          value={followUp}
                          helperText={
                            errorMessage.nameerror ? errorMessage.nameerror : ""
                          }
                          error={errorMessage.nameerror ? true : false}
                          onChange={(e) => {
                            setfollowUp(e.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    {isLoading ? (
                      <Button size="large" sx={{ marginRight: 4 }}>
                        <CircularProgress />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ marginRight: 4 }}
                      >
                        {props.CategoriesId
                          ? t("forms.btn.Update")
                          : t("forms.btn.Submit")}
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => {
                        setErrorMessage("");
                        setguestName("");
                        // setImageAsFile("");
                        // setFile("");
                        setIsLoading(false);
                        props.handleClose();
                      }}
                    >
                      {t("forms.btn.Cancel")}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Dialog>
      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
    </>
  );
};

export default RequestForm;
