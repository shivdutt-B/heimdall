import HomeHero from "../components/Home/HomeHero";
import LogoTicker from "../components/Home/LogoTicker";
import StepsHero from "../components/Home/StepsHero";
import FeatureHero from "../components/Home/FeatureHero";
import SupportedTech from "../components/Home/SupportedTech";


function HomePage() {
  return (
    <>
      <HomeHero />
      <LogoTicker />
      <FeatureHero />
      <SupportedTech />
      <StepsHero />
    </>
  );
}

export default HomePage;
