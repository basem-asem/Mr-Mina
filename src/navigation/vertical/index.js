// ** Icon imports
import {
  AccountGroupOutline,
  AccountSupervisorCircleOutline,
  CashCheck,
  ClipboardTextOutline,
  FrequentlyAskedQuestions,
  GiftOutline,
  HomeOutline,
  HumanGreetingVariant,
  NotebookOutline,
  ImageOutline,
  InformationOutline,
  PostOutline,
  TicketPercentOutline,
  Translate,
  ViewDashboardOutline
} from "mdi-material-ui";
// import EngineeringIcon from "@mui/icons-material/Engineering";
import useTranslation from "src/@core/hooks/useTranslation";

const navigation = () => {
  const { t } = useTranslation();

  return [
    {
      title: "Dashboard",
      icon: PostOutline,
      path: "/dashboard",
    },
    {
      sectionTitle: "Teacher Management",
    },
    {
      icon: AccountGroupOutline,
      title: "Students",
      path: "/students",
    },
    {
      icon: AccountGroupOutline,
      title: "Groups",
      path: "/groups",
    },
    {
      icon: NotebookOutline,
      title: "Learning notes",
      path: "/notes",
    },
    {
      icon: ClipboardTextOutline,
      title: "Attendance",
      path: "/attendance",
    },
    {
      icon: ViewDashboardOutline,
      title: "Exams",
      path: "/exams",
    },
    {
      icon: HumanGreetingVariant,
      title: "Private lessons",
      path: "/lessons",
    },
    {
      title: t("navbar.employee"),
      icon: AccountSupervisorCircleOutline,
      path: "/Admins",
    },
    // {
    //   icon: ViewDashboardOutline,
    //   title: t("navbar.Hotels Category"),
    //   path: "/categories",
    // },
    // {
    //   icon: AccountSupervisorCircleOutline,
    //   title: t("navbar.Supplier"),
    //   path: "/users-list/suppliers",
    // },
    // {
    //   icon: GiftOutline,
    //   title: t("navbar.Subscription Package"),
    //   path: "/subscriptions",
    // },
    // {
    //   icon: TicketPercentOutline,
    //   title: t("navbar.Manage Coupons"),
    //   path: "/coupon",
    // },
    // {
    //   sectionTitle: t("subnavbar.Information"),
    // },
    // {
    //   icon: CashCheck,
    //   title: t("navbar.Withdraw History"),
    //   path: "/withdraw",
    // },
    // {
    //   icon: PostOutline,
    //   title: t("navbar.Articles"),
    //   path: "/article",
    // },
    // {
    //   icon: FrequentlyAskedQuestions,
    //   title: t("navbar.FAQs"),
    //   path: "/faq",
    // },
    // {
    //   icon: ImageOutline,
    //   title: t("navbar.Image Gallery"),
    //   path: "/image-gallery",
    // },
    // {
    //   icon: HumanGreetingVariant,
    //   title: t("navbar.Contact Us Requests"),
    //   path: "/contact-us",
    // },
    // {
    //   icon: InformationOutline,
    //   title: t("navbar.About App"),
    //   path: "/about",
    // },
    // {
    //   title: t("navbar.Languages"),
    //   icon: Translate,
    //   path: "/languages",
    // },
  ];
};

export default navigation;
