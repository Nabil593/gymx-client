import Banner from "@/components/shared/Banner";
import FeaturesSection from "@/components/shared/FeaturesSection";
import StatsSection from "@/components/shared/StatsSection";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Banner />
      <StatsSection />
      <FeaturesSection />
    </div>
  );
}
