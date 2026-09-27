// ** React Imports
import { useEffect, useState } from "react";

// ** Next Imports
import Link from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import { FormHelperText } from "@mui/material";

// ** Icons Imports
import favicon from "../../public/images/logos/favicon.png";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Alert, Snackbar } from "@mui/material";
import useTranslation from "src/@core/hooks/useTranslation";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV1 from "src/views/pages/auth/FooterIllustration";
import { auth, db } from "src/configs/firebaseConfig";
import Cookies from "js-cookie";

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const LinkStyled = styled("a")(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const LoginPage = () => {
  // ** Hook
  const theme = useTheme();
  const router = useRouter();

  // ** State
  const [inLogin, setInLogin] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messagetype, setMessagetype] = useState("error");
  const [showPassword, setshowPassword] = useState(false);
  const { t } = useTranslation();

  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .matches(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        t("login.email.invalid")
      )
      .required(t("login.email.required")),
    password: yup
      .string("Enter your password")
      .min(6, t("login.password.invalid"))
      .required(t("login.password.required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setInLogin(true);
      if (values.email && values.password) {
        signInWithEmailAndPassword(auth, values.email, values.password)
          .then(async (userresult) => {
            const userdocRef = doc(db, "users", userresult.user.uid);
            const userdocSnap = await getDoc(userdocRef);
            if (userdocSnap.exists()) {
              const { Role } = userdocSnap.data();
              if (Role == "Admin") {
                setMessagetype("success");
                setErrorMessage(t("login.success"));
                setErrorAlert(true);
                setTimeout(() => {
                  Cookies.set("_isAdmin", userresult.user.uid, {
                    expires: 7,
                  });
                  router.push("/dashboard", "/dashboard", {
                    locale: router?.locale,
                  });
                  setInLogin(false);
                }, 2000);
              } else {
                setInLogin(false);
                setErrorMessage(t("login.invalid"));
                setErrorAlert(true);
                auth.signOut()
              }
            } else {
              setInLogin(false);
              setErrorMessage(t("login.invalid"));
              setErrorAlert(true);
            }
          })
          .catch((err) => {
            setInLogin(false);
            setErrorMessage(t("login.invalid"));
            setErrorAlert(true);
          });
        } else {
          setInLogin(false);
          setErrorMessage(t("login.noInputerror"));
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
    <Box className="content-center">
      <Card sx={{ zIndex: 1 }}>
        <CardContent
          sx={{ padding: (theme) => `${theme.spacing(1, 9, 7)} !important` }}
        >
          <Box
            sx={{
              mb: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={favicon.src}
              width={140}
              height={140}
            />
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, marginBottom: 1.5 }}
            >
              {t("login.title")}
            </Typography>
            <Typography variant="body2">{t("login.adventure")}</Typography>
          </Box>
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
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
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel
                    htmlFor="auth-login-password"
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                  >
                    {t("login.password")}
                  </InputLabel>
                  <OutlinedInput
                    label="Password"
                    value={formik.values.password}
                    id="password"
                    name="password"
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setshowPassword(!showPassword)}
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {formik.touched.password && formik.errors.password ? (
                  <FormHelperText
                    sx={{ color: "#bf3333", marginLeft: "16px !important" }}
                  >
                    {formik.touched.password && formik.errors.password}
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "end",
                  }}
                >
                  <Link
                    passHref
                    href="/pages/forgot-pass"
                    locale={router?.locale}
                  >
                    <LinkStyled>{t("login.Forgot Password?")}</LinkStyled>
                  </Link>
                </Box>
                <Button
                  fullWidth
                  type="submit"
                  size="large"
                  variant="contained"
                  sx={{ marginBottom: 7 }}
                  disabled={inLogin}
                >
                  {inLogin ? t("login.process") : t("login.button")}
                </Button>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <Link href="/" locale="en">
                <Box sx={{ cursor: "pointer" }}>English</Box>
              </Link>
              <Link href="/" locale="ar">
                <Box sx={{ cursor: "pointer" }}>عربى</Box>
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorAlert}
        onClose={() => setErrorAlert(false)}
      >
        <Alert severity={messagetype}>{errorMessage}</Alert>
      </Snackbar>
    </Box>
  );
};
LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;
