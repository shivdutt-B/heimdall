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
            <div className="bg-emerald-500 px-6 py-2.5 rounded-[2px] shadow-md text-sm flex items-center gap-2 font-semibold text-black">
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
              className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 text-black px-8 py-4 rounded-[2px] shadow-md text-md flex items-center gap-2 font-semibold"
            >
              <span>{auth.user ? "Dashboard" : "Get Started"}</span>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
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
        </div>
      </div>
    </div>
  );
}

export default HeroOnRipple;
