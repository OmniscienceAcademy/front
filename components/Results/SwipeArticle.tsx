import Style from "@styles/components/Results/SwipeArticle.module.scss";
import { Article } from "@common/types";
import useTranslation from "next-translate/useTranslation";
import Abstract from "@components/common/Abstract";
import { ComponentsInterpolation } from "text2components";
import { useEffect, useState } from "react";
import ToggleAbstract from "@components/common/ToggleAbstract";
import OpenIn from "@components/common/OpenIn";
// import Keywords from "./Keywords";

interface SwipeArticleProps {
  article: Article;
  openAbstract?: boolean;
  openAbstractHandler?: (open: boolean) => void;
  hideOpenAbstract?: boolean;
  hideTLRD?: boolean;
  removeBorder?: boolean;
  allowOpenPdf?: boolean;
}

export default function SwipeArticle({
  article,
  hideTLRD = false,
  openAbstract = hideTLRD,
  openAbstractHandler,
  hideOpenAbstract = hideTLRD,
  removeBorder = false,
  allowOpenPdf = false,
}: SwipeArticleProps) {
  const { t } = useTranslation();
  const noTLDR = article.tldr.trim().length === 0;
  const [showAbstract, setShowAbstract] = useState(openAbstract || hideTLRD);
  useEffect(() => {
    if (openAbstractHandler && !hideOpenAbstract && !hideTLRD) {
      openAbstractHandler(showAbstract);
    }
  }, [hideOpenAbstract, hideTLRD, openAbstractHandler, showAbstract]);
  return (
    <div className={`${Style.wrapper} ${removeBorder ? "" : Style.bordered}`}>
      <div className={Style.informationsWrapper}>
        <div className={Style.informations}>
          {/* <p className={Style.categorie}>{t("article:informations")}</p> */}
          <h1>{article.title}</h1>
          <h2>
            <address>
              {article.authors.map((author) => author[1]).join(", ")}
            </address>
            {/* <time dateTime={article.year.toString()}>{article.year}</time> */}
            <p>
              {article.journalName.toUpperCase()} | {article.year}
            </p>
          </h2>
        </div>
        <div>
          <div className={Style.citationNumber}>
            <p className={Style.number}>{article.nbInCitations}</p>
            <p className={Style.citation}>{t("article:citations")}</p>
          </div>
        </div>
      </div>
      {!hideTLRD && (
        <>
          <p className={Style.categorie}>{t("article:tldr")}</p>
          <p className={Style.tldr}>
            {noTLDR ? (
              t("article:noTLDR")
            ) : (
              <ComponentsInterpolation
                text={article.tldr.replace(
                  /sup>(-?\d+)\/sup>/g,
                  "<sup>$1</sup>",
                )}
                components={{ sup: <sup />, b: <b /> }}
              />
            )}
          </p>
        </>
      )}
      {showAbstract && (
        <>
          <p className={Style.categorie}>{t("article:abstract")}</p>
          <p className={Style.abstract}>
            <Abstract
              abstract={article.paperAbstract || t("article:noAbstract")}
            />
          </p>
        </>
      )}
      {!hideTLRD && !hideOpenAbstract && !noTLDR && (
        <div className={Style.toggleAbstract}>
          <ToggleAbstract
            title={article.title}
            show={showAbstract}
            onClick={() => setShowAbstract((s) => !s)}
          />
        </div>
      )}
      {allowOpenPdf && (
        <div className={Style.openIn}>
          <OpenIn article={article} />
        </div>
      )}
    </div>
  );
}
