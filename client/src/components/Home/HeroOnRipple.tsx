import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { authState } from "../../store/auth";
import { useRecoilValue } from "recoil";

function HeroOnRipple() {
  const auth = useRecoilValue(authState);
  return (
    <div className="relative text-white text-center font-inter flex flex-col items-center justify-center max-w-4xl mx-auto px-4 mt-6">
      {/* Badge 1: Centered above heading */}
      <div className="mb-0 px-5 py-2.5 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-white/90 text-sm font-[500] flex items-center gap-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/20 transition-all select-none">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>
        1.5 million+ Total Pings
      </div>

      {/* Badge 3: Floating near the word "Sleep" (left side) */}
      <div className="absolute hidden sm:flex left-[1%] md:left-[-2%] lg:left-[-8%] xl:left-[-12%] top-[34%] md:top-[30%] lg:top-[26%] xl:top-[24%] z-20 animate-float-delayed px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-white/90 text-sm font-[500] items-center gap-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/20 transition-all select-none whitespace-nowrap">
        <svg className="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
        </svg>
        Unlimited Servers
      </div>

      <div className="absolute hidden sm:flex right-[4%] md:right-[8%] lg:right-[12%] xl:right-[16%] top-[56%] md:top-[56%] lg:top-[56%] xl:top-[56%] z-20 animate-float px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-white/90 text-xs sm:text-sm md:text-[15px] font-medium items-center gap-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/20 transition-all select-none whitespace-nowrap">
        <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 12h3l3-9 4 18 3-13 1 4h3" />
        </svg>
        5K+ Pings / Day
      </div>

      <h1 className="relative z-10 mx-auto max-w-4xl text-center lg:text-8xl text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-none py-2">
        {/* bg-clip-text text-transparent */}
        Never Let Your Server Sleep Again
      </h1>
      <p className="font-Inter text-[16px] mt-6 text-white/70 max-w-lg font-light leading-relaxed text-center">
        Heimdall keeps your backend servers awake and watches over their
        uptime — no more cold starts or 50s delays.
      </p>
      <div className="flex justify-center mt-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {auth.loading ? (
            <div className="bg-white px-6 py-2.5 rounded-sm shadow-md text-sm flex items-center gap-2 font-semibold text-black">
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
              className="bg-white hover:bg-white/80 transition-all duration-300 text-black px-6 py-2.5 rounded-sm shadow-md text-sm flex items-center gap-2 font-semibold"
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
              className="bg-transparent border border-white/30 hover:border-white/60 text-white px-6 py-2.5 rounded-sm shadow-md flex items-center gap-2 text-sm font-semibold font-Inter cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
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
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M14 4H0V2H16V14H9.98707C9.99565 13.8344 10 13.6677 10 13.5C10 12.9896 9.95975 12.4886 9.88225 12H14V4Z"
                    fill="currentColor"
                    strokeWidth="0.2"
                  ></path>
                  <path
                    d="M0 10C2.20914 10 4 11.7909 4 14H2C2 12.8954 1.10457 12 0 12V10Z"
                    fill="currentColor"
                    strokeWidth="0.2"
                  ></path>
                  <path
                    d="M8 14C8 9.58172 4.41828 6 0 6V8C3.31371 8 6 10.6863 6 14H8Z"
                    fill="currentColor"
                    strokeWidth="0.2"
                  ></path>
                </g>
              </motion.svg>
            </motion.button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default HeroOnRipple;
