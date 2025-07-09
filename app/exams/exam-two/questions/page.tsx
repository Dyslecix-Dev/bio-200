import ExamQuestions from "@/app/_components/_exams/ExamQuestions";

import { trueOrFalseQuestions, multipleChoiceQuestions, shortAnswerQuestions } from "@/app/_data/exams/exam-two";

export default function ExamTwoQuestions() {
  return <ExamQuestions trueOrFalseQuestions={trueOrFalseQuestions} multipleChoiceQuestions={multipleChoiceQuestions} shortAnswerQuestions={shortAnswerQuestions} />;
}
