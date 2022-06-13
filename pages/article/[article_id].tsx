import { getArticleByID } from "@common/api";
import { getArticleByIDResult } from "@common/types";
import { queryToString } from "@common/utils";
import SwipeArticle from "@components/Results/SwipeArticle";
import { GetServerSideProps } from "next";
import Style from "@styles/article/id.module.scss";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import ArticleList from "@components/common/ArticleList";

export default function ArticlePage({
  article,
  similar_articles,
  similar_articles_not_cited_by_us,
  top_articles_cited,
  top_articles_citing,
}: getArticleByIDResult) {
  const { t } = useTranslation();
  return (
    <div className={Style.wrapper}>
      <Head>
        <title>{t("articles:pageTitle", { title: article.title })}</title>
      </Head>
      <SwipeArticle
        article={article}
        openAbstract
        hideOpenAbstract
        allowOpenPdf
      />
      <ArticleList
        name={t("articles:similarArticles")}
        articles={similar_articles}
      />
      <ArticleList
        name={t("articles:similarNotCitedByUs")}
        articles={similar_articles_not_cited_by_us}
      />
      <ArticleList
        name={t("articles:topArticleCited")}
        articles={top_articles_cited}
      />
      <ArticleList
        name={t("articles:topArticleCiting")}
        articles={top_articles_citing}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<getArticleByIDResult> =
  async (context) => {
    const article_id = queryToString(context.query.article_id);
    const articles = await getArticleByID(article_id);

    if (articles === null) {
      return {
        notFound: true,
      };
    }

    return {
      props: articles,
    };
  };
