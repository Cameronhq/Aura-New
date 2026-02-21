"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function GradientButton({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className,
}: GradientButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 cursor-pointer",
    sizeMap[size],
    fullWidth && "w-full",
    disabled && "opacity-50 cursor-not-allowed",
    variant === "primary" && "btn-glow",
    variant === "secondary" &&
      "border border-white/20 bg-white/5 text-text-primary hover:bg-white/10",
    variant === "ghost" &&
      "text-text-secondary hover:text-text-primary underline-offset-4 hover:underline",
    className
  );

  const content = (
    <motion.span
      className={baseClasses}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </motion.span>
  );

  if (href && !disabled) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
