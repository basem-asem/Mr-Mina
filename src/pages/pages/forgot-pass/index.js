// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV1 from "src/views/pages/auth/FooterIllustration";
import appimagelight from "../../../../public/images/logos/favicon.png";
import { Alert, Snackbar, TextField } from "@mui/material";
import { auth } from "src/configs/firebaseConfig";
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/router";
import useTranslation from "src/@core/hooks/useTranslation";

import { useFormik } from "formik";
import * as yup from "yup";

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const ForgotPass = () => {
  const theme = useTheme();

  // ** States
  const router = useRouter();
  const { t } = useTranslation();
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messagetype, setMessagetype] = useState("error");

  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .matches(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        t("login.email.invalid")
      )
      .required(t("login.email.required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (values.email) {
        fetchSignInMethodsForEmail(auth, values.email)
          .then((method) => {
            if (method.length) {
              sendPasswordResetEmail(auth, values.email).then(() => {
                setMessagetype("success");
                setErrorMessage(t("forgotpass.success"));
                setErrorAlert(true);
                setTimeout(() => {
                  router.push("/", "/", { locale: router?.locale });
                }, 3000);
              });
            } else {
              setErrorMessage(t("forgotpass.invalid"));
              setErrorAlert(true);
            }
          })
          .catch((e) => {
            setErrorMessage(t("forgotpass.invalid"));
            setErrorAlert(true);
          });
      } else {
        setErrorMessage(t("forgotpass.noinput"));
        setErrorAlert(true);
      }
    },
  });

  useEffect(() => {
    const dir = router?.locale == "ar" ? "rtl" : "ltr";
    const lang = router?.locale == "ar" ? "ar" : "en";
    document.querySelector("html").setAttribute("dir", dir);
    document.querySelector("html").setAttribute("lang", lang);
  }, [router?.locale]);

  return (
    <>
      <Box className="content-center">
        <Card sx={{ zIndex: 1 }}>
          <CardContent
            sx={{ padding: (theme) => `${theme.spacing(12, 9, 7)} !important` }}
          >
            <Box
              sx={{
                mb: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={appimagelight.src}
                width={150}
                height={150}
              />
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, marginBottom: 1.5 }}
              >
                {t("forgotpass.title")}
              </Typography>
              <Typography variant="body2">{t("forgotpass.message")}</Typography>
            </Box>
            <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
              <TextField
                sx={{ mb: 4 }}
                autoFocus
                fullWidth
                id="email"
                name="email"
                type="email"
                label={t("login.email")}
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="carterleonard@gmail.com"
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ marginBottom: 7 }}
              >
                {t("forms.btn.Submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
        <FooterIllustrationsV1 />
      </Box>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorAlert}
        onClose={() => setErrorAlert(false)}
      >
        <Alert severity={messagetype}>{errorMessage}</Alert>
      </Snackbar>
    </>
  );
};
ForgotPass.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default ForgotPass;
