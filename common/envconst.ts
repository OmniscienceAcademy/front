export const dev: boolean = process.env.NODE_ENV !== "production";

export const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "https://aws.omniscienceapiprod.com";
