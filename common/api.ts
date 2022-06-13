/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { API_URL } from "./envconst";
import {
  SearchResFromBackendI,
  SwipeCandidates,
  nextSwipesResponse,
  startSwipeSessionResponse,
  Article,
  SwipeCandidatesResponse,
  endOfSwipesResponse,
  SwipeChoices,
  getArticlesIDsResponse,
  getArticlesIDResponse,
  getTopArticlesIDResponse,
  getArticleByIDResult,
  Destructor,
  StartSwipeSessionReturn,
  apiPapers,
  ResultsResponse,
  ParsedResultsResponse,
  ResultArticle,
  ResultAnswer,
  ResultQuestion,
  autocompletionResponse,
} from "./types";
import { PromiseCanceller } from "./utils";

async function getAPI<T>(
  route: string,
  init?: RequestInit,
  api_url = API_URL,
): Promise<T | string | null> {
  try {
    const res = await fetch(`${api_url}/${route}/`, {
      ...init,
      method: "GET",
    });
    const data: T & {
      error?: string;
    } = await res.json();
    return data.error || data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("get API error, route :", route, "error:", e);
    return null;
  }
}

async function postAPI<T, P>(
  route: string,
  body: P,
  contentType = "application/json",
  init: RequestInit = {},
  api_url = API_URL,
): Promise<T | string | null> {
  try {
    const res = await fetch(`${api_url}/${route}/`, {
      headers: {
        "Content-Type": contentType,
      },
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    });
    const data: T & {
      error?: string;
    } = await res.json();
    return data.error || data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("post API error, route :", route, "error:", e);
    return null;
  }
}

export function formatSearchRes(obj: SearchResFromBackendI): Article[] {
  return obj.hits.hits.map((hit) => hit._source);
}

export async function searchAPI(str: string) {
  const result = await getAPI<SearchResFromBackendI>(`search/${str}`);
  if (result === null) {
    return null;
  }
  if (typeof result === "string") {
    console.error("search API error", result);
    return null;
  }
  return formatSearchRes(result);
}

export async function getTopArticlesIDs() {
  const result = await getAPI<getTopArticlesIDResponse>("top-articles");
  if (result === null) {
    return [];
  }
  if (typeof result === "string") {
    console.error("getTopArticlesIDs error", result);
    return [];
  }
  return result.top_articles;
}

export async function getArticlesByIDs(
  query: string | undefined,
  ...ids: string[][]
): Promise<Article[][] | null> {
  if (ids.flat().length === 0) return [];

  const results = await postAPI<
    getArticlesIDsResponse,
    { ids: string[]; query: string | undefined }
  >("get-articles-by-id", { ids: ids.flat(), query });

  if (results === null) {
    return null;
  }

  if (typeof results === "string") {
    console.error("getArticlesByIDs error", results, "ids: ", ids);
    return null;
  }
  let error = false;
  const articles = ids.map((idsArr) =>
    idsArr.map((id) => {
      // la nouvelle version du back utilise des id entiers (art.id)
      // A terme, on pourrait changer le type dans le front (ids)
      // (de str à bigint) pour repasser à ===
      // eslint-disable-next-line eqeqeq
      const article = results.articles.find((art) => art.id == id);
      if (article) {
        return article;
      }
      console.error("getArticlesByIDs error, article not found", id);
      error = true;
      return null;
    }),
  );
  if (error) {
    return articles.map((a) => a.filter((b) => b !== null) as Article[]);
  }
  return articles as Article[][];
}

export async function getArticleByID(
  id: string,
): Promise<getArticleByIDResult | null> {
  const result = await getAPI<getArticlesIDResponse>(`get-article-by-id/${id}`);
  if (result === null) {
    return null;
  }
  if (typeof result === "string") {
    console.error("getArticleByID error", result);
    return null;
  }

  const articles = await getArticlesByIDs(
    undefined,
    [id],
    result.similar_articles,
    result.similar_articles_not_cited_by_us,
    result.top_articles_cited,
    result.top_articles_citing,
  );
  if (articles === null) {
    return null;
  }

  const [
    [article],
    similar_articles,
    similar_articles_not_cited_by_us,
    top_articles_cited,
    top_articles_citing,
  ] = articles;
  return {
    article,
    similar_articles,
    similar_articles_not_cited_by_us,
    top_articles_cited,
    top_articles_citing,
  };
}

