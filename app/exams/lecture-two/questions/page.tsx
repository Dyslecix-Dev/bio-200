import LectureExamQuestions from "@/app/_components/_exams/LectureExamQuestions";

import { trueOrFalseQuestions, multipleChoiceQuestions, shortAnswerQuestions } from "@/app/_data/exams/lecture-two";

export default function ExamTwoQuestions() {
  return <LectureExamQuestions trueOrFalseQuestions={trueOrFalseQuestions} multipleChoiceQuestions={multipleChoiceQuestions} shortAnswerQuestions={shortAnswerQuestions} examNumber={2} />;
}
