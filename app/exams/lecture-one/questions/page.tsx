import LectureExamQuestions from "@/app/_components/_exams/LectureExamQuestions";

import { trueOrFalseQuestions, multipleChoiceQuestions, shortAnswerQuestions } from "@/app/_data/exams/lecture-one";

export default function ExamOneQuestions() {
  return <LectureExamQuestions trueOrFalseQuestions={trueOrFalseQuestions} multipleChoiceQuestions={multipleChoiceQuestions} shortAnswerQuestions={shortAnswerQuestions} />;
}
