import LabExamQuestions from "@/app/_components/_exams/LabExamQuestions";

import { questions } from "@/app/_data/exams/lab-three";

export default function LabTwoQuestions() {
  return <LabExamQuestions questions={questions} examNumber={3} />;
}
