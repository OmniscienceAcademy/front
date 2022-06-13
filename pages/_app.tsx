import Layout from "@components/Layout";
import "@styles/globals.scss";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { deviceType } from "@common/utils";
import useTranslation from "next-translate/useTranslation";
import TagManager from "react-gtm-module";

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCookieConsentVisible, setIsCookieConsentVisible] = useState(false);
  const handleCookieConsent = (accepted: boolean) => {
    setIsCookieConsentVisible(false);
    if (accepted) {
      localStorage.setItem("cookieConsent", "true");
    }
  };
  useEffect(() => {
    TagManager.initialize({
      gtmId: "GTM-KDLSW65",
    });

    if (typeof window === "undefined") return;

    // check if user is on desktop
    if (
      !window.sessionStorage.getItem("firstView") &&
      deviceType() !== "desktop"
    ) {
      window.sessionStorage.setItem("firstView", "true");
      // eslint-disable-next-line no-alert
      alert(t("common:mobileUserAlert"));
    }

    // check if user has accepted cookies
    const cookieConsent = localStorage.getItem("cookieConsent");
    switch (cookieConsent) {
      case "true":
      case "false":
        setIsCookieConsentVisible(false);
        break;
      default:
        setIsCookieConsentVisible(true);
    }

    // DISCO EASTER EGG
    // 1 / 1k chance of triggering easter egg
    if (Math.random() < 0.999) return;
    const htmlEl = document.querySelector("html");
    if (htmlEl) {
      htmlEl.classList.add("disco");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout showCookieBanner={false} handleCookieConsent={handleCookieConsent}>
      <Component {...pageProps} />
    </Layout>
  );
}
export default MyApp;
