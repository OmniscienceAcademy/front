import Style from "@styles/components/common/LaunchButton.module.scss";
import {
  MouseEventHandler,
  PropsWithChildren,
  KeyboardEventHandler,
} from "react";

interface LaunchButtonProps {
  text: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  textClassname?: string;
  ariaLabel: string;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
  active?: boolean;
}

export default function LaunchButton({
  text,
  onClick,
  children,
  textClassname,
  ariaLabel,
  onKeyDown,
  active = true,
}: PropsWithChildren<LaunchButtonProps>) {
  return (
    <div
      className={`${Style.launchButton} ${
        active ? Style.active : Style.inactive
      }`}
      role="button"
      onClick={active ? onClick : undefined}
      aria-label={ariaLabel}
      onKeyDown={active ? onKeyDown : undefined}
      tabIndex={0}
    >
      <p className={textClassname}>{text}</p>
      {children}
    </div>
  );
}
