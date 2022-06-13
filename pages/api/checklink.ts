import type { NextApiRequest, NextApiResponse } from "next";

async function linkChecker(link: string) {
  try {
    const response = await fetch(link, {
      mode: "no-cors",
    });
    const { status } = response;
    if (status >= 200 && status < 300) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

type checkLinkResponse =
  | {
      error: string;
    }
  | {
      result: boolean;
    };

export default async function checkLink(
  req: NextApiRequest,
  res: NextApiResponse<checkLinkResponse>,
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  const { url } = req.body;
  if (!url) {
    res.status(400).json({ error: "url is required" });
    return;
  }
  const result = await linkChecker(url as string);
  res.status(200).json({ result });
}
