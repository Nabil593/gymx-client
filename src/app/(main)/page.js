import Banner from "@/components/shared/Banner";
import FeaturedClasses from "@/components/shared/FeaturedClasses";
import FeaturesSection from "@/components/shared/FeaturesSection";
import StatsSection from "@/components/shared/StatsSection";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedClasses />
      <StatsSection />
      <FeaturesSection />
    </div>
  );
}
