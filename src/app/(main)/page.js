import Banner from "@/components/shared/Banner";
import BmiCalculator from "@/components/shared/BmiCalculator";
import FeaturedClasses from "@/components/shared/FeaturedClasses";
import FeaturesSection from "@/components/shared/FeaturesSection";
import LatestForum from "@/components/shared/LatestForum";
import StatsSection from "@/components/shared/StatsSection";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedClasses />
      <StatsSection />
      <LatestForum />
      <BmiCalculator />
      <FeaturesSection />
    </div>
  );
}
