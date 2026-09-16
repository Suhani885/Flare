import { HeroSection } from "@/components/shared/hero-section";
import { CollectionsSection } from "@/components/shared/collections-section";
import { ExperienceSection } from "@/components/shared/experience-section";
import { CommunitySection } from "@/components/shared/community-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CollectionsSection />
      <ExperienceSection />
      <CommunitySection />
    </div>
  );
}
