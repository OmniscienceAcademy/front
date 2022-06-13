import Style from "@styles/components/common/MiniArticle.module.scss";
import { Article, ITag } from "@common/types";

import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import Abstract from "@components/common/Abstract";
import ToggleAbstract from "@components/common/ToggleAbstract";
import OpenIn from "@components/common/OpenIn";
import Stat from "../Results/Stat";
import Tags from "../Results/Tags";
import NewTabAnchor from "./NewTabAnchor";

export type MiniArticleProps = {
  article: Article;
  score?: number;
  tags?: ITag[];
  href?: string;
};

export default function MiniArticle({
  article,
  score = -1,
  tags = [],
  href,
}: MiniArticleProps) {
  const [showAbstract, setShowAbstract] = useState(false);
  const toggleAbstract = () => setShowAbstract(!showAbstract);
  const { t } = useTranslation();

  return (
    <div
      className={`${Style.wrapper} ${showAbstract ? Style.wrapperShow : ""}`}
    >
      {/* <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/jpswalsh/academicons@1/css/academicons.min.css"
        />
      </Head> */}
      <div className={Style.mainContent}>
        <div className={Style.content}>
          <h1 className={Style.title}>
            {href ? (
              <span className={Style.titleLink}>
                <NewTabAnchor href={href}>{article.title}</NewTabAnchor>
              </span>
            ) : (
              article.title
            )}
          </h1>
          <p>
            <span className={Style.authors}>
              {article.authors.map((author) => author[1]).join(", ")}
            </span>
            {article.journalName && <span className={Style.separator}>|</span>}
            <span className={Style.journalName}>
              {article.journalName.toUpperCase()}
            </span>
            {article.year && <span className={Style.separator}>|</span>}
            <span className={Style.date}>{article.year}</span>
          </p>
          {tags.length > 0 && (
            <div className={Style.tags}>
              <Tags tags={tags} />
            </div>
          )}
        </div>
        <div className={Style.stats}>
          {score >= 0 && score <= 1 && (
            <Stat
              top={`${Math.round(score * 100)}%`}
              bottom={t("article:relevance")}
            />
          )}
          {article.nbInCitations ? (
            <Stat
              top={`${article.nbInCitations}`}
              bottom={t("article:citations")}
            />
          ) : null}
        </div>
      </div>
      {showAbstract ? (
        <div className={Style.abstract}>
          <h3>{t("article:abstract")}</h3>
          <p>
            {article.paperAbstract.trim().length ? (
              <Abstract abstract={article.paperAbstract} />
            ) : (
              t("article:noAbstract")
            )}
          </p>
        </div>
      ) : null}
      <div className={Style.bottomRowWrapper}>
        <div className={Style.bottomRow}>
          <ToggleAbstract
            title={article.title}
            onClick={toggleAbstract}
            show={showAbstract}
          />
          <div className={Style.openIn}>
            <OpenIn article={article} />
          </div>
        </div>
      </div>
    </div>
  );
}
