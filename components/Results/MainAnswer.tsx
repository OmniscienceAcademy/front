import { ResultAnswer } from "@common/types";
import Style from "@styles/components/Results/MainAnswer.module.scss";
import { Answer } from "./QNA";

interface MainAnswerProps {
  mainAnswer: ResultAnswer | null;
}

export default function MainAnswer({ mainAnswer }: MainAnswerProps) {
  if (!mainAnswer) {
    return null;
  }
  const { answer, article } = mainAnswer;
  return (
    <div className={Style.wrapper}>
      <Answer answer={answer} article={article} />
    </div>
  );
}
