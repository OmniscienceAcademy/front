import headerStyles from "@styles/components/Layout/Header.module.scss";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

export default function Header() {
  const { t } = useTranslation();
  return (
    <div className={headerStyles.wrapper}>
      <div className={headerStyles.grad} />
      <div className={headerStyles.nav}>
        <div>
          <h1>
            <Link href="/">OmniScience</Link>
            <div className={headerStyles.beta}>
              <div>
                <p>BETA</p>
              </div>
            </div>
          </h1>
        </div>
        <nav>
          <Link href="https://omniscienceproject.notion.site/About-ac47b34228b64636b74efdedab261293">
            {t("common:about")}
          </Link>
          <Link href="https://github.com/OmniscienceAcademy/omniscience-api">
            Github
          </Link>
          <Link href="https://github.com/OmniscienceAcademy/omniscience-api/issues">
            {t("common:reportBug")}
          </Link>
        </nav>
      </div>
    </div>
  );
}
