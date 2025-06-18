import React from "react";
import { motion } from "framer-motion";
import { AnimatedSubscribeButton } from "../Helper/GetStartedBtn";
import { Link } from "react-router-dom";
import { authState } from "../../store/auth";
import { useRecoilValue } from "recoil";

function HeroOnRipple() {
  const auth = useRecoilValue(authState);
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
 bg-clip-text text-transparent h-auto"
                >
                  {word}
                </motion.span>
              ))}
          </h1>
          <p className="font-Inter text-[15px] mt-3 text-white/80 font-light">
            Heimdall keeps your backend servers awake and watches over their
            uptime — no more cold starts or 50s delays.
          </p>
          <div className="flex justify-center mt-5">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              {auth.loading ? (
                <div className="bg-white px-6 py-2 rounded-sm shadow-md text-sm flex items-center gap-2 font-semibold">
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <Link
                  to={auth.user ? "/dashboard" : "/auth"}
                  className="bg-white hover:bg-white/80 transition-all duration-300 text-black px-6 py-2 rounded-sm shadow-md text-sm flex items-center gap-2 font-semibold"
                >
                  <span>{auth.user ? "Dashboard" : "Get Started"}</span>
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
                </Link>
              )}

              <a href="#demo-video" className="scroll-smooth">
                <motion.button
                  className="bg-transparent border border-white/30 hover:border-white/60 text-white px-6 py-2 rounded-sm shadow-md flex items-center gap-2 text-sm font-semibold font-Inter"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
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
