import { BentoGrid } from "@/components/dashboard/BentoGrid";
import { DailyMirrorCard } from "@/components/dashboard/DailyMirrorCard";
import { MyAuraCard } from "@/components/dashboard/MyAuraCard";
import { RelationshipList } from "@/components/dashboard/RelationshipList";

export default function DashboardPage() {
  return (
    <BentoGrid>
      {/* Module A: Self */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <DailyMirrorCard />
        </div>
        <div className="md:col-span-1">
          <MyAuraCard />
        </div>
      </div>

      {/* Module B: Relationships */}
      <RelationshipList />
    </BentoGrid>
  );
}
