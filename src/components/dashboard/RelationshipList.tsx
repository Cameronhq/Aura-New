"use client";

import { useState, useEffect } from "react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { RelationshipCard } from "./RelationshipCard";
import { AddProfileModal } from "./AddProfileModal";
import { Plus } from "lucide-react";

export function RelationshipList() {
  const { relationships, loadDashboard } = useDashboardStore();
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

      <div className="grid grid-cols-2 gap-3">
        {relationships.map((rel, i) => (
          <RelationshipCard key={rel.id} relationship={rel} index={i} />
        ))}
      </div>

      {showAddModal && (
        <AddProfileModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
