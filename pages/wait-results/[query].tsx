import { useRouter } from "next/router";
import { useEffect } from "react";
import Style from "@styles/wait-results.module.scss";
import { directResults } from "../../common/api";
import { queryToString } from "../../common/utils";
import LoadingAnimWithBar from "../../components/common/LoadingAnimWithBar";

function Wait() {
  const router = useRouter();
  const { query } = router.query;
  const { startYear, endYear } = router.query;

  const startYearParsed = parseInt((startYear as string) ?? "0", 10);
  const endYearParsed = parseInt((endYear as string) ?? "0", 10);
  const stringQuery = queryToString(query);

  useEffect(() => {
    directResults(stringQuery, startYearParsed, endYearParsed).then((tokenid) => {
      if (tokenid) {
        router.push({
          pathname: "/results",
          query: {
            tokenid,
          },
        });
      } else {
        router.push({
          pathname: "/",
          query: {
            error: "Sorry. There was no article matching your query.",
          },
        });
      }
    });
  }, [router, stringQuery, startYearParsed, endYearParsed]);

  return (
    <div className={Style.wrapper2}>
      <LoadingAnimWithBar />
      <div className={Style.waitMessage}>Please wait a few seconds...</div>
    </div>
  );
}

export default Wait;
