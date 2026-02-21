"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { RelationshipCard } from "./RelationshipCard";
import { Plus } from "lucide-react";
import { useEffect } from "react";

export function RelationshipList() {
  const { relationships, loadDashboard } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-primary font-medium">活跃关系</h3>
        <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors">
          <Plus className="w-4 h-4 text-text-secondary" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {relationships.map((rel, i) => (
          <div key={rel.id} className="snap-start">
            <RelationshipCard relationship={rel} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