export async function getCandidatesArticles(
  query: string,
  swipeData: SwipeCandidatesResponse,
  positiveSwipeCount: number,
  negativeSwipeCount: number,
  resume: boolean,
  current_article: apiPapers | null,
  ...ids: string[]
): Promise<[SwipeCandidates, Article[]] | null> {
  let res = null;
  const tmp = current_article && resume ? [current_article.id] : [];
  if (
    swipeData.positive_swipe_alternative.next_article_to_propose &&
    swipeData.negative_swipe_alternative.next_article_to_propose
  ) {
    res = await getArticlesByIDs(
      query,
      [swipeData.positive_swipe_alternative.next_article_to_propose.id],
      [swipeData.negative_swipe_alternative.next_article_to_propose.id],
      ids,
      tmp,
    );
  } else if (swipeData.positive_swipe_alternative.next_article_to_propose) {
    res = await getArticlesByIDs(
      query,
      [swipeData.positive_swipe_alternative.next_article_to_propose.id],
      [],
      ids,
      tmp,
    );
  } else if (swipeData.negative_swipe_alternative.next_article_to_propose) {
    res = await getArticlesByIDs(
      query,
      [],
      [swipeData.negative_swipe_alternative.next_article_to_propose.id],
      ids,
      tmp,
    );
  } else {
    res = await getArticlesByIDs(query, [], [], ids, tmp);
  }
  if (res === null) {
    return null;
  }
  const [[positiveSwipe], [negativeSwipe], other, [currentArticle]] = res;
  return [
    new SwipeCandidates(
      currentArticle,
      positiveSwipe,
      negativeSwipe,
      query,
      positiveSwipeCount,
      negativeSwipeCount,
      resume,
    ),
    other,
  ];
}

const swipesErrors = [
  "no paper",
  "no more papers",
  "no session",
  null,
] as const;

export type SwipesErrorsT = typeof swipesErrors[number];

export async function startSwipeSession(
  query: string,
): Promise<StartSwipeSessionReturn | SwipesErrorsT> {
  const result = await getAPI<startSwipeSessionResponse>(
    `initialize-swipe/${query}`,
  );
  if (result === null) {
    return null;
  }
  if (typeof result === "string") {
    switch (result) {
      case "There is not enough matching papers in our database.":
        return "no paper";
      default:
        console.error("start swipe session error", result);
        return null;
    }
  }
  if (result.current_article === null) {
    return "no paper";
  }
  const candidatesResults = await getCandidatesArticles(
    query,
    result.future_alternatives,
    0,
    0,
    false,
    null,
    result.current_article.id,
  );
  if (candidatesResults === null) {
    return null;
  }
  const [candidates, [article]] = candidatesResults;
  // return { article, candidates };
  return new StartSwipeSessionReturn(article, candidates, result.session_id);
}

export async function directResults(
  query: string,
  startYear: number,
  endYear: number,
): Promise<string | null> {
  const result = await getAPI<endOfSwipesResponse>(
    `get-direct-results/${query}/${startYear}/${endYear}`,
  );
  if (result === null) {
    return null;
  }
  if (typeof result === "string") {
    console.error("end of swipes error", result);
    return null;
  }
  return result.swipe_session_token;
}

export async function autocompletion(
  query: string,
): Promise<autocompletionResponse> {
  const result = await getAPI<autocompletionResponse>(
    `get-autocompletion/${query}`,
  );

  const errorResult = { autocompletion: [{ key: 0, type: "", name: query }] };
  if (result === null) {
    console.error("error autocommpletion", result);
    return errorResult;
  }
  if (typeof result === "string") {
    console.error("error autocommpletion", result);
    return errorResult;
  }
  return result;
}

async function getSwipe(
  url: string,
  resume: boolean,
): Promise<SwipeCandidates | SwipesErrorsT> {
  const result = await getAPI<nextSwipesResponse>(url);
  if (result === null) {
    return null;
  }
  if (typeof result === "string") {
    switch (result) {
      case "There is not enough matching papers in our database":
        return "no more papers";
      case "You must initialize a swipe session first.":
        return "no session";
      default:
        console.error("next swipe error:", result);
        return null;
    }
  }
  if (result.info) {
    switch (result.info) {
      case "no more papers to show":
        return "no more papers";
      default:
        console.error("next swipe error:", result.info);
        return null;
    }
  }
  const swipeData = await getCandidatesArticles(
    result.user_query,
    result.future_alternatives,
    result.positive_count,
    result.negative_count,
    resume,
    result.current_article,
  );
  if (swipeData === null) {
    return null;
  }

  const [candidates] = swipeData;

  if (candidates.isEnd()) {
    return "no more papers";
  }
  return candidates;
}

