// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// ** Configs
import themeConfig from "src/configs/themeConfig";

import appimagelight from "../../../../../../public/images/logos/favicon.png";
import { useRouter } from "next/router";

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingRight: theme.spacing(4.5),
  transition: "padding .25s ease-in-out",
  minHeight: theme.mixins.toolbar.minHeight,
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: "normal",
  textTransform: "uppercase",
  color: theme.palette.text.primary,
  transition: "opacity .25s ease-in-out, margin .25s ease-in-out",
}));

const StyledLink = styled("a")({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
});

const VerticalNavHeader = (props) => {
  // ** Props
  const { verticalNavMenuBranding: userVerticalNavMenuBranding } = props;

  // ** Hooks
  const theme = useTheme();
  const { locale } = useRouter();

  return (
    <MenuHeaderWrapper className="nav-header">
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <Link passHref href="/dashboard" locale={locale}>
          <StyledLink>
            <img
              src={appimagelight.src}
              width={150}
              height={150}
            />
          </StyledLink>
        </Link>
      )}
    </MenuHeaderWrapper>
  );
};

export default VerticalNavHeader;
