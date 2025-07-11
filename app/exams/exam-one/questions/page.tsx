import ExamQuestions from "@/app/_components/_exams/ExamQuestions";

import { trueOrFalseQuestions, multipleChoiceQuestions, shortAnswerQuestions } from "@/app/_data/exams/exam-one";

export default function ExamOneQuestions() {
  return <ExamQuestions trueOrFalseQuestions={trueOrFalseQuestions} multipleChoiceQuestions={multipleChoiceQuestions} shortAnswerQuestions={shortAnswerQuestions} />;
}
