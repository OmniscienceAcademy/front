import { ResultArticle } from "@common/types";
import SortSelection, {
  sortChoicesProps,
} from "@components/common/SortSelection";
import Style from "@styles/components/Results/ResultsArticles.module.scss";
import MiniArticle from "@components/common/MiniArticle";
import useTranslation from "next-translate/useTranslation";
import DynamicSvg from "@components/common/DynamicSvg";
import { useCallback, useEffect, useMemo, useState } from "react";
import { handleEnterKeyDown, pushNewQuery } from "@common/utils";
import { useRouter } from "next/router";

export const sortChoicesArr = ["citation", "date", "relevance"] as const;
export type sortChoicesT = typeof sortChoicesArr[number];
export const defaultSort: sortChoicesT = "relevance";

interface ResultArticlesProps {
  articles: ResultArticle[];
  sortBy: sortChoicesT;
  handleSortChange?: (sortBy: sortChoicesT) => void;
}

export const defaultDisplayCount = 10;
const displayCountIncrement = 10;

function citationSorting(a: ResultArticle, b: ResultArticle) {
  return b.nbInCitations - a.nbInCitations;
}

function dateSorting(a: ResultArticle, b: ResultArticle) {
  if (a.year === b.year) {
    return citationSorting(a, b);
  }
  return b.year - a.year;
}

function scoreSorting(a: ResultArticle, b: ResultArticle) {
  if (a.score === b.score) {
    return citationSorting(a, b);
  }
  return b.score - a.score;
}

function sortResults(
  sort: sortChoicesT,
  articles: ResultArticle[],
): ResultArticle[] {
  switch (sort) {
    case "date":
      return articles.sort(dateSorting).slice();
    case "relevance":
      return articles.sort(scoreSorting).slice();
    case "citation":
      return articles.sort(citationSorting).slice();
    default:
      break;
  }
  return articles.sort(scoreSorting).slice();
}

const topId = "results-articles-top";

export function ResultArticles({
  articles,
  sortBy,
  handleSortChange,
}: ResultArticlesProps) {
  // const [articlesToDisplay, setArticlesToDisplay] = useState(articles);
  const [displayCount, setDisplayCount] = useState(defaultDisplayCount);
  const [sort, setSort] = useState(sortBy);
  const articlesToDisplay = useMemo(
    () => sortResults(sort, articles).slice(0, displayCount),
    [articles, sort, displayCount],
  );

  const router = useRouter();

  const { t } = useTranslation();

  const sortChoices = useMemo<sortChoicesProps<sortChoicesT>[]>(
    () => [
      {
        sortName: "date",
        props: {
          sortText: t("results:sortByDate"),
          Bgrd: <DynamicSvg src="sort_by_1.svg" />,
          Icon: <DynamicSvg src="alarm.svg" />,
          ariaLabel: t("results:sortByDateAriaLabel"),
        },
      },
      {
        sortName: "relevance",
        props: {
          sortText: t("results:sortByRelevance"),
          Bgrd: <DynamicSvg src="sort_by_2.svg" />,
          Icon: <DynamicSvg src="search_light.svg" />,
          ariaLabel: t("results:sortByRelevanceAriaLabel"),
        },
      },
      {
        sortName: "citation",
        props: {
          sortText: t("results:sortByCitations"),
          Bgrd: <DynamicSvg src="sort_by_3.svg" />,
          Icon: <DynamicSvg src="feather.svg" />,
          ariaLabel: t("results:sortByCitationsAriaLabel"),
        },
      },
    ],
    [t],
  );

  const onSort = useCallback(
    (sortChoice: sortChoicesT) => {
      handleSortChange?.(sortChoice);
      setSort(sortChoice);
      pushNewQuery(router, "sort", sortChoice);
    },
    [handleSortChange, router],
  );

  const onExpand = useCallback(() => {
    setDisplayCount((prev) => prev + displayCountIncrement);
  }, []);

  useEffect(() => {
    switch (sortBy) {
      case "date":
        articles.sort(dateSorting);
        break;
      case "relevance":
        articles.sort(scoreSorting);
        break;
      case "citation":
        articles.sort(citationSorting);
        break;
      default:
        break;
    }
  }, [articles, sortBy]);

  return (
    <div className={Style.resultsWrapper} id={topId}>
      <div className={Style.listWrapper}>
        <ul className={Style.results}>
          {articlesToDisplay.slice(0, displayCount).map((article) => (
            <li key={article.id} className={Style.article}>
              <MiniArticle
                article={article}
                score={article.score}
                tags={article.tags}
                href={`/article/${article.id}`}
              />
            </li>
          ))}
        </ul>
        {displayCount < articles.length && (
          <div
            className={Style.seeMore}
            role="button"
            tabIndex={0}
            onClick={onExpand}
            onKeyDown={handleEnterKeyDown(onExpand)}
          >
            <p>{t("results:seeMore")}</p>
          </div>
        )}
      </div>
      <div className={Style.sortByWrapper}>
        <div>
          <SortSelection<sortChoicesT>
            sortChoices={sortChoices}
            sort={sort}
            onChange={onSort}
          />
        </div>
      </div>
    </div>
  );
}
