import Style from "@styles/404.module.scss";
import useTranslation from "next-translate/useTranslation";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className={Style.wrapper}>
      <div className={Style.content}>
        <div className={Style.number}>
          <h1>404</h1>
        </div>
        <h2>{t("common:404")}</h2>
      </div>
    </div>
  );
}
