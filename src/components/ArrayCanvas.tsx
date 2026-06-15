import type { Highlight, SortFrame } from "@/lib/types";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

const BAR_COLORS: Record<Highlight, string> = {
  default: "bg-bar",
  compare: "bg-compare",
  swap: "bg-swap",
  pivot: "bg-pivot",
  sorted: "bg-run",
  range: "bg-visited/70",
};

/* tiny helper: triggers re-animation on role change */
function usePulse(trigger: any) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 180);
    return () => clearTimeout(t);
  }, [trigger]);

  return pulse;
}

export function ArrayCanvas({
  frame,
  maxValue,
  showValues,
}: {
  frame: SortFrame | undefined;
  maxValue: number;
  showValues: boolean;
}) {
  if (!frame) return null;

  const n = frame.array.length;

  return (
    <div
      className="flex h-full w-full items-end gap-[3px] sm:gap-1.5"
      role="img"
      aria-label="Array bars"
    >
      {frame.array.map((value, i) => {
        const role = frame.highlights[i] ?? "default";
        const heightPct = Math.max((value / maxValue) * 100, 4);

        const pulse = usePulse(role); // 👈 key improvement

        const isSwap = role === "swap";
        const isCompare = role === "compare";

        return (
          <div
            key={i}
            className={cn(
              "flex h-full flex-1 flex-col justify-end",
              pulse && "scale-[1.05]"
            )}
            style={{
              minWidth: 2,
              transition: "transform 180ms ease-out",
            }}
          >
            <div
              className={cn(
                "w-full rounded-t-[5px] rounded-b-[2px]",
                "transition-all duration-500 ease-out",
                "origin-bottom",

                BAR_COLORS[role],

                // 🔥 stronger visual hierarchy
                isSwap &&
                  "shadow-[0_0_18px_-2px] shadow-swap/80 ring-1 ring-swap/50 animate-pulse",

                isCompare &&
                  "shadow-[0_0_14px_-2px] shadow-compare/70 ring-1 ring-compare/40",

                role === "pivot" && "ring-1 ring-pivot/60",
              )}
              style={{
                height: `${heightPct}%`,
              }}
            />

            {showValues && n <= 30 && (
              <span className="mt-1.5 text-center font-mono text-[10px] font-medium text-muted tabular-nums">
                {value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}