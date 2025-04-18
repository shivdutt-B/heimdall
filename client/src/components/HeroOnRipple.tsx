import React from "react";
import { motion } from "framer-motion";
import { AnimatedSubscribeButton } from "../resources/GetStartedBtn";

function HeroOnRipple() {
  return (
    <div className="relative h-[700px] w-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full flex  justify-center">
        <div className="text-white text-4xl font-bold font-inter text-center mt-5 flex items-center justify-center flex-col p-4">
          <h1 className="relative z-10 mx-auto max-w-4xl text-center lg:text-7xl text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter">
            {"Never Let Your Server Sleep Again"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-200
 bg-clip-text text-transparent"
                >
                  {word}
                </motion.span>
              ))}
          </h1>
          <p className="font-Inter text-[15px] mt-3 text-white/80 font-light">
            Heimdall keeps your backend servers awake and watches over their
            uptime — no more cold starts or 30s delays.
          </p>
          <div className="flex justify-center mt-5">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <AnimatedSubscribeButton
                className="bg-white hover:bg-white/80 transition-all duration-300 text-black px-6 py-2 rounded-sm shadow-md text-sm"
                onClick={() => console.log("Get Started clicked")}
              >
                <span className="flex items-center gap-2 font-semibold font-Inter">
                  Get Started{" "}
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.1 }}
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </motion.svg>
                </span>
                <span className="flex items-center gap-2">
                  Let's Go!{" "}
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.1 }}
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </motion.svg>
                </span>
              </AnimatedSubscribeButton>

              <a href="#demo-video" className="scroll-smooth">
                <motion.button
                  className="bg-transparent border border-white/30 hover:border-white/60 text-white px-6 py-2 rounded-sm shadow-md flex items-center gap-2 text-sm font-semibold font-Inter"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => console.log("Live Demo clicked")}
                >
                  Demo
                  <motion.svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.1 }}
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M14 4H0V2H16V14H9.98707C9.99565 13.8344 10 13.6677 10 13.5C10 12.9896 9.95975 12.4886 9.88225 12H14V4Z"
                        fill="currentColor"
                        stroke-width="0.2"
                      ></path>{" "}
                      <path
                        d="M0 10C2.20914 10 4 11.7909 4 14H2C2 12.8954 1.10457 12 0 12V10Z"
                        fill="currentColor"
                        stroke-width="0.2"
                      ></path>{" "}
                      <path
                        d="M8 14C8 9.58172 4.41828 6 0 6V8C3.31371 8 6 10.6863 6 14H8Z"
                        fill="currentColor"
                        stroke-width="0.2"
                      ></path>{" "}
                    </g>
                  </motion.svg>
                </motion.button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroOnRipple;
