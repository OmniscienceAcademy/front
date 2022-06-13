import { useEffect, useRef, useState } from "react";
import Style from "@styles/components/common/LoadingAnimWithBar.module.scss";
import LoadingAnim from "./LoadingAnim";
import LoadingBar from "./LoadingBar";

function useInfiniteSeries() {
  const currentValue = useRef(1);
  const getNextValue = () => {
    currentValue.current /= 1.008;
    return (1 - currentValue.current) * 100;
  };
  return getNextValue;
}

interface LoadingAnimWithBarProps {
  scale?: number;
}

export default function LoadingAnimWithBar({
  scale = 2,
}: LoadingAnimWithBarProps) {
  const getNextPourcentage = useInfiniteSeries();
  const [pourcentage, setPourcentage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (pourcentage < 100) {
        setPourcentage(getNextPourcentage());
      } else {
        clearInterval(interval);
      }
    }, 100); // approximately Duration of the animation
    return () => clearInterval(interval);
  });

  return (
    <div className={Style.wrapper} style={{ width: `${scale * 100}px` }}>
      <div className={Style.anim}>
        <LoadingAnim scale={scale} />
      </div>
      <LoadingBar pourcentage={pourcentage} className={Style.loadingBar} />
    </div>
  );
}
