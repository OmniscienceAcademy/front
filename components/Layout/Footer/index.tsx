import useTranslation from "next-translate/useTranslation";
import footerStyles from "@styles/components/Layout/Footer.module.scss";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa";
import { handleEnterKeyDown, openNewTab } from "@common/utils";
import FooterColumn, { FooterColumnProps } from "./FooterColumn";

export default function Footer() {
  const { t } = useTranslation();

  const Links: FooterColumnProps[] = [
    {
      title: {
        url: "https://omniscienceproject.notion.site/About-ac47b34228b64636b74efdedab261293",
        name: t("common:about"),
      },
      links: [
        {
          url: "https://omniscienceproject.notion.site/Manifesto-d2682b836570483b8bee5b68ecf664ba",
          name: t("common:manifesto"),
        },
        {
          url: "https://omniscienceproject.notion.site/Partners-fb5f376010f34ac08ceb90ffb1d331d4",
          name: t("footer:partenaires"),
        },
        {
          url: "https://omniscienceproject.notion.site/About-ac47b34228b64636b74efdedab261293",
          name: t("footer:team"),
        },
      ],
    },
    {
      title: { url: "/", name: t("common:blog") },
      links: [
        { url: "/", name: t("footer:articles") },
        { url: "/", name: t("footer:whatsNew") },
        {
          url: "https://omniscienceproject.notion.site/Roadmap-84d4c8278b364a1ca51ccca532dd6694",
          name: t("footer:roadmap"),
        },
      ],
    },
    {
      title: {
        url: "mailto:omniscience.project@gmail.com",
        name: t("footer:help"),
      },
      links: [
        // { url: "/#", name: t("footer:faq") },
        {
          url: "mailto:omniscience.project@gmail.com",
          name: t("footer:contact-us"),
        },
      ],
    },
  ];

  return (
    <footer className={footerStyles.wrapper}>
      <div className={footerStyles.content}>
        <div className={footerStyles.subNewsletter}>
          <p>{t("footer:sub-newsletter")}</p>
          <div
            className={footerStyles.newsletter}
            onClick={() =>
              openNewTab("https://9h6z9emtdcw.typeform.com/to/LNFD5eOU")
            }
            role="button"
            tabIndex={0}
            onKeyDown={handleEnterKeyDown(() => {
              openNewTab("https://9h6z9emtdcw.typeform.com/to/LNFD5eOU");
            })}
            aria-label="newsletter"
          >
            {t("footer:newsletter")}
          </div>
        </div>
        {Links.map((props) => (
          // eslint-disable-next-line react/prop-types
          <FooterColumn key={props.title.name} {...props} />
        ))}
      </div>
      <div className={footerStyles.lastRow}>
        <div className={footerStyles.lastLinks}>
          <Link href="/#">{t("footer:terms-conditions")}</Link>
          <Link href="/#">{t("footer:privacy-policy")}</Link>
        </div>
        <div className={footerStyles.lastIcons}>
          <a href="https://twitter.com/OmniScienceOrg" aria-label="Twitter">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}
