"use client";

import { useMotionValue, useSpring, motion } from "motion/react";
import { useEffect } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";

export function LightFollowEffect() {
  const { x, y } = useMousePosition();

  const blob1X = useMotionValue(0);
  const blob1Y = useMotionValue(0);
  const blob2X = useMotionValue(0);
  const blob2Y = useMotionValue(0);
  const blob3X = useMotionValue(0);
  const blob3Y = useMotionValue(0);

  const spring1X = useSpring(blob1X, { stiffness: 15, damping: 30 });
  const spring1Y = useSpring(blob1Y, { stiffness: 15, damping: 30 });
  const spring2X = useSpring(blob2X, { stiffness: 10, damping: 25 });
  const spring2Y = useSpring(blob2Y, { stiffness: 10, damping: 25 });
  const spring3X = useSpring(blob3X, { stiffness: 8, damping: 20 });
  const spring3Y = useSpring(blob3Y, { stiffness: 8, damping: 20 });

  useEffect(() => {
    blob1X.set(x - 150);
    blob1Y.set(y - 150);
    blob2X.set(x - 200);
    blob2Y.set(y - 200);
    blob3X.set(x - 100);
    blob3Y.set(y - 100);
  }, [x, y, blob1X, blob1Y, blob2X, blob2Y, blob3X, blob3Y]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full opacity-20"
        style={{
          x: spring1X,
          y: spring1Y,
          background:
            "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          x: spring2X,
          y: spring2Y,
          background:
            "radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full opacity-20"
        style={{
          x: spring3X,
          y: spring3Y,
          background:
            "radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
