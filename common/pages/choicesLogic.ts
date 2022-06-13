import {
  endOfSwipes,
  getNextSwipe,
  resumeSwipeSession,
  startSwipeSession,
  SwipesErrorsT,
} from "@common/api";
import {
  Article,
  StartSwipeSessionReturn,
  SwipeCandidates,
  SwipeChoices,
} from "@common/types";
import { pushNewQuery } from "@common/utils";
import { usePromiseCanceller } from "@common/utils/hooks";
import { useRouter } from "next/router";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

const animationDuration = 1500;

interface stateI {
  article: Article | null;
  animatedArticle: Article | null;
  nextArticleCandidates: SwipeCandidates | null;
  loading: boolean;
  error: SwipesErrorsT | boolean;
  noCandidates: boolean;
  swipeCount: number;
  nextSwipe: SwipeChoices | null;
  nextArticle: Article | null;
  savedSwipe: SwipeChoices | null;
  lastArticle: boolean;
  finalize: boolean;
  inc: boolean;
}

const defaultState: stateI = {
  article: null,
  animatedArticle: null,
  nextArticleCandidates: null,
  nextArticle: null,
  savedSwipe: null,
  loading: true,
  error: false,
  noCandidates: false,
  swipeCount: 0,
  nextSwipe: null,
  lastArticle: false,
  finalize: false,
  inc: true /* used to trigger next swipe data load useEffect when
  savedSwipe is loaded in nextSwipe but savedSwipe == nextSwipe, just flip it */,
};

type actionT =
  | SwipeChoices
  | "ANIMATION_END"
  | "FINALIZE"
  | SwipeCandidates
  | SwipesErrorsT
  | StartSwipeSessionReturn;

function onClickReducer(click: SwipeChoices, state: stateI): stateI {
  if (state.savedSwipe) return { ...state }; // if already loading do nothing
  if (!state.nextArticleCandidates) {
    if (state.lastArticle) {
      return {
        ...state,
        swipeCount: state.swipeCount + (click === "positive" ? 1 : 0),
        nextSwipe: click,
        savedSwipe: null,
        noCandidates: true,
        animatedArticle: state.article,
        article: null,
        inc: !state.inc,
      };
    }
    // if next candidates not loaded yet
    return {
      ...state,
      animatedArticle: state.article,
      article: null,
      savedSwipe: click,
      swipeCount: state.swipeCount + (click === "positive" ? 1 : 0),
      nextSwipe: state.nextSwipe,
      noCandidates: state.lastArticle,
    };
  }
  const nextArticle =
    click === "positive"
      ? state.nextArticleCandidates.positiveSwipe
      : state.nextArticleCandidates.negativeSwipe;
  return {
    ...state,
    animatedArticle: state.article,
    article: null,
    nextArticle,
    swipeCount: state.swipeCount + (click === "positive" ? 1 : 0),
    nextSwipe: click,
    nextArticleCandidates: null,
    noCandidates: state.lastArticle,
  };
}

function onNewCandidatesReducer(
  candidates: SwipeCandidates,
  state: stateI,
): stateI {
  if (candidates.resume) {
    return {
      ...state,
      nextArticleCandidates: candidates,
      article: candidates.currentArticle,
      loading: false,
      swipeCount: candidates.positiveSwipeCount,
    };
  }
  if (!state.nextSwipe) return state;
  if (state.article || state.animatedArticle) {
    return {
      ...state,
      nextArticleCandidates: candidates,
      nextSwipe: state.savedSwipe,
      savedSwipe: null,
      inc: !state.inc,
    };
  }
  const nextArticle =
    state.nextSwipe === "negative"
      ? candidates.negativeSwipe
      : candidates.positiveSwipe;
  return {
    ...state,
    article: nextArticle,
    nextSwipe: state.savedSwipe,
    savedSwipe: null,
    loading: false,
    inc: !state.inc,
  };
}

function onAnimationEndReducer(state: stateI): stateI {
  if (!state.nextArticle) {
    // next article not loaded yet
    return {
      ...state,
      loading: !state.lastArticle,
      article: null,
      animatedArticle: null,
    };
  }
  return {
    ...state,
    article: state.nextArticle, // cascade nextArticle to article
    nextArticle: null, // remove nextArticle
    animatedArticle: null, // remove animatedArticle
  };
}

