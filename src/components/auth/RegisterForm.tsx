"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { GradientButton } from "@/components/shared/GradientButton";
import { Logo } from "@/components/shared/Logo";
import { useAuthStore } from "@/stores/authStore";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { register } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    const success = register(email, password);
    if (success) {
      router.push("/onboarding");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <GlassCard padding="lg" className="w-full">
        <div className="text-center mb-8">
          <Logo size="md" className="mb-4 justify-center" />
          <p className="text-text-secondary text-sm">创建你的灵气档案</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-text-secondary text-sm mb-2">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="设置密码"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-2">确认密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次输入密码"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <GradientButton onClick={() => {}} fullWidth size="md">
            <button type="submit" className="w-full">
              创建账号
            </button>
          </GradientButton>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-text-secondary text-sm hover:text-aurora-mid transition-colors"
          >
            已有账号？<span className="text-aurora-mid">登录</span>
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}
