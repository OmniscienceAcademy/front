import Style from "@styles/components/common/ToggleAbstract.module.scss";
import { handleEnterKeyDown } from "@common/utils";
import useTranslation from "next-translate/useTranslation";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface ToggleAbstractProps {
  title: string;
  show: boolean;
  onClick: () => void;
}

export default function ToggleAbstract({
  title,
  show,
  onClick,
}: ToggleAbstractProps) {
  const { t } = useTranslation();
  return (
    <div className={Style.toggleAbstract}>
      <div>
        <div
          role="button"
          className="btn noselect"
          onClick={onClick}
          onKeyDown={handleEnterKeyDown(onClick)}
          tabIndex={0}
          aria-label={
            show
              ? t("article:showAbstractAriaLabel", {
                  title,
                })
              : t("article:closeAbstractAriaLabel", {
                  title,
                })
          }
        >
          <p>{show ? t("article:closeAbstract") : t("article:openAbstract")}</p>
          <div>{show ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
        </div>
      </div>
    </div>
  );
}
