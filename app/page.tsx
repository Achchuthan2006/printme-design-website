import {
  HomeHero,
  HomeJobPaths,
  HomeSupportSection,
} from "@/components/home/homepage-sections";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeJobPaths />
      <HomeSupportSection />
    </main>
  );
}
