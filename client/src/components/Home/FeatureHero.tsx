import { Zap, LineChart, Bell } from "lucide-react";
import { motion } from "framer-motion";

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
      </div>
    </section>
  );
}

export default FeatureHero;
