import { getTopArticlesIDs } from "@common/api";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  SitemapItemLoose,
  SitemapStream,
  streamToPromise,
  EnumChangefreq,
} from "sitemap";
import { Readable } from "stream";

const cacheTime = 30; // in minutes;

interface Cache {
  topArticles: string[] | null;
}

const cache: Cache = {
  topArticles: null,
};

async function getTopArticles() {
  if (cache.topArticles) {
    return cache.topArticles;
  }
  const topIds = await getTopArticlesIDs();
  cache.topArticles = topIds;
  setTimeout(() => {
    cache.topArticles = null;
  }, cacheTime * 60 * 1000);
  return topIds;
}

export default async function sitemap(
  req: NextApiRequest,
  res: NextApiResponse<unknown>,
) {
  const links: SitemapItemLoose[] = [
    {
      url: "/",
      changefreq: EnumChangefreq.DAILY,
      priority: 1,
    },
    {
      url: "/choices",
    },
    {
      url: "/results",
    },
  ];
  const topArticlesID = await getTopArticles();

  topArticlesID.forEach((id) => {
    links.push({
      url: `/article/${id}`,
    });
  });

  const stream = new SitemapStream({ hostname: `https://${req.headers.host}` });
  res.writeHead(200, {
    "Content-Type": "application/xml",
  });
  const xmlString = await streamToPromise(
    Readable.from(links).pipe(stream),
  ).then((data) => data.toString());

  res.end(xmlString);
}
