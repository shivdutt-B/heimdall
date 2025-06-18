import React from "react";
import RippleHero from "../Components/Home/RippleHero";
import StepsHero from "../Components/Home/StepsHero";
import { VideoHero } from "../Components/Home/VideoHero";
import FeatureHero from "../Components/Home/FeatureHero";


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
