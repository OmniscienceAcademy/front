import { searchAPI } from "@common/api";
import { Article } from "@common/types";
import { queryToString } from "@common/utils";
import ArticleList from "@components/common/ArticleList";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Style from "@styles/article/search.module.scss";

interface SearchProps {
  articles: Article[];
  query: string;
}

export default function Search({ articles, query }: SearchProps) {
  const { t } = useTranslation();
  return (
    <div>
      <Head>
        <title>{t("articles:searchPageTitle", { query })}</title>
      </Head>
      <h1>Articles</h1>
      <div className={Style.wrapper}>
        <ArticleList articles={articles} name={t("articles:searchListTitle")} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (
  ctx,
) => {
  const query = queryToString(ctx.query.query);
  if (query.trim().length === 0) {
    return {
      redirect: {
        destination: "/article",
        statusCode: 307, // temporary redirect
      },
    };
  }
  const articles = await searchAPI(query);
  if (articles === null) {
    return {
      notFound: true, // shouldn't express server connection error with a 404 but meh
    };
  }
  return {
    props: {
      articles,
      query,
    },
  };
};
