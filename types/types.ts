import { useRouter } from "next/navigation";
import { ReactNode, MouseEventHandler, RefObject } from "react";

export interface BeamType {
  top: number;
  left: number;
  transition?: {
    duration?: number;
    repeatDelay?: number;
    delay?: number;
  };
}

export interface CardType {
  title: string;
  subtitle: string;
  link: string;
  className: string;
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

export interface ExamQuestionsType {
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
  router: ReturnType<typeof useRouter>;
  score: ScoreType | null;
  setScore: (score: ScoreType) => void;
  calculateScoreRef: React.RefObject<(() => ScoreType) | null>;
}

export interface FAQuestionType {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export interface FlashCardType {
  image: string;
  frontText?: string;
  backText: string;
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

export interface TimerReturnType {
  ref: RefObject<HTMLSpanElement>;
  time: number;
}

export interface TissueType {
  id: number;
  image: string;
  backText: string;
}

export interface WindowSizeType {
  width: number | undefined;
  height: number | undefined;
}

