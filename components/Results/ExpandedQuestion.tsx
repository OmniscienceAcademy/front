import { ResultAnswer } from "@common/types";
import { handleEnterKeyDown } from "@common/utils";
import { GrClose } from "react-icons/gr";
import Style from "@styles/components/Results/ExpandedQuestion.module.scss";
import useTranslation from "next-translate/useTranslation";
import Answer from "./Answer";

interface ExpandedArticleProps {
  onClose: () => void;
  question: string;
  answers: ResultAnswer[];
}

export default function ExpandedArticle({
  onClose,
  question,
  answers,
}: ExpandedArticleProps) {
  const { t } = useTranslation();

  return (
    <div className={Style.wrapper}>
      <div className={Style.content}>
        <p className={Style.question}>{question}</p>
        {answers.map((answer) => (
          <Answer key={answer.answer} answer={answer} />
        ))}
      </div>
      {onClose && (
        <div
          tabIndex={0}
          role="button"
          className={`${Style.close} btn`}
          onClick={onClose}
          onKeyDown={handleEnterKeyDown(onClose)}
          aria-label={t("results:closeArticleAriaLabel")}
        >
          <GrClose />
        </div>
      )}
    </div>
  );
}
