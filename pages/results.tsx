import Style from "@styles/Results.module.scss";
import {
  ResultAnswer,
  ResultArticle,
  ResultQuestion,
  WikipediaResponse,
  IYearRange,
} from "@common/types";
import { GetServerSideProps } from "next";

import useTranslation from "next-translate/useTranslation";
import { queryToString } from "@common/utils";
import { getResults } from "@common/api";
import Head from "next/head";
import {
  defaultSort,
  ResultArticles,
  sortChoicesArr,
  sortChoicesT,
} from "@components/Results/ResultArticles";
import RelatedSearches from "@components/Results/RelatedSearches";
import MainAnswer from "@components/Results/MainAnswer";
import QNA from "@components/Results/QNA";
import WikipediaInfos from "@components/Results/WikipediaInfos";
import { YearRangePicker } from "react-year-range-picker";
import { useState } from "react";
import SearchBar from "../components/Home/SearchBar";
import { handleSearch } from ".";

interface ResultsProps {
  articles: ResultArticle[];
  sort: sortChoicesT;
  userQuery: string;
  questions: ResultQuestion[];
  relatedSearches: string[];
  mainAnswer: ResultAnswer | null;
  wikipedia: WikipediaResponse | null;
  yearRange: IYearRange;
  extrYearRange: IYearRange;
}

export default function Results({
  sort,
  userQuery,
  articles,
  questions,
  relatedSearches,
  mainAnswer,
  wikipedia,
  yearRange,
  extrYearRange,
}: ResultsProps) {
  const { t } = useTranslation();

  const [currentYearRangeInit, setCurrentYearRange] = useState(yearRange);

  return (
    <div className={Style.wrapper}>
      <Head>
        <title>
          {t("results:resultsPageTitle", {
            query: userQuery,
          })}
        </title>
        <meta
          name="description"
          content={t("descriptions:results", { query: userQuery })}
        />
      </Head>
      <div className={Style.header}>
        <div className={Style.searchBarWrapper}>
          <SearchBar
            className={Style.searchBar}
            onSearch={handleSearch}
            initialInput={userQuery}
            autofocus={false}
            yearRange={currentYearRangeInit}
          />
          <div className={Style.yearPicker}>
            <YearRangePicker
              startText={`${String(currentYearRangeInit.startYear)}`}
              endText={`${String(currentYearRangeInit.endYear)}`}
              minYear={extrYearRange.startYear}
              maxYear={2022}
              startYear={currentYearRangeInit.startYear}
              endYear={currentYearRangeInit.endYear}
              onSelect={(startYear: number, endYear: number) => {
                setCurrentYearRange({ startYear, endYear });
              }}
            />
          </div>
        </div>
      </div>
      <div className={Style.content}>
        <div className={Style.topContent}>
          {(mainAnswer || questions.length > 0) && (
            <div className={Style.leftTopContent}>
              {mainAnswer && <MainAnswer mainAnswer={mainAnswer} />}
              {questions.length > 0 && <QNA questions={questions} />}
            </div>
          )}
          {(mainAnswer || questions.length > 0) && (
            <div className={Style.rightTopContent}>
              <WikipediaInfos infos={wikipedia} />
            </div>
          )}
        </div>
        <ResultArticles articles={articles} sortBy={sort} />
        <RelatedSearches relatedSearches={relatedSearches} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<ResultsProps> = async (
  context,
) => {
  const { tokenid, sort: sortQuery } = context.query;
  const tokenId = queryToString(tokenid);
  const sortQueryParsed = queryToString(sortQuery);
  const sort: sortChoicesT = sortChoicesArr.includes(
    sortQueryParsed as sortChoicesT,
  )
    ? (sortQueryParsed as sortChoicesT)
    : defaultSort;

  const results = await getResults(tokenId);

  if (results === null) {
    return {
      notFound: true,
    };
  }

  const {
    user_query,
    articles,
    questions,
    related_search,
    main_answer,
    wikipedia,
    yearRange,
    extrYearRange,
  } = results;

  const res = {
    userQuery: user_query,
    sort,
    articles,
    questions,
    relatedSearches: related_search,
    wikipedia,
    mainAnswer: main_answer,
    yearRange,
    extrYearRange,
  };

  return { props: JSON.parse(JSON.stringify(res)) };
};
