import { useRouter } from "next/navigation";
import { ReactNode, MouseEventHandler, RefObject, Dispatch, SetStateAction } from "react";

import { MotionProps } from "motion/react";

export interface BeamType {
  top: number;
  left: number;
  transition?: {
    duration?: number;
    repeatDelay?: number;
    delay?: number;
  };
}

export interface BlockType extends MotionProps {
  children?: ReactNode;
  className?: string;
}

export interface CardType {
  title: string;
  subtitle: string;
  link: string;
  className: string;
}

export interface ContactFormDataType {
  [key: string]: string;
  user: string;
  email: string;
}

export interface ContactFormQuestionType {
  key: string;
  text: string;
  postfix: string;
  complete: boolean;
  value: string;
}

export interface CountdownTimeType {
  unit: "Hour" | "Minute" | "Second";
  text: string;
  startTime: number;
  totalDuration: number;
}

export interface CountdownType {
  onTimeUp?: () => void;
}

export interface CurLineType {
  text: string;
  focused: boolean;
  setText: (text: string) => void;
  setFocused: (focused: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  command: string | null;
  handleSubmitLine: (text: string) => void;
  containerRef: RefObject<HTMLDivElement | null>;
}

export interface ExamQuestionsType {
  trueOrFalseQuestions: QuestionType[];
  multipleChoiceQuestions: QuestionType[];
  shortAnswerQuestions: ShortAnswerQuestionType[];
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
  router: ReturnType<typeof useRouter>;
  score: ScoreType | null;
  setScore: (score: ScoreType) => void;
  calculateScoreRef: RefObject<(() => ScoreType) | null>;
}

export interface FAQuestionType {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export interface FlashCardType {
  id: string;
  topic: string;
  frontText?: string;
  backText?: string;
  frontImage?: string;
  backImage?: string;
  grade: number;
  attempts: number;
}

export interface NavLinkType {
  link?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children: ReactNode;
}

export interface NotificationType {
  id: string;
  text: string;
  removeNotif: (id?: string) => void;
}

export interface OptionType {
  text: string;
  correct: boolean;
}

export interface QuestionType {
  question: string;
  options: OptionType[];
}

export interface ScoreType {
  correctAnswers: number;
  totalQuestions: number;
}

export interface ShortAnswerQuestionType {
  question: string;
  answer: string;
}

export interface SplashButtonType {
  className: string;
  type: "button" | "submit" | "reset";
  disabled: boolean;
  children: ReactNode;
}

export interface SquareImageType {
  id: number;
  src: string;
}

export interface StackedNotificationType {
  isNotifOpen: boolean;
  setIsNotifOpen: (isOpen: boolean) => void;
  message: string | null;
}

export interface SummaryType {
  questions: ContactFormQuestionType[];
  setQuestions: Dispatch<SetStateAction<ContactFormQuestionType[]>>;
  loading: boolean;
  user: { name: string; email: string } | null;
}

export interface TimerReturnType {
  ref: RefObject<HTMLSpanElement>;
  time: number;
}

export type UserFlashCardProgressType = {
  grade: number;
  attempts: number;
  user_id: string;
};

export interface UserType {
  id: string;
  name: string;
  online: boolean;
  socials?: {
    instagram?: string;
    x?: string;
    tiktok?: string;
    youtube?: string;
  };
  location?: string;
  description?: string;
  studyStreak: number;
}

export interface WindowSizeType {
  width: number | undefined;
  height: number | undefined;
}

