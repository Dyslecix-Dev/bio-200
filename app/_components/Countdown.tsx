import { useEffect, useRef, useState } from "react";
import { useAnimate } from "motion/react";
import { CountdownItemType, TimerReturnType } from "../../types/types";

const SECOND: number = 1000;
const MINUTE: number = SECOND * 60;
const HOUR: number = MINUTE * 60;

interface CountdownProps {
  onTimeUp?: () => void;
}

export default function Countdown({ onTimeUp }: CountdownProps) {
  const [startTime] = useState<number>(Date.now());

  // Modify these values to change the countdown duration
  const hours = 0;
  const minutes = 15;
  const seconds = 0;

  const totalDuration = hours * HOUR + minutes * MINUTE + seconds * SECOND;

  const handleSubmitTest = () => {
    if (onTimeUp) {
      onTimeUp();
    } else {
      // TODO Replace with toast
      alert("Time's up! Test submitted automatically.");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-indigo-600 px-2 py-0.5 text-white shadow-lg" style={{ zIndex: 9999 }}>
      <div className="mx-auto flex w-fit max-w-5xl flex-wrap items-center justify-center gap-x-4 text-xs md:text-sm">
        <CountdownItem unit="Hour" text="hours" startTime={startTime} totalDuration={totalDuration} onTimeUp={handleSubmitTest} />
        <CountdownItem unit="Minute" text="minutes" startTime={startTime} totalDuration={totalDuration} onTimeUp={handleSubmitTest} />
        <CountdownItem unit="Second" text="seconds" startTime={startTime} totalDuration={totalDuration} onTimeUp={handleSubmitTest} />
      </div>
    </div>
  );
}

const CountdownItem = ({ unit, text, startTime, totalDuration, onTimeUp }: CountdownItemType & { onTimeUp?: () => void }) => {
  const { ref, time } = useTimer(unit, startTime, totalDuration, onTimeUp);
  return (
    <div className="flex w-fit items-center justify-center gap-1.5 py-2">
      <div className="relative w-full overflow-hidden text-center">
        <span ref={ref} className="block font-mono text-sm font-semibold md:text-base">
          {time}
        </span>
      </div>
      <span>{text}</span>
    </div>
  );
};

const useTimer = (unit: "Hour" | "Minute" | "Second", startTime: number, totalDuration: number, onTimeUp?: () => void): TimerReturnType => {
  const [ref, animate] = useAnimate();
  const timeRef = useRef<number>(0);
  const [time, setTime] = useState<number>(0);
  const hasSubmitted = useRef<boolean>(false);

  useEffect(() => {
    handleCountdown();

    const intervalId = setInterval(handleCountdown, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCountdown = async (): Promise<void> => {
    const remaining = Math.max(0, totalDuration - (Date.now() - startTime));

    if (remaining === 0 && !hasSubmitted.current && onTimeUp && unit === "Second") {
      hasSubmitted.current = true;
      onTimeUp();
    }

    let newTime = 0;

    if (unit === "Hour") {
      newTime = Math.floor(remaining / HOUR);
    } else if (unit === "Minute") {
      newTime = Math.floor((remaining % HOUR) / MINUTE);
    } else {
      newTime = Math.floor((remaining % MINUTE) / SECOND);
    }

    if (newTime !== timeRef.current) {
      await animate(ref.current, { y: ["0%", "-50%"], opacity: [1, 0] }, { duration: 0.35 });
      timeRef.current = newTime;
      setTime(newTime);
      await animate(ref.current, { y: ["50%", "0%"], opacity: [0, 1] }, { duration: 0.35 });
    }
  };

  return { ref, time };
};
