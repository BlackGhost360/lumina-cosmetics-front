import { motion } from "motion/react";

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--bg-primary)]"
    >
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[var(--accent-light)] border-t-transparent rounded-full"
        />
        
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-4 border-[var(--accent-color)] border-b-transparent rounded-full"
        />
        
        {/* Center dot */}
        <div className="absolute inset-[45%] bg-[var(--accent-color)] rounded-full animate-pulse" />
      </div>
    </motion.div>
  );
}
