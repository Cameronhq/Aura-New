"use client";

import { useEffect, useState, useRef } from "react";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  animate?: boolean;
}

function getScoreColor(score: number): string {
  if (score <= 25) return "#B91C1C";
  if (score <= 40) return "#DC6B3F";
  if (score <= 55) return "#D4A843";
  if (score <= 70) return "#6B9B37";
  if (score <= 85) return "#2D8A2D";
  return "#166534";
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function ScoreGauge({ score, size = 140, animate = true }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [ringProgress, setRingProgress] = useState(animate ? 0 : score);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!animate || animatedRef.current) return;
    animatedRef.current = true;

    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(eased * score);

      setDisplayScore(current);
      setRingProgress(eased * score);

      if (progress < 1) requestAnimationFrame(tick);
    };

    const delay = setTimeout(() => requestAnimationFrame(tick), 300);
    return () => clearTimeout(delay);
  }, [score, animate]);

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (ringProgress / 100) * circumference;
  const color = getScoreColor(score);
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#EEEEEC"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-extrabold tabular-nums transition-colors duration-300"
          style={{ color }}
        >
          {displayScore}
        </span>
        <span className="text-xs text-[#999] mt-0.5">/ 100</span>
      </div>
    </div>
  );
}
