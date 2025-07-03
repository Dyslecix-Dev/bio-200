import { ReactNode, MouseEventHandler } from "react";

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

export interface WindowSizeType {
  width: number | undefined;
  height: number | undefined;
}
