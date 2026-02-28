"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { RelationshipCard } from "./RelationshipCard";
import { AddProfileModal } from "./AddProfileModal";
import { Plus, Users } from "lucide-react";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex flex-col items-center gap-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-white/10" />
      <div className="w-16 h-3 rounded-full bg-white/10" />
      <div className="w-10 h-2.5 rounded-full bg-white/[0.07]" />
      <div className="w-full h-1 rounded-full bg-white/[0.07]" />
    </div>
  );
}

export function RelationshipList() {
  const { relationships, isLoaded, loadDashboard } = useDashboardStore();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-primary font-medium">活跃关系</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
        >
          <Plus className="w-4 h-4 text-text-secondary" />
        </button>
      </div>

      {!isLoaded ? (
        <div className="grid grid-cols-2 gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : relationships.length === 0 ? (
        <motion.div
          className="col-span-2 py-8 px-4 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-text-tertiary" />
          </div>
          <p className="text-text-secondary font-medium mb-1">还没有关系档案</p>
          <p className="text-text-tertiary text-xs mb-4 leading-relaxed">
            添加你想分析的对象，让军师帮你解读信号
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-aurora-start/20 border border-aurora-mid/30 text-aurora-end text-sm font-medium hover:bg-aurora-start/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加第一段关系
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {relationships.map((rel, i) => (
            <RelationshipCard key={rel.id} relationship={rel} index={i} />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddProfileModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
