import React from "react";
import RippleHero from "../components/RippleHero";
import StepsHero from "../components/StepsHero";
import { VideoHero } from "../components/VideoHero";
import FeatureHero from "../components/FeatureHero";

function Home() {
  return (
    <>
      <RippleHero />
      <StepsHero />
      <VideoHero />
      <FeatureHero />
    </>
  );
}

export default Home;
