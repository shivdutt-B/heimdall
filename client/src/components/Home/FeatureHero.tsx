import React from "react";
import { Zap, LineChart, Bell, Lock, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "Prevent Cold Starts",
    description:
      "Keep your servers warm and responsive by preventing them from going idle or sleeping.",
    color: "#FFD700", // Gold color for Zap
    size: "lg", // Large card
  },
  {
    icon: LineChart,
    title: "Uptime Monitoring",
    description:
      "Track your server's uptime with detailed analytics and historical performance data.",
    color: "#4CAF50", // Green color for LineChart
    size: "sm", // Small card
  },
  {
    icon: Bell,
    title: "Email Alerts for Failures",
    description:
      "Get notified immediately when your server goes down or experiences performance issues.",
    color: "#FF5722", // Orange color for Bell
    size: "sm", // Small card
  },
  {
    icon: Lock,
    title: "Secure & Private URLs",
    description:
      "Your server URLs are encrypted and kept private, with secure authentication for all monitoring requests.",
    color: "#2196F3", // Blue color for Lock
    size: "lg", // Large card
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description:
      "Built-in protection against distributed denial-of-service attacks to keep your servers safe and operational.",
    color: "#9C27B0", // Purple color for Shield
    size: "sm", // Small card
  },
];

function FeatureHero() {
  return (
    <section className="container px-4 pt-24 pb-0 bg-[#040506] text-white/80">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="space-y-2">
          <motion.h2
            className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl font-Inter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Features
          </motion.h2>
          <motion.p
            className="text-muted-foreground md:text-[16px] max-w-[42rem] mx-auto font-Inter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to keep your servers running smoothly.
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 px-4 max-w-6xl mx-auto">
        <motion.div
          key={0}
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-500 md:col-span-2 md:row-span-2 flex flex-col justify-center rounded-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -3 }}
        >
          <div className="flex gap-4 mb-4 items-center">
            <motion.div
              className="bg-primary/20 p-3 rounded-full"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Zap className="h-6 w-6" style={{ color: "#FFD700" }} />
            </motion.div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent font-Inter">
              Prevent Cold Starts
            </h3>
          </div>
          <p className="text-white/70 font-Inter">
            Keep your servers warm and responsive by preventing them from going
            idle or sleeping.
          </p>
          {/* <div className="mt-6 pt-4 border-t border-gray-700">
            <motion.button
              className="text-sm text-white/80 hover:text-white flex items-center gap-2"
              whileHover={{ x: 3 }}
            >
              Learn more
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </motion.button>
          </div> */}
        </motion.div>

        <motion.div
          key={1}
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-500 md:col-span-2 rounded-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -3 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="bg-primary/20 p-3 rounded-full"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <LineChart className="h-6 w-6" style={{ color: "#4CAF50" }} />
            </motion.div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent font-Inter">
              Uptime Monitoring
            </h3>
          </div>
          <p className="text-white/70 font-Inter">
            Track your server's uptime with detailed analytics and historical
            performance data.
          </p>
        </motion.div>

        <motion.div
          key={2}
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-500 md:col-span-2 rounded-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.02, y: -3 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="bg-primary/20 p-3 rounded-full"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Bell className="h-6 w-6" style={{ color: "#FF5722" }} />
            </motion.div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent font-Inter">
              Email Alerts for Failures
            </h3>
          </div>
          <p className="text-white/70 font-Inter">
            Get notified immediately when your server goes down or experiences
            performance issues.
          </p>
        </motion.div>

        <motion.div
          key={3}
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-500 md:col-span-2 md:row-span-2 rounded-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -3 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="bg-primary/20 p-3 rounded-full"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Lock className="h-6 w-6" style={{ color: "#2196F3" }} />
            </motion.div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent font-Inter">
              Secure & Private URLs
            </h3>
          </div>
          <p className="text-white/70 font-Inter">
            Your server URLs are encrypted and kept private, with secure
            authentication for all monitoring requests.
          </p>
          {/* <div className="mt-6 pt-4 border-t border-gray-700">
            <motion.button
              className="text-sm text-white/80 hover:text-white flex items-center gap-2"
              whileHover={{ x: 3 }}
            >
              Learn more
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </motion.button>
          </div> */}
        </motion.div>

        <motion.div
          key={4}
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-500 md:col-span-2 rounded-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.02, y: -3 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="bg-primary/20 p-3 rounded-full"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Shield className="h-6 w-6" style={{ color: "#9C27B0" }} />
            </motion.div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent font-Inter">
              DDoS Protection
            </h3>
          </div>
          <p className="text-white/70 font-Inter">
            Built-in protection against distributed denial-of-service attacks to
            keep your servers safe and operational.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default FeatureHero;