function reducer(state: stateI, action: actionT): stateI {
  if (typeof action === "string") {
    switch (action) {
      case "FINALIZE": // triggered at the end, waiting for results
        return {
          ...state,
          article: null,
          animatedArticle: null,
          nextSwipe: null,
          loading: true,
          finalize: true,
        };
      // clicks
      case "positive":
      case "negative":
        return onClickReducer(action, state);
      // end of animation
      case "ANIMATION_END":
        return onAnimationEndReducer(state);
      // errors
      case "no more papers":
        return {
          ...state,
          lastArticle: true,
        };
      case "no paper":
        return {
          ...defaultState,
          loading: false,
          noCandidates: true,
          nextSwipe: state.savedSwipe,
          savedSwipe: null,
        };
      case "no session":
      default:
        return reducer(state, null); // error
    }
  } else if (action === null) {
    // unexpected error
    return {
      ...state,
      error: true,
      article: null,
      animatedArticle: null,
      nextSwipe: null,
    };
  } else {
    if (action instanceof SwipeCandidates) {
      return onNewCandidatesReducer(action, state);
    }
    if (action instanceof StartSwipeSessionReturn) {
      return {
        ...state,
        article: action.article,
        nextArticleCandidates: action.candidates,
        loading: false,
      };
    }
  }
  return state;
}

export default function useChoicesLogic(
  token: string | null,
  userQuery: string | null,
) {
  const [
    {
      article,
      animatedArticle,
      nextSwipe,
      loading,
      error,
      noCandidates,
      inc,
      swipeCount,
      finalize,
    },
    dispatch,
  ] = useReducer(reducer, { ...defaultState });
  const [sessionToken, setSessionToken] = useState<string>("");
  const [query, setQuery] = useState(userQuery || "");
  const createNewPromise = usePromiseCanceller();
  const router = useRouter();
  const locked = useRef<boolean>(false);
  const [openAbstract, setOpenAbstract] = useState(false);

  useEffect(() => {
    if (token === null && userQuery) {
      locked.current = true;
      createNewPromise(startSwipeSession(userQuery), (res) => {
        dispatch(res);
        if (res instanceof StartSwipeSessionReturn) {
          setSessionToken(res.sessionToken);
          pushNewQuery(router, "stkn", res.sessionToken);
        }
      });
    } else if (token) {
      locked.current = true;
      createNewPromise(resumeSwipeSession(token), (res) => {
        dispatch(res);
        if (res instanceof SwipeCandidates) {
          setQuery(res.query);
          pushNewQuery(router, "srch", res.query);
        }
      });
      setSessionToken(token);
    } else {
      dispatch(null); // error, can't have no query and no token
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //! eslint want some deps here, but cause infinite loop

  const initNextStep = useCallback(
    async (swipeChoice: SwipeChoices) => {
      createNewPromise(getNextSwipe(swipeChoice, sessionToken), dispatch);
    },
    [createNewPromise, sessionToken],
  );

  useEffect(() => {
    if (!nextSwipe || loading) return;
    initNextStep(nextSwipe);
  }, [nextSwipe, inc, loading, initNextStep]); // get next swipes candidates when newSwipe is set

  const handleSwipeButton = useCallback(
    (choice: SwipeChoices) => {
      if (!article) return;
      dispatch(choice);
    },
    [article],
  );

  const handleLaunchClick = useCallback(() => {
    dispatch("FINALIZE");
    createNewPromise(endOfSwipes(sessionToken), (tokenid) => {
      if (tokenid) {
        router.push({
          pathname: "/results",
          query: {
            tokenid,
          },
        });
      } else {
        dispatch(null);
      }
    });
  }, [createNewPromise, router, sessionToken]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    if (!animatedArticle) return () => {};
    const timeout = setTimeout(() => {
      setOpenAbstract(false);
      dispatch("ANIMATION_END");
    }, animationDuration);
    return () => clearTimeout(timeout); // make sure to clear timeout on unmount
  }, [animatedArticle]);

  return {
    query,
    error,
    loading,
    swipeCount,
    finalize,
    article,
    setOpenAbstract,
    openAbstract,
    noCandidates,
    animatedArticle,
    handleSwipeButton,
    handleLaunchClick,
  };
}
