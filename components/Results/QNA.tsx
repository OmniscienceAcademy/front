import { ResultAnswer, ResultQuestion } from "@common/types";
import { handleEnterKeyDown } from "@common/utils";
import NewTabAnchor from "@components/common/NewTabAnchor";
import Style from "@styles/components/Results/QNA.module.scss";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import { useCallback, useMemo, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { Interpolation } from "text2components";

interface QNAProps {
  questions: ResultQuestion[];
}

export function Answer({ answer, article }: ResultAnswer) {
  const first_author = article.authors[0] ? article.authors[0][1] : "";
  const author =
    first_author + ((article.authors.length === 1 && " et al") || "");
  return (
    <div className={Style.answer}>
      <p className={Style.answerText}>
        <Interpolation
          components={{
            b: <b />,
            br: <br />,
          }}
          text={answer}
        />
      </p>
      <p className={Style.answerArticleInfos}>
        <Trans
          i18nKey="results:answerArticleInfos"
          components={{
            author: <span className={Style.answerAuthor} />,
            date: <span className={Style.answerDate} />,
            journal: <span className={Style.answerJournal} />,
            link: (
              <NewTabAnchor
                className={Style.articleLink}
                href={`/article/${article.id}`}
              />
            ),
            ref: <span className={Style.answerRef} />,
          }}
          values={{
            journal: article.journalName,
            date: article.year,
            author,
          }}
        />
      </p>
    </div>
  );
}

function Answers({ answers }: { answers: ResultAnswer[] }) {
  const { t } = useTranslation();
  const [displayCount, setDisplayCount] = useState(1);

  const displayedAnswer = useMemo(
    () => answers.slice(0, displayCount),
    [displayCount, answers],
  );

  const showMore = useCallback(() => {
    setDisplayCount(answers.length);
  }, [answers]);

  return (
    <div className={Style.answers}>
      <ul>
        {displayedAnswer.map((a) => (
          <li key={a.answer}>
            <Answer {...a} />
          </li>
        ))}
      </ul>
      {answers.length > displayCount && (
        <div
          className={Style.showMoreAnswersWrapper}
          role="button"
          tabIndex={0}
          onClick={showMore}
          onKeyDown={handleEnterKeyDown(showMore)}
        >
          <div className={Style.showMoreAnswers}>
            <AiOutlineEye />
            <p>
              {t("results:showMoreAnswers", {
                count: answers.length - displayCount,
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Question({ question, answers }: ResultQuestion) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className={Style.question}>
      <div
        className={Style.questionTitle}
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        onKeyDown={handleEnterKeyDown(() => setOpen(!open))}
        aria-label={
          open
            ? t("results:closeQuestionAriaLabel")
            : t("results:expandQuestionAriaLabel")
        }
      >
        <p>{question}</p>
        <div className={Style.arrowWrapper}>
          <div className={`${Style.arrow} ${open && Style.arrowOpen}`}>
            <IoIosArrowDown />
          </div>
        </div>
      </div>
      {open && <Answers answers={answers} />}
    </div>
  );
}

export default function QNA({ questions }: QNAProps) {
  const { t } = useTranslation();
  const [displayCount, setDisplayCount] = useState(3);
  const displayedQuestions = useMemo(
    () => questions.slice(0, displayCount),
    [displayCount, questions],
  );
  const showMore = useCallback(() => {
    setDisplayCount(questions.length);
  }, [questions]);
  return (
    <div className={Style.wrapper}>
      <p className={Style.title}>{t("results:topicQuestions")}</p>
      <ul>
        <div className={Style.separator} />
        {displayedQuestions.map((q) => (
          <li key={q.question}>
            <Question {...q} />
            <div className={Style.separator} />
          </li>
        ))}
      </ul>
      {questions.length > displayCount && (
        <div
          className={Style.showMoreQuestions}
          role="button"
          tabIndex={0}
          onClick={showMore}
          onKeyDown={handleEnterKeyDown(showMore)}
        >
          <p>
            {t("results:showMoreQuestions", {
              count: questions.length - displayCount,
            })}
          </p>
        </div>
      )}
    </div>
  );
}
