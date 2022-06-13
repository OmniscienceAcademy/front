/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { ITag } from "@common/types";
import Style from "@styles/components/Results/Tags.module.scss";

interface KeywordsProps {
  tags?: ITag[];
}

export default function Tags({ tags = [] }: KeywordsProps) {
  if (tags.length === 0) return null;
  return (
    <div className={Style.wrapper}>
      <ul className={Style.tagList}>
        {tags.map(({ tag, color }) => (
          <li
            key={tag}
            className={Style.tag}
            style={{ backgroundColor: color }}
          >
            <p>{tag}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
