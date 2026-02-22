"use client";

import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/format";

type CountdownHeaderProps = {
  secondsLeft: number;
  isAlert: boolean;
};

export default function CountdownHeader({ secondsLeft, isAlert }: CountdownHeaderProps) {
  const isFinished = secondsLeft <= 0;
  const timeClassName = cn(
    "text-[25px] font-extrabold leading-none tabular-nums tracking-tight sm:text-[28px] md:text-[34px] xl:text-[40px]",
    isFinished ? "text-[#d4d8dc]" : isAlert ? "animate-timer-alert text-[#ff7373]" : "text-[#f4be5f]"
  );

  return (
    <header className="sticky top-0 z-50 bg-[#2f6a52] py-1 text-center md:py-1.5">
      <p className="text-[12px] font-semibold leading-tight text-[#d5efe0] sm:text-[13px] md:text-[15px]">
        Успейте открыть пробную неделю
      </p>
      <p className={timeClassName} aria-live="polite">
        <span className="text-[10px] align-middle md:text-[13px]">▼</span> {formatTime(secondsLeft)}{" "}
        <span className="text-[10px] align-middle md:text-[13px]">▼</span>
      </p>
    </header>
  );
}
