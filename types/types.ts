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

export interface CountdownItemType {
  unit: "Hour" | "Minute" | "Second";
  text: string;
  startTime: number;
  totalDuration: number;
}

export interface FAQuestionType {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export interface NavLinkType {
  link?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children: ReactNode;
}

export interface SquareImageType {
  id: number;
  src: string;
}

export interface TimerReturnType {
  ref: RefObject<HTMLSpanElement>;
  time: number;
}

export interface WindowSizeType {
  width: number | undefined;
  height: number | undefined;
}

