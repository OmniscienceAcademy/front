import HomeStyle from "@styles/Home.module.scss";
import useTranslation from "next-translate/useTranslation";
import router, { useRouter } from "next/router";
import Head from "next/head";
import Card from "@components/Home/Card";
import SearchBar from "@components/Home/SearchBar";
import TransWrapper from "@components/common/TransWrapper";
import OptimizedImage from "@components/common/OptimizedImage";
import DynamicSvg from "@components/common/DynamicSvg";
import { IYearRange } from "../common/types";

const CARD_IMG_WIDTH = 60;
const CARD_IMG_HEIGHT = 80;
const ILLUSTRATION_IMG_WIDTH = 600;
const ILLUSTRATION_IMG_HEIGHT = 600;

interface IllustrationProps {
  Illustration: JSX.Element;
  title: string;
  description: string;
  reverse: boolean;
  index: number;
  bgrd: string;
}

export const handleSearch = (str: string, yearRange: IYearRange) => {
  const str_cleaned = encodeURIComponent(
    str.replace("?", "").replace("#", "").replace("&", ""),
  );
  if (!str.trim().length) return;
  router.push({
    pathname: `/wait-results/${str_cleaned}`,
    query: {
      startYear: yearRange.startYear,
      endYear: yearRange.endYear,
    },
  });
};

function IllustrationComponent({
  Illustration,
  bgrd,
  title,
  description,
  reverse,
  index,
}: IllustrationProps) {
  return (
    <div
      className={`${HomeStyle.illustration} ${
        reverse ? HomeStyle.illustrationReverse : ""
      }`}
    >
      <div className={HomeStyle.illustrationDescWrapper}>
        <h3 className={HomeStyle.illustrationTitle}>{title}</h3>
        <p className={HomeStyle.illustrationDesc}>{description}</p>
      </div>
      <div
        className={`${HomeStyle.illustrationImg} ${
          HomeStyle[`illustration${index}`]
        }`}
      >
        <div className={HomeStyle.illustrationIcon}>{Illustration}</div>
        <div
          className={HomeStyle.illustrationBgrd}
          style={{
            width: ILLUSTRATION_IMG_WIDTH,
            height: ILLUSTRATION_IMG_HEIGHT,
          }}
        >
          <OptimizedImage
            src={bgrd}
            alt="image Background"
            width={ILLUSTRATION_IMG_WIDTH}
            height={ILLUSTRATION_IMG_HEIGHT}
          />
        </div>
      </div>
    </div>
  );
}

interface cardProps {
  imgSrc: string;
  alt: string;
}

export default function Home() {
  const router2 = useRouter();
  const { error } = router2.query;
  const cards: cardProps[] = [
    {
      imgSrc: "card_img1.png",
      alt: "magnifying glass",
    },
    {
      imgSrc: "card_img2.png",
      alt: "checkbox",
    },
    {
      imgSrc: "card_img3.png",
      alt: "articles pages",
    },
  ];
  const { t } = useTranslation();
  const illustrations: Omit<IllustrationProps, "index">[] = [
    {
      Illustration: <DynamicSvg src="graph_landing1.svg" />,
      bgrd: "illustration_bgrd1.png",
      title: t("home:illustrationTitle1"),
      description: t("home:illustrationDesc1"),
      reverse: false,
    },
    {
      Illustration: <DynamicSvg src="graph_landing2.svg" width="80%" />,
      bgrd: "illustration_bgrd2.png",
      title: t("home:illustrationTitle2"),
      description: t("home:illustrationDesc2"),
      reverse: true,
    },
    {
      Illustration: <DynamicSvg src="graph_landing3.svg" />,
      bgrd: "illustration_bgrd3.png",
      title: t("home:illustrationTitle3"),
      description: t("home:illustrationDesc3"),
      reverse: false,
    },
  ];

  return (
    <>
      <Head>
        <title>{t("home:pageTitle")}</title>
        <meta name="description" content={t("descriptions:home")} />
        <meta
          name="google-site-verification"
          content="XoMyO_DuW_tzim94E0RpAwVvdbiQBPthYk5IAA-mUvU"
        />
      </Head>
      <div className={HomeStyle.gradient} />
      <div className={HomeStyle.topContainer}>
        <div className={HomeStyle.topInnerContainer}>
          <h1 id="search" className={HomeStyle.title}>
            <TransWrapper
              i18nKey="home:title"
              components={{ s: <span className={HomeStyle.onlyEco} /> }}
            />
          </h1>
          {error && <div className={HomeStyle.error}>{error}</div>}
          <div className={HomeStyle.searchBarWrapper}>
            <SearchBar
              className={HomeStyle.searchBar}
              onSearch={handleSearch}
              autofocus
              yearRange={{
                startYear: 1900,
                endYear: 2022,
              }}
            />
            <div className={HomeStyle.backdrop} />
          </div>
        </div>
      </div>
      <div className={HomeStyle.tutorialTitle}>
        <h2>
          <TransWrapper i18nKey="home:tutorialTitle" />
        </h2>
      </div>
      <div className={HomeStyle.tutorialCards}>
        {cards.map(({ imgSrc, alt }, i) => (
          <Card number={i + 1} top={i % 2 !== 1} key={t(`home:card${i + 1}`)}>
            <div className={HomeStyle.cardContent}>
              <div
                className={HomeStyle.imageWrapper}
                style={{
                  width: CARD_IMG_WIDTH,
                  height: CARD_IMG_HEIGHT,
                }}
              >
                <OptimizedImage
                  src={imgSrc}
                  alt={alt}
                  width={CARD_IMG_WIDTH}
                  height={CARD_IMG_HEIGHT}
                />
              </div>
              <div className={HomeStyle.cardText}>
                <p>
                  <TransWrapper i18nKey={`home:card${i + 1}`} />
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <DynamicSvg
        src="home_curve.svg"
        width="100%"
        preserveAspectRatio="none"
      />
      {illustrations.map((illustration, i) => (
        <IllustrationComponent
          key={illustration.title}
          {...illustration}
          index={i + 1}
        />
      ))}
    </>
  );
}
