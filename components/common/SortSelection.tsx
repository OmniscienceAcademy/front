import { KeyboardEventHandler, MouseEventHandler, useCallback } from "react";
import { OptionalPick } from "@common/types";
import Style from "@styles/components/common/SortSelection.module.scss";
import useTranslation from "next-translate/useTranslation";
import { handleEnterKeyDown } from "@common/utils";

export interface sortByButtonProps {
  sortText: string;
  Bgrd: JSX.Element;
  Icon: JSX.Element;
  onClick?: MouseEventHandler<HTMLDivElement>;
  selected: boolean;
  index: number;
  ariaLabel: string;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
}

export function SortButton({
  sortText,
  Bgrd,
  Icon,
  onClick,
  selected,
  index,
  ariaLabel,
  onKeyDown,
}: sortByButtonProps) {
  return (
    <div
      role="button"
      className={`${selected ? "" : Style.unselected} ${
        Style[`sortButtonID${index}`]
      } ${Style.sortButtonWrapper} ${"btn"}`}
      onClick={onClick}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div className={Style.sortButton}>
        <div className={Style.sortButtonBgrd}>{Bgrd}</div>
        <div className={Style.sortButtonContent}>
          <div className={Style.sortButtonIcon}>{Icon}</div>
          <p className={Style.sortButtonText}>{sortText}</p>
        </div>
      </div>
    </div>
  );
}

export interface sortChoicesProps<T> {
  sortName: T;
  props: OptionalPick<
    Omit<sortByButtonProps, "index" | "onKeyDown">,
    "selected"
  >;
}

export interface sortSelectionProps<T> {
  sortChoices: sortChoicesProps<T>[];
  sort: T;
  onChange: (sortChoice: T) => void;
}

export default function SortSelection<T extends string>({
  sortChoices,
  sort,
  onChange,
}: sortSelectionProps<T>) {
  const handleSortChange = useCallback(
    (sortChoice: T) => {
      if (sortChoice === sort) return;
      onChange(sortChoice);
    },
    [onChange, sort],
  );
  const { t } = useTranslation();
  return (
    <div className={Style.sortSelection}>
      <p className={Style.sortTitle}>{t("common:sortBy")}</p>
      <div className={Style.buttonsWrapper}>
        {sortChoices.map(({ props, sortName }, i) => (
          <SortButton
            {...props}
            key={sortName}
            selected={sort === sortName}
            index={i}
            onClick={() => handleSortChange(sortName)}
            onKeyDown={handleEnterKeyDown(() => handleSortChange(sortName))}
          />
        ))}
      </div>
    </div>
  );
}
