import RippleHero from "../components/Home/RippleHero";
import LogoTicker from "../components/Home/LogoTicker";
import StepsHero from "../components/Home/StepsHero";
import { VideoHero } from "../components/Home/VideoHero";
import FeatureHero from "../components/Home/FeatureHero";
import SupportedTech from "../components/Home/SupportedTech";


function Home() {
  return (
    <>
      <RippleHero />
      <LogoTicker />
      <FeatureHero />
      <SupportedTech />
      <StepsHero />
      <VideoHero />
    </>
  );
}

export default Home;
