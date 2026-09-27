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
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import {
  deleteDoc,
  doc,
  getDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import {
  Create_Update_Doc,
  imageUploading,
  createFirebaseAccountAndDocument,
} from "src/@core/utils/firebaseutils";
import { useTheme } from "@mui/material/styles";
import { db } from "src/configs/firebaseConfig";
import AlertMessage from "../Alert/AlertMessage";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";

const Serviceform = (props) => {
  // ** States
  const [serviceName, setserviceName] = useState("");
  const [serviceNameAR, setserviceNameAR] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [department, setdepartment] = useState("");
  const [imageAsFile, setImageAsFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState("");
  const [open, setOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [Categories, setCategories] = useState([]);
  const departmentType = [
    "House keeping",
    "Engineering",
    "Room Service",
    "Security",
    "General",
  ];
  const router = useRouter();

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

    if (!serviceName) {
      setIsLoading(false);
      setErrorMessage({
        nameerror: t("forms.errormessage.inputText"),
      });
    } else if (!phoneNumber) {
      setIsLoading(false);
      setErrorMessage({
        phoneerror: t("forms.errormessage.inputText"),
      });
    } else if (!serviceNameAR) {
      setIsLoading(false);
      setErrorMessage({
        emailerror: t("forms.errormessage.inputText"),
      });
    } else if (!password) {
      setIsLoading(false);
      setErrorMessage({
        phoneerror: t("forms.errormessage.inputText"),
      });
    }
    //  else if (!imageAsFile && !file) {
    //   setIsLoading(false);
    //   setErrorMessage({
    //     imageerror: t("forms.errormessage.inputfile"),
    //   });
    // } 
    else {
      const userObject = {
        display_name: serviceName,
        email: serviceNameAR,
        // photo_url: file,
        Role: type,
        department: department,
        phone_number: phoneNumber,
        // city: city,
        // address: address,
        password: password,
      };
      // imageUploading("photo_url", imageAsFile).then((firebase_url) => {
      //   if (imageAsFile) {
      //     userObject.photo_url = firebase_url;
      //   }
      if (!props.UserId) {
        createFirebaseAccountAndDocument(userObject).then((action_message) => {
          props.handleClose();
          setAlertpop({
            open: true,
            message: t(action_message),
          });
        });
      }else{
        Create_Update_Doc("users", userObject, props.UserId).then(
          (action_message) => {
            props.handleClose();
            setAlertpop({
              open: true,
              message: t(action_message),
            });
          }
        );
      }
      // });
  }
  };
  const handleDelete = async () => {
    await deleteDoc(doc(db, "users", props.UserId)).then(() => {
      props.handleClose();

      // Delete Alert
      setAlertpop({
        open: true,
        message: t("data.delete"),
      });
    });
  };

  useEffect(() => {
    setErrorMessage("");
    setserviceName("");
    setserviceNameAR("");
    setPassword("");
    setType("");
    setAddress("");
    setdepartment("");
    setCity("");
    setPhoneNumber("");
    setImageAsFile("");
    setFile("");
    setIsLoading(false);

    const fetchserviceDetail = async () => {
      const docRef = doc(db, "users", props.UserId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setserviceName(data.display_name);
        setPassword(data.password);
        setserviceNameAR(data.email);
        setType(data.Role);
        setAddress(data.address);
        setCity(data.city);
        setPhoneNumber(data.phone_number);
        setFile(data.photo_url);
        setdepartment(data.department);
      }
    };

    if (props.UserId) {
      fetchserviceDetail();
    }
  }, [props.open]);
  // useEffect(() => {
  //   const fetchAllService = async () => {
  //     const categoryQuery = collection(db, "categories");
  //     await onSnapshot(categoryQuery, async (categorySnapshot) => {
  //       const categoryarr = [];
  //       for (const category of categorySnapshot.docs) {
  //         const categorydata = category.data();
  //         categorydata.id = category.id;

  //         // Listen to changes in requests for the current city
  //         const requestsRef = collection(
  //           db,
  //           "categories",
  //           category.id,
  //           "requests"
  //         );
  //         const unsubscribe = onSnapshot(requestsRef, (requestsSnapshot) => {
  //           const requestsData = requestsSnapshot.docs.map((area) => ({
  //             ...area.data(),
  //             id: area.id,
  //           }));
  //           categorydata.requests = requestsData;
  //           setCategories((prevCategories) => {
  //             // Update only the category that has changed
  //             return prevCategories.map((prevCategory) => {
  //               if (prevCategory.id === categorydata.id) {
  //                 return categorydata;
  //               }
  //               return prevCategory;
  //             });
  //           });
  //         });

  //         categoryarr.push(categorydata);
  //       }
  //       setCategories(categoryarr);
  //       setIsLoading(false);
  //     });
  //   };
  //   fetchAllService();
  // }, []);

  return (
    <>
      <Dialog open={props.open}>
        <Card style={{ overflowY: "auto" }}>
          <CardHeader
            title={
              props.UserId
                ? t("category.page.form.edit.Category")
                : t("employee.form.addBtn")
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("user-detail.table.name")}
                    value={serviceName}
                    style={{ marginBottom: "15px" }}
                    helperText={
                      errorMessage.nameerror ? errorMessage.nameerror : ""
                    }
                    error={errorMessage.nameerror ? true : false}
                    onChange={(e) => {
                      setserviceName(e.target.value);
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t("user-detail.table.email")}
                    value={serviceNameAR}
                    style={{ marginBottom: "15px" }}
                    helperText={
                      errorMessage.emailerror ? errorMessage.emailerror : ""
                    }
                    error={errorMessage.emailerror ? true : false}
                    onChange={(e) => {
                      setserviceNameAR(e.target.value);
                    }}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label={t("user-detail.table.password")}
                    value={password}
                    style={{ marginBottom: "15px" }}
                    helperText={
                      errorMessage.nameerror ? errorMessage.nameerror : ""
                    }
                    error={errorMessage.nameerror ? true : false}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <FormControl sx={{ m: 1, width: 200 }} xs={12}>
                    <InputLabel id="demo-name-label">
                      {t("user-detail.table.type")}
                    </InputLabel>
                    <Select
                      open={typeOpen}
                      style={{ marginBottom: "15px" }}
                      onClose={() => setTypeOpen(false)}
                      onOpen={() => setTypeOpen(true)}
                      value={props.type ? props.type : type}
                      label={t("user-detail.table.type")}
                      id="demo-name-label"
                      helperText={
                        errorMessage.nameerror ? errorMessage.nameerror : ""
                      }
                      error={errorMessage.nameerror ? true : false}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <MenuItem
                        onClick={() => setTypeOpen(false)}
                        value="Admin"
                      >
                        Admin
                      </MenuItem>
                      <MenuItem
                        onClick={() => setTypeOpen(false)}
                        value="Employee"
                      >
                        Employee
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {type === "Employee" && (
                    <FormControl sx={{ m: 1, width: 200 }} xs={12}>
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
                        helperText={
                          errorMessage.nameerror ? errorMessage.nameerror : ""
                        }
                        error={errorMessage.nameerror ? true : false}
                        onChange={(e) => setdepartment(e.target.value)} // Update department state
                      >
                        {Categories &&
                          Categories.map((value, index) =>
                            router.locale == "ar" ? (
                              <MenuItem value={value.id} key={index}>
                                {value.nameAR}
                              </MenuItem>
                            ) : (
                              <MenuItem value={value.id} key={index}>
                                {value.nameEN}
                              </MenuItem>
                            )
                          )}
                      </Select>
                    </FormControl>
                  )}
                  {/* <TextField
        fullWidth
        label={t("user-detail.table.address")}
        value={address}
        style={{ marginBottom: "15px" }}
        helperText={
          errorMessage.nameerror ? errorMessage.nameerror : ""
        }
        error={errorMessage.nameerror ? true : false}
        onChange={(e) => setAddress(e.target.value)}
      />
      <TextField
        fullWidth
        label={t("user-detail.table.city")}
        value={city}
        style={{ marginBottom: "15px" }}
        helperText={
          errorMessage.nameerror ? errorMessage.nameerror : ""
        }
        error={errorMessage.nameerror ? true : false}
        onChange={(e) => setCity(e.target.value)}
      /> */}
                  <TextField
                    fullWidth
                    label={t("user-detail.table.phone")}
                    value={phoneNumber}
                    helperText={
                      errorMessage.nameerror ? errorMessage.nameerror : ""
                    }
                    error={errorMessage.nameerror ? true : false}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} display="flex" gap="1rem">
                  <Button variant="contained" component="label">
                    {t("form.lables.Choose File")}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        setErrorMessage("");
                        setImageAsFile((imageFile) => e.target.files[0]);
                        setFile(URL.createObjectURL(e.target.files[0]));
                      }}
                    />
                  </Button>
                  <Typography variant="body2" color="red" alignSelf="center">
                    {errorMessage.imageerror ? errorMessage.imageerror : ""}
                  </Typography>
                </Grid>
                {file ? (
                  <Grid item xs={12} textAlign="center">
                    <img
                      src={file}
                      alt="preview of seleted image"
                      height="150px"
                      style={{ borderRadius: "10px" }}
                    />
                  </Grid>
                ) : (
                  ""
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
                      {props.UserId
                        ? t("forms.btn.Update")
                        : t("forms.btn.Submit")}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setErrorMessage("");
                      setserviceName("");
                      setImageAsFile("");
                      setFile("");
                      setIsLoading(false);
                      props.handleClose();
                    }}
                  >
                    {t("forms.btn.Cancel")}
                  </Button>
                  {/* {props.UserId ? (
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ float: "right" }}
                      size="large"
                      onClick={() => {
                        handleDelete();
                      }}
                    >
                      {t("forms.btn.Delete")}
                    </Button>
                  ) : (
                    ""
                  )} */}
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

export default Serviceform;
