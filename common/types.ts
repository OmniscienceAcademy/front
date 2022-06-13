/* eslint-disable max-classes-per-file */
export type Destructor = () => void;

export interface ITag {
  tag: string;
  color?: string;
}

export interface Article {
  id: string;
  title: string;
  paperAbstract: string;
  authors: [string, string][]; // id, name
  nbInCitations: number;
  nbOutCitations: number;
  year: number;
  s2Url: string;
  sources: string[];
  pdfUrls: string[];
  venue: string;
  journalName: string;
  journalVolume: string;
  journalPages: string;
  doi: string;
  doiUrl: string;
  pmid: string;
  fieldsOfStudy: string[];
  magId: string;
  s2PdfUrl: string;
  entities: never[];
  tldr: string;
}

export interface SearchResFromBackendI {
  hits: {
    total: {
      value: number;
    };
    hits: Array<{
      _id: string;
      _source: Article;
    }>;
  };
}

export type OptionalPick<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export interface apiPapers {
  id: string;
  // title: string;
  score: number;
  nbInCitations: number;
  year: number;
}

export interface SwipeAlt {
  copy_candidate_papers: apiPapers[];
  copy_negative_seed_papers: apiPapers[];
  copy_positive_seed_papers: apiPapers[];
  next_article_to_propose: apiPapers | null;
}

export interface SwipeCandidatesResponse {
  positive_swipe_alternative: SwipeAlt;
  negative_swipe_alternative: SwipeAlt;
}

export class SwipeCandidates {
  public positiveSwipe: Article | null;

  public negativeSwipe: Article | null;

  public query: string;

  public negativeSwipeCount: number;

  public positiveSwipeCount: number;

  public resume: boolean;

  public currentArticle: Article | null;

  constructor(
    article: Article | null,
    positiveSwipe: Article | undefined,
    negativeSwipe: Article | undefined,
    query: string,
    positiveSwipeCount: number,
    negativeSwipeCount: number,
    resume: boolean,
  ) {
    this.currentArticle = article;
    this.negativeSwipe = negativeSwipe || null;
    this.positiveSwipe = positiveSwipe || null;
    this.query = query;
    this.negativeSwipeCount = negativeSwipeCount;
    this.positiveSwipeCount = positiveSwipeCount;
    this.resume = resume;
  }

  public isEnd() {
    return !this.positiveSwipe && !this.negativeSwipe;
  }
}

export type SwipeChoices = "positive" | "negative";

export interface sessionStorageSwipeData {
  currentArticleID: string;
  positiveArticleID: string;
  negativeArticleID: string;
}

// API response types

export class StartSwipeSessionReturn {
  public article: Article;

  public candidates: SwipeCandidates;

  public sessionToken: string;

  constructor(
    article: Article,
    candidates: SwipeCandidates,
    sessionId: string,
  ) {
    this.article = article;
    this.candidates = candidates;
    this.sessionToken = sessionId;
  }
}

export interface nextSwipesResponse {
  current_article: apiPapers | null;
  future_alternatives: SwipeCandidatesResponse;
  negative_count: number;
  positive_count: number;
  user_query: string;
  info?: string;
}

export interface startSwipeSessionResponse extends nextSwipesResponse {
  session_id: string;
}

export interface endOfSwipesResponse {
  swipe_session_token: string;
}

export interface autocompletionResponse {
  autocompletion: { key: number; type: string; name: string }[];
}

const resultsCategoryArr = [
  "positive_swipe",
  "negative_swipe",
  "candidate_papers",
] as const;

export type resultsCategory = typeof resultsCategoryArr[number];

export const defaultResultsCategory: resultsCategory = "candidate_papers";

export interface displayedArticles extends apiPapers {
  // year: number;
  tags: ITag[];
}

export interface ResultArticle extends Article {
  score: number;
  tags: ITag[];
}

export interface ResultAnswer {
  article: Article;
  answer: string;
}

export interface ResultQuestion {
  question: string;
  answers: ResultAnswer[];
}

export interface AnswerResponse {
  answer: string;
  article_id: string;
}

export interface QuestionResponse {
  question: string;
  answers: AnswerResponse[];
}

export interface WikipediaResponse {
  title: string;
  text: string;
  url: string;
}

export interface IYearRange {
  startYear: number;
  endYear: number;
}

export interface ResultsResponse {
  articles: displayedArticles[];
  user_query: string;
  questions: QuestionResponse[];
  related_search: string[];
  main_answer: AnswerResponse | Record<string, never>;
  wikipedia: WikipediaResponse | null;
  yearRange: IYearRange;
  extrYearRange: IYearRange;
}

export interface ParsedResultsResponse {
  articles: ResultArticle[];
  user_query: string;
  questions: ResultQuestion[];
  related_search: string[];
  main_answer: ResultAnswer | null;
  wikipedia: WikipediaResponse | null;
  yearRange: IYearRange;
  extrYearRange: IYearRange;
}

export interface getArticlesIDsResponse {
  articles: Article[];
}

export const resultsHistoryLimit = 10;
export const resultsHistoryKey = "results_history";

export interface getArticlesIDResponse {
  similar_articles: string[];
  similar_articles_not_cited_by_us: string[];
  top_articles_cited: string[];
  top_articles_citing: string[];
}

export interface getTopArticlesIDResponse {
  top_articles: string[];
}

export interface getArticleByIDResult {
  article: Article;
  similar_articles: Article[];
  similar_articles_not_cited_by_us: Article[];
  top_articles_cited: Article[];
  top_articles_citing: Article[];
}
