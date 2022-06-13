import { WikipediaResponse } from "@common/types";

import Style from "@styles/components/Results/WikipediaInfos.module.scss";

interface WikipediaInfosProps {
  infos: WikipediaResponse | null;
}

export default function WikipediaInfos({ infos }: WikipediaInfosProps) {
  return (
    <div className={Style.wrapper}>
      {infos && (
        <div className={Style.content}>
          <p className={Style.title}>
            <a href={infos.url}>{infos.title}</a>
          </p>
          <p className={Style.text}>{infos.text}</p>
        </div>
      )}
    </div>
  );
}
