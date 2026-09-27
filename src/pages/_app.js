// ** Next Imports
import Head from "next/head";
import { Router, useRouter } from "next/router";

// ** Loader Import
import NProgress from "nprogress";

// ** Emotion Imports
import { CacheProvider } from "@emotion/react";

// ** Config Imports
import themeConfig from "src/configs/themeConfig";

// ** Component Imports
import UserLayout from "src/layouts/UserLayout";
import ThemeComponent from "src/@core/theme/ThemeComponent";

// ** Contexts
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/@core/context/settingsContext";

// ** Utils Imports
import { createEmotionCache } from "src/@core/utils/create-emotion-cache";

// ** React Perfect Scrollbar Style
import "react-perfect-scrollbar/dist/css/styles.css";

// ** Global css styles
import "../../styles/globals.css";
import { useEffect, useState } from "react";
import { store } from "src/redux/app/store";
import { Provider } from "react-redux";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import Cookies from "js-cookie";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "src/configs/firebaseConfig";
import SplashScreen from "src/@core/components/SplashScreen";

const clientSideEmotionCache = createEmotionCache();

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
}

// ** Configure JSS & ClassName
const App = (props) => {
  const router = useRouter();
  const [isHome, setIsHome] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (router.pathname == "/" && user) {
        router.push("/dashboard", "/dashboard", { locale: router?.locale });
      } else if (router.pathname == "/pages/forgot-pass" && !user) {
        router.push("/pages/forgot-pass", "/pages/forgot-pass", {
          locale: router?.locale,
        });
      } else if (!user) {
        router.push("/", "/", { locale: router?.locale });
      }
    });
  }, [router.pathname]);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Variables
  const getLayout =
    Component.getLayout ?? ((page) => <UserLayout>{page}</UserLayout>);

  return isHome ? (
    <SplashScreen finishLoading={() => setIsHome(false)} />
  ) : (
    <CacheProvider value={router?.locale == "ar" ? cacheRtl : emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName} - Admin Panel.`}</title>
        <meta
          name="description"
          content={`${themeConfig.templateName} – Admin Panel.`}
        />
        <meta
          name="keywords"
          content="Material Design, MUI, Admin Template, React Admin Template"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => {
            return (
              <ThemeComponent settings={settings}>
                <Provider store={store}>
                  {getLayout(<Component {...pageProps} />)}
                </Provider>
              </ThemeComponent>
            );
          }}
        </SettingsConsumer>
      </SettingsProvider>
    </CacheProvider>
  );
};

export default App;
