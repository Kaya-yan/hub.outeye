import { HeroSection } from "@/components/public/HeroSection";
import { BentoGrid } from "@/components/public/BentoGrid";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BentoGrid />
    </div>
  );
}
