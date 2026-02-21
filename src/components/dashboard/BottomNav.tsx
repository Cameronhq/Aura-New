"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "首页" },
  { href: "/dashboard/mirror", icon: User, label: "我的" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-void/80 backdrop-blur-xl">
      <div className="flex items-center justify-around py-2 pb-safe max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors",
                isActive
                  ? "text-aurora-mid"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
