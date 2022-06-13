import useTranslation from "next-translate/useTranslation";
import Style from "@styles/components/Results/RelatedSearches.module.scss";
import { AiOutlineSearch } from "react-icons/ai";
import { handleSearch } from "../../pages";
import { IYearRange } from "../../common/types";

interface RelatedSearchesProps {
  relatedSearches: string[];
}

interface RelatedSearchProps {
  relatedSearch: string;
  yearRange: IYearRange;
}

function RelatedSearchButton({ relatedSearch, yearRange }: RelatedSearchProps) {
  return (
    <button
      className={Style.relatedSearch}
      type="button"
      onClick={() => handleSearch(relatedSearch, yearRange)}
    >
      <span className={Style.icon}>
        <AiOutlineSearch />
      </span>
      <div>
        <p>{relatedSearch}</p>
      </div>
    </button>
  );
}

export default function RelatedSearches({
  relatedSearches,
}: RelatedSearchesProps) {
  const { t } = useTranslation();
  const someRelatedSearches = relatedSearches.length > 0;
  return (
    <div className={Style.wrapper}>
      <p className={Style.title}>
        {someRelatedSearches ? t("results:relatedSearches") : ""}
      </p>
      <ul className={Style.relatedSearches}>
        {relatedSearches.map((relatedSearch) => (
          <li key={relatedSearch}>
            <RelatedSearchButton
              relatedSearch={relatedSearch}
              yearRange={{ startYear: 0, endYear: 2030 }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
