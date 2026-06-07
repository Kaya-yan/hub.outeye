import { GalaxyHero } from "@/components/public/GalaxyHero";
import { AboutSection } from "@/components/public/AboutSection";
import { HonorsTimeline } from "@/components/public/HonorsTimeline";
import { HonorsWall } from "@/components/public/HonorsWall";
import { coreHonors, allHonors } from "@/lib/honors-data";
import { HomeHashHandler } from "@/components/public/HomeHashHandler";

export default function HomePage() {
  return (
    <>
      <HomeHashHandler />
      <GalaxyHero />
      <AboutSection />
      <section id="honors" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold tracking-tight">荣誉奖项</h2>
          <p className="mt-2 text-muted-foreground">
            学术竞赛与个人成长的时间线
          </p>
          <HonorsTimeline coreHonors={coreHonors} />
        </div>
      </section>
      <section id="wall" className="pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-6 text-xl font-semibold">荣誉墙</h2>
          <p className="mb-6 -mt-4 text-sm text-muted-foreground">证书与证明材料</p>
          <HonorsWall allHonors={allHonors} />
        </div>
      </section>
    </>
  );
}
