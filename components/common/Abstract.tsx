import { spaceInAbstract } from "@common/utils";
import { ComponentsInterpolation } from "text2components";
import Style from "@styles/components/common/Abstract.module.scss";

export interface AbstractProps {
  abstract: string;
}

export default function Abstract({ abstract }: AbstractProps) {
  return (
    <ComponentsInterpolation
      text={spaceInAbstract(abstract)}
      components={{ sup: <sup />, b: <span className={Style.bold} /> }}
    />
  );
}
