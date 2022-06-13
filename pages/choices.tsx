import useTranslation from "next-translate/useTranslation";
import Style from "@styles/choices.module.scss";
import SwipeArticle from "@components/Results/SwipeArticle";
import LaunchButton from "@components/common/LaunchButton";
import LoadingAnim from "@components/common/LoadingAnim";
import { handleEnterKeyDown } from "@common/utils";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { GrCircleInformation } from "react-icons/gr";
import DynamicSvg from "@components/common/DynamicSvg";
import LoadingAnimWithBar from "@components/common/LoadingAnimWithBar";
import useChoicesLogic from "@common/pages/choicesLogic";

type ChoiceProps = {
  query: string | null;
  sessionToken: string | null;
};

export default function Choices({
  query: propQuery,
  sessionToken: propToken,
}: ChoiceProps) {
  const { t } = useTranslation();

  const {
    query,
    error,
    loading,
    finalize,
    swipeCount,
    article,
    setOpenAbstract,
    openAbstract,
    noCandidates,
    animatedArticle,
    handleLaunchClick,
    handleSwipeButton,
  } = useChoicesLogic(propToken, propQuery);

  return (
    <div className={Style.wrapper}>
      <Head>
        <title>
          {t("results:choicesPageTitle", {
            query,
          })}
        </title>
        <meta
          name="description"
          content={t("descriptions:choices", { query })}
        />
      </Head>
      {error ? (
        <div className={Style.articleWrapper}>
          <div className={Style.errorWrapper}>
            <p>{t("common:errorMessage")}</p>
          </div>
        </div>
      ) : (
        <div className={Style.articleWrapper}>
          {loading && (
            <div className={Style.loadingWrapper}>
              <div className={Style.loading}>
                {swipeCount && !finalize ? (
                  <LoadingAnim />
                ) : (
                  <LoadingAnimWithBar />
                )}
              </div>
            </div>
          )}
          <div className={Style.article}>
            {article && (
              <SwipeArticle
                article={article}
                openAbstractHandler={setOpenAbstract}
                openAbstract={openAbstract}
              />
            )}
            {noCandidates && (
              <div className={Style.noCandidates}>
                {swipeCount
                  ? t("results:noMoreCandidates", {
                      buttonText: t("results:launch"),
                    })
                  : t("results:noCandidates")}
              </div>
            )}
          </div>
          {animatedArticle && (
            <div
              className={[Style.article, Style.articleWrapperAnimation].join(
                " ",
              )}
            >
              <SwipeArticle
                article={animatedArticle}
                openAbstract={openAbstract}
              />
            </div>
          )}
          {!loading && !animatedArticle && (
            <div className={Style.buttonsWrapper}>
              {(!noCandidates || animatedArticle) && (
                <div className={Style.buttons}>
                  <div
                    id="negativeSwipe"
                    className={Style.refuse}
                    role="button"
                    onClick={() => handleSwipeButton("negative")}
                    aria-label={t("results:refuseAriaLabel")}
                    onKeyDown={handleEnterKeyDown(() =>
                      handleSwipeButton("negative"),
                    )}
                    tabIndex={0}
                  >
                    <DynamicSvg src="refuse.svg" />
                  </div>
                  <div
                    id="positiveSwipe"
                    className={Style.accept}
                    role="button"
                    onClick={() => handleSwipeButton("positive")}
                    aria-label={t("results:acceptAriaLabel")}
                    onKeyDown={handleEnterKeyDown(() =>
                      handleSwipeButton("positive"),
                    )}
                    tabIndex={0}
                  >
                    <DynamicSvg src="accept.svg" />
                  </div>
                </div>
              )}
              {(!noCandidates || swipeCount !== 0) && (
                <div className={Style.launchButtonWrapper}>
                  <div id="finalizeResults">
                    <LaunchButton
                      textClassname={Style.launchButtonText}
                      text={t("results:launch")}
                      onClick={handleLaunchClick}
                      ariaLabel={t("results:launchBtnAriaLabel")}
                      onKeyDown={handleEnterKeyDown(handleLaunchClick)}
                      active={swipeCount >= 3 || noCandidates}
                    >
                      <DynamicSvg src="launch.svg" />
                    </LaunchButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className={`${Style.sideBarWrapper} ${"noselect"}`}>
        <div>
          <div className={Style.graphWrapper}>
            {/* TEMP */}
            <div className={Style.tempWrapper}>
              <div className={Style.tempIcon}>
                <GrCircleInformation />
              </div>
              <div className={Style.tempText}>
                <p>{t("results:tempText1")}</p>
                <p>
                  {t("results:tempText2", {
                    buttonText: t("results:launch"),
                  })}
                </p>
                <p>{t("results:tempText3")}</p>
              </div>
            </div>
            <div className={Style.tempNumber}>
              {swipeCount > 2 ? (
                <p className={Style.swipeCountSufficient}>
                  {t("results:tempText4", {
                    count: swipeCount,
                  })}
                </p>
              ) : (
                <p>
                  {t("results:tempText4", {
                    count: swipeCount,
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<ChoiceProps> = async (
  context,
) => {
  const { srch: query, stkn: sessionToken } = context.query;
  if (!query && !sessionToken) {
    // if none of the query params are set, redirect to home
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (Array.isArray(query) || Array.isArray(sessionToken)) {
    // if the query params are arrays, redirect to home
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      query: query || null, // convert undefined to null for JSON conversion
      sessionToken: sessionToken || null,
    },
  };
};
