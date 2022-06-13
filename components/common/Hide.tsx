import { PropsWithChildren } from "react";
import Style from "@styles/components/common/Hide.module.scss";

interface HideProps {
  hide?: boolean;
}

export default function Hide({ hide, children }: PropsWithChildren<HideProps>) {
  return (
    <div className={hide ? Style.hide : ""}>
      <div className={Style.block} />
      {children}
    </div>
  );
}
