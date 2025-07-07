import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// TODO use cn to clean up tailwind code
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
