// ** React Imports
import { useState, Fragment, useEffect } from "react";

// ** Next Import
import { useRouter } from "next/router";
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import LogoutVariant from "mdi-material-ui/LogoutVariant";
import { ListItemButton } from "@mui/material";
import useTranslation from "src/@core/hooks/useTranslation";
import { auth } from "src/configs/firebaseConfig";
import Cookies from "js-cookie";

// ** Styled Components
const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const MenuNavLink = styled(ListItemButton)(({ theme }) => ({
  width: "100%",
  color: theme.palette.text.primary,
  padding: theme.spacing(2.25, 3.5),
  transition: "opacity .25s ease-in-out",
  "&.active, &.active:hover": {
    boxShadow: theme.shadows[3],
    backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`,
    color: `${theme.palette.common.white} !important`,
  },
}));

const UserDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState(null);

  // ** Hooks
  const router = useRouter();
  const { t } = useTranslation(router?.locale);

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url, value) => {
    if (url) {
      if (value === 1) {
        auth.signOut().then(() => {
          Cookies.remove("_isAdmin");
          router.push(url);
        });
      }
      router.replace(url);
    }
    setAnchorEl(null);
  };

  useEffect(() => {
    const dir = router?.locale == "ar" ? "rtl" : "ltr";
    const lang = router?.locale == "ar" ? "ar" : "en";
    document.querySelector("html").setAttribute("dir", dir);
    document.querySelector("html").setAttribute("lang", lang);
  }, [router?.locale]);

  return (
    <Fragment>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: "pointer" }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Avatar
          alt="John Doe"
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src="/images/avatars/1.png"
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ "& .MuiMenu-paper": { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge
              overlap="circular"
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Avatar
                alt="John Doe"
                src="/images/avatars/1.png"
                sx={{ width: "2.5rem", height: "2.5rem" }}
              />
            </Badge>
            <Box
              sx={{
                display: "flex",
                marginLeft: 3,
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>{t("Admin")}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Link passHref href={router.asPath} locale="ar">
          <MenuNavLink
            className={router?.locale == "ar" ? "active" : ""}
            sx={{ py: 2 }}
            onClick={() => setAnchorEl(null)}
          >
            عربى
          </MenuNavLink>
        </Link>
        <Link passHref href={router.asPath} locale="en">
          <MenuNavLink
            component={"a"}
            className={router?.locale == "en" ? "active" : ""}
            sx={{ py: 2 }}
            onClick={() => setAnchorEl(null)}
          >
            English
          </MenuNavLink>
        </Link>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ py: 2 }} onClick={() => handleDropdownClose("/", 1)}>
          <LogoutVariant
            sx={{
              marginRight: 2,
              fontSize: "1.375rem",
              color: "text.secondary",
            }}
          />
          {t("Logout")}
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;