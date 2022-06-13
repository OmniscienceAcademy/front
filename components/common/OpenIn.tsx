import { Article } from "@common/types";
import { forceLinkNewTab } from "@common/utils";
import useTranslation from "next-translate/useTranslation";
import { MdPictureAsPdf } from "react-icons/md";
import Style from "@styles/components/common/OpenIn.module.scss";
import { useValidLink } from "@common/utils/hooks";

interface OpenInProps {
  article: Article;
}

export default function OpenIn({ article }: OpenInProps) {
  const { t } = useTranslation();
  const showPdf = useValidLink(article.pdfUrls[0]);
  return (
    <>
      {(showPdf || article.s2Url) && (
        <div className={Style.linksWrapper}>
          <p>{t("article:openIn")}</p>
          <div className={Style.links}>
            {/* {article.s2Url && (
              <a
                href={article.s2Url}
                onClick={forceLinkNewTab(article.s2Url)}
                aria-label={t("article:articleLinkAriaLabel", {
                  title: article.title,
                })}
              >
                <div className="btn">
                  <i className="ai ai-semantic-scholar" />
                </div>
              </a>
            )} */}
            {(showPdf && (
              <a
                href={article.pdfUrls[0]}
                onClick={forceLinkNewTab(article.pdfUrls[0])}
                aria-label={t("article:pdfLinkAriaLabel", {
                  title: article.title,
                })}
              >
                <div className="btn">
                  <MdPictureAsPdf />
                </div>
              </a>
            )) ||
              ""}
          </div>
        </div>
      )}
    </>
  );
}
