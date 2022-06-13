import { NextRouter } from "next/router";
import { MouseEventHandler, KeyboardEvent } from "react";
import PromiseCanceller from "./PromiseCanceller";

export { PromiseCanceller };

export function deviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua,
    )
  ) {
    return "mobile";
  }
  return "desktop";
}

export function openNewTab(url: string) {
  window.open(url, "_blank");
}

export function forceLinkNewTab(url: string) {
  const func: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    openNewTab(url);
  };
  return func;
}

export function queryToString(query: string | string[] | undefined): string {
  if (query) {
    return Array.isArray(query) ? query.join("&") : query;
  }
  return "";
}

export function spaceInAbstract(abstract: string): string {
  return abstract.replace(/,(?!\s)/g, ", ").replace(/\.(?!\s)/g, ". ");
}

export function handleEnterKeyDown(cb: () => void) {
  return (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      cb();
    }
  };
}

export function createCookie(name: string, value: string, days: number) {
  let expires;
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  } else {
    expires = "";
  }
  document.cookie = `${name}=${value}${expires}; path=/`;
}

// export function getCookie(c_name: string) {
//   if (document.cookie.length > 0) {
//     let c_start = document.cookie.indexOf(`${c_name}=`);
//     if (c_start !== -1) {
//       c_start = c_start + c_name.length + 1;
//       let c_end = document.cookie.indexOf(";", c_start);
//       if (c_end === -1) {
//         c_end = document.cookie.length;
//       }
//       return document.cookie.substring(c_start, c_end);
//     }
//   }
//   return "";
// }

export function parseCookies(cookieString: string) {
  const cookies: Record<string, string> = {};
  cookieString.split(";").forEach((cookie) => {
    const [key, value] = cookie.split("=");
    cookies[key.trim()] = value;
  });
  return cookies;
}

// set body overflow to hidden, return function to reset to old value
export function disableScrolling() {
  const previous = document.body.style.overflowY;
  document.body.style.overflowY = "hidden";
  return () => {
    document.body.style.overflowY = previous;
  };
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

export function pushNewQuery<P extends string>(
  router: NextRouter,
  query: string,
  value: P,
  def?: P,
  hash?: string,
  shallow = true,
) {
  const newQuery = { ...router.query };

  if (value === undefined || value === "" || value === def) {
    delete newQuery[query];
  } else {
    newQuery[query] = value;
  }

  router.push(
    {
      pathname: router.pathname,
      hash,
      query: newQuery,
    },
    undefined,
    {
      shallow,
    },
  );
}
