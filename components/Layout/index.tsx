import Head from "next/head";
import { PropsWithChildren } from "react";
import Header from "@components/Layout/Header";
import Footer from "@components/Layout/Footer";
import CookieConsent from "./CookieConsent";

export interface LayoutProps {
  showCookieBanner: boolean;
  handleCookieConsent: (accepted: boolean) => void;
}

export default function Layout({
  children,
  showCookieBanner,
  handleCookieConsent,
}: PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Head>
        {/* put all meta-tags here */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div id="top" className="layoutMain">
        <Header />
        <main>{children}</main>
      </div>
      <Footer />
      {showCookieBanner && <CookieConsent onAccept={handleCookieConsent} />}
    </>
  );
}
