import Style from "@styles/components/common/Tooltip.module.scss";
import { PropsWithChildren } from "react";

interface TooltipProps {
  text: string;
}

export default function Tooltip({
  text,
  children,
}: PropsWithChildren<TooltipProps>) {
  return (
    <div className={Style.tooltip}>
      <div className={Style.tooltipTextWrapper}>
        <div className={Style.tooltipText}>{text}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}
