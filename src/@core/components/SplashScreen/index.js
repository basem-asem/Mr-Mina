import anime from "animejs";
import React, { useEffect, useState } from "react";
import appimagelight from "../../../../public/images/logos/favicon.png";
import themeConfig from "src/configs/themeConfig";

const SplashScreen = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  const animation = () => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });

    loader.add({
      targets: "#splashLogo",
      scale: {
        value: 1.5,
        duration: 1600,
        delay: 800,
        easing: "easeInOutQuart",
      },
      delay: 250, // All properties except 'scale' inherit 250ms delay
    });
  };

  useEffect(() => {
    document.title = `${themeConfig.templateName} - Admin Panel.`
    const timeout = setTimeout(() => setIsMounted(true), 10);
    animation();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img id="splashLogo" src={appimagelight.src} width={200} height={200} />
    </div>
  );
};

export default SplashScreen;