export async function getNextSwipe(
  swipeChoice: SwipeChoices,
  session_id: string,
): Promise<SwipeCandidates | SwipesErrorsT> {
  return getSwipe(`swipe/${swipeChoice}/${session_id}`, false);
}

export async function resumeSwipeSession(
  session_id: string,
): Promise<SwipeCandidates | SwipesErrorsT> {
  return getSwipe(`resume-swipe/${session_id}`, true);
}

export async function endOfSwipes(session_id: string): Promise<string | null> {
  const result = await getAPI<endOfSwipesResponse>(`end-swipe/${session_id}`);
  if (result === null) {
    return null;
  }
  if (typeof result === "string") {
    console.error("end of swipes error", result);
    return null;
  }
  return result.swipe_session_token;
}

export async function getResults(
  resultsId: string,
): Promise<ParsedResultsResponse | null> {
  const res = await getAPI<ResultsResponse>(`get-results-swipe/${resultsId}`);
  if (res === null) {
    return null;
  }
  if (typeof res === "string") {
    console.error("getResults error", res);
    return null;
  }
  const {
    articles: resultArticles,
    user_query,
    questions: resultQuestions,
    related_search,
    main_answer,
    wikipedia,
    yearRange,
    extrYearRange,
  } = res as ResultsResponse;

  const articlesIds = resultArticles.map((a) => a.id);
  const answersArticlesIds = resultQuestions.flatMap((q) =>
    q.answers.map((a) => a.article_id),
  );

  const mainAnswerArticleId = main_answer ? [main_answer.article_id] : [];

  const articleResponse = await getArticlesByIDs(
    user_query,
    articlesIds,
    answersArticlesIds,
    mainAnswerArticleId,
  );

  if (articleResponse === null) {
    return null;
  }

  const [articles, answersArticles, mainAnswerArticle] = articleResponse;

  const parsedArticles: ResultArticle[] = articles
    ? articles.map((a, i) => ({
        ...a,
        ...resultArticles[i],
      }))
    : [
        {
          id: "",
          title: "Sorry, no results found.",
          paperAbstract: "Sorry, you can try to reformulate your query.",
          authors: [],
          nbInCitations: 404,
          nbOutCitations: 404,
          year: 404,
          s2Url: "https://omniscience.academy/",
          sources: [],
          pdfUrls: ["https://omniscience.academy/"],
          venue: "OmniScience and Co",
          journalName: "OmniScience and Co",
          journalVolume: "404",
          journalPages: "404",
          doi: "",
          doiUrl: "",
          pmid: "",
          fieldsOfStudy: ["Omniscience"],
          magId: "",
          s2PdfUrl: "",
          entities: [],
          tldr: "Sorry, you can try to reformulate your query.",
          score: 4.04,
          tags: [],
        },
      ];

  const parsedMainAnswer: ResultAnswer | null = main_answer
    ? {
        article: mainAnswerArticle[0],
        answer: main_answer.answer,
      }
    : null;

  const parsedQuestions: ResultQuestion[] = resultQuestions.map((q) => ({
    ...q,
    answers: q.answers.map((a) => ({
      ...a,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      article: answersArticles.find(({ id }) => id === a.article_id)!,
    })),
  }));

  return {
    articles: parsedArticles,
    user_query,
    related_search,
    wikipedia,
    main_answer: parsedMainAnswer,
    questions: parsedQuestions,
    yearRange,
    extrYearRange,
  };
}

async function checkLink(url: string) {
  const result = await postAPI<{ result: boolean }, { url: string }>(
    "checklink",
    { url },
    undefined,
    undefined,
    "/api",
  );
  if (result === null) {
    return false;
  }
  if (typeof result === "string") {
    console.error("checkLink error", result);
    return false;
  }
  return result.result;
}

const linkMap = new Map<string, boolean>();

export function linkChecker(
  url: string | undefined,
  callback: (result: boolean) => void,
): Destructor | undefined {
  if (url === undefined || url.trim().length === 0) {
    callback(false);
    return undefined;
  }
  const result = linkMap.get(url);
  if (result !== undefined) {
    callback(result);
    return undefined;
  }
  const promise = new PromiseCanceller(checkLink(url), (res) => {
    linkMap.set(url, res);
    callback(res);
  });
  return () => promise.cancel();
}

export function linkCheckClear() {
  linkMap.clear();
}
