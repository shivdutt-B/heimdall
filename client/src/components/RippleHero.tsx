import React from "react";
import { Ripple } from "../resources/RippleText";
import HeroOnRipple from "./HeroOnRipple";
const RippleHero: React.FC = () => {
  return (
    <div className="relative h-[700px] w-full overflow-hidden">
      <Ripple />
      <HeroOnRipple />
    </div>
  );
};

export default RippleHero;
