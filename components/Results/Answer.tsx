import { ResultAnswer } from "@common/types";
import Style from "@styles/components/Results/Answer.module.scss";
import useTranslation from "next-translate/useTranslation";
import Abstract from "@components/common/Abstract";
import NewTabAnchor from "@components/common/NewTabAnchor";

interface AnswerArticleProps {
  answer: ResultAnswer;
}
export default function AnswerArticle({ answer }: AnswerArticleProps) {
  const { t } = useTranslation();
  const { article } = answer;
  return (
    <div className={Style.articleWrapper}>
      <div className={Style.mainContent}>
        <div className={Style.articleContent}>
          <div className={`${Style.titleLink} btn`}>
            <NewTabAnchor
              href={`/article/${article.id}`}
              aria-label={t("results:openTtitleAriaLabel")}
            >
              {article.title}
            </NewTabAnchor>
          </div>
          <p className={Style.authorsAndJournalParagraph}>
            <span className={Style.authors}>
              {article.authors.map((author) => author[1]).join(", ")}
            </span>
            {article.journalName && <span className={Style.separator}>|</span>}
            <span className={Style.journalName}>
              {article.journalName.toUpperCase()}
            </span>
            <span className={Style.separator}>|</span>
            <span className={Style.date}>{article.year}</span>
          </p>
        </div>
      </div>
      <p className={Style.articleAbstract}>
        <Abstract abstract={article.tldr} />
      </p>
      {/* <div className={StyleModule.openWrapper}>
        <div
          className={StyleModule.open}
          role="button"
          tabIndex={0}
          onKeyDown={handleEnterKeyDown(() => openURL(article.id))}
          onClick={() => openURL(article.id)}
          aria-label={t("results:seeRelatedArticleAriaLabel")}
        >
          {t("results:seeRelatedArticle")} <CgArrowsExpandLeft />
        </div>
      </div> */}
    </div>
  );
}
