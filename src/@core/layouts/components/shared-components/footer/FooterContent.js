// ** MUI Imports
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTranslation from "src/@core/hooks/useTranslation";
import footerimage from "../../../../../../public/images/logos/footer.png";

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      <Typography variant="body2">{t("footer.Powered by")} </Typography>
      <Link
        target="_blank"
        href="https://www.tgphotels.com/"
        style={{ display: "flex" }}
      >
        <img
          src={footerimage.src}
          width={140}
          height={100}
          style={{ opacity: 0.8 }}
        />
      </Link>
    </Box>
  );
};

export default FooterContent;
