import LabExamQuestions from "@/app/_components/_exams/LabExamQuestions";

import { questions } from "@/app/_data/exams/lab-two";

export default function LabTwoQuestions() {
  return <LabExamQuestions questions={questions} examNumber={2} />;
}
