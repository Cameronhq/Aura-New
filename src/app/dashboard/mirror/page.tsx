import { AuraProfileCard } from "@/components/mirror/AuraProfileCard";
import { DiscoveryLab } from "@/components/mirror/DiscoveryLab";
import { ReflectionTimeline } from "@/components/mirror/ReflectionTimeline";
import { MirrorChatInput } from "@/components/mirror/MirrorChatInput";

export default function MirrorPage() {
  return (
    <div className="space-y-6">
      <AuraProfileCard />
      <MirrorChatInput />
      <DiscoveryLab />
      <ReflectionTimeline />
    </div>
  );
}
