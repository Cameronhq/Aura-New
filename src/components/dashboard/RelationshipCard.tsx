"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Relationship } from "@/types/relationship";
import { User } from "lucide-react";

interface RelationshipCardProps {
  relationship: Relationship;
  index: number;
}

export function RelationshipCard({ relationship, index }: RelationshipCardProps) {
  return (
    <Link href={`/relationship/${relationship.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <GlassCard hover padding="sm" className="w-full">
          <div className="flex flex-col items-center text-center">
            {/* Avatar with health glow */}
            <div className="relative mb-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-6 h-6 text-text-secondary" />
              </div>
              <div
                className="absolute -inset-1 rounded-full opacity-30 blur-sm"
                style={{ backgroundColor: relationship.healthColor || "#a855f7" }}
              />
            </div>

            <p className="text-text-primary font-medium text-sm">
              {relationship.name}
            </p>
            <p className="text-text-tertiary text-xs mt-0.5">
              {relationship.tags[0]}
            </p>

            {relationship.zodiac && (
              <span className="text-text-tertiary text-[10px] mt-1">
                {relationship.zodiac}
                {relationship.platform && ` · ${relationship.platform}`}
              </span>
            )}

            <p className="text-text-tertiary text-[10px] mt-2">
              {relationship.lastActivity}
            </p>

            {/* Aura score bar */}
            <div className="w-full mt-2.5">
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${relationship.auraScore}%`,
                    backgroundColor: relationship.healthColor || "#a855f7",
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </Link>
  );
}
