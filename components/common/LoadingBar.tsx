import Style from "@styles/components/common/LoadingBar.module.scss";
import { HTMLAttributes } from "react";

interface LoadingBarProps extends HTMLAttributes<HTMLDivElement> {
  pourcentage: number;
}

export default function LoadingBar({
  pourcentage,
  className,
  ...divProps
}: LoadingBarProps) {
  return (
    <div {...divProps} className={`${Style.loadingBarWrapper} ${className}`}>
      <div className={Style.loadingBar} style={{ width: `${pourcentage}%` }} />
    </div>
  );
}
