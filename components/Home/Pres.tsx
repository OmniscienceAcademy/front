import { PropsWithChildren } from "react";
import PresStyle from "@styles/components/Home/Pres.module.scss";

// eslint-disable-next-line @typescript-eslint/ban-types
export default function Presentation({ children }: PropsWithChildren<{}>) {
  return (
    <div className={PresStyle.wrapper}>
      <div className={PresStyle.boxWrapper}>
        <div className={`${PresStyle.boxLeft} ${PresStyle.box}`} />
        <div className={PresStyle.box} />
      </div>
      {children}
    </div>
  );
}
