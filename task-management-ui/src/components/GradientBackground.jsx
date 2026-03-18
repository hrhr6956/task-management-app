import { motion } from "framer-motion";

export default function GradientBackground() {
  return (
    <motion.div
      className="fixed inset-0 -z-10"
      animate={{
        background: [
          "radial-gradient(circle at 30% 40%, #1F2833 0%, #0B0C10 70%)",
          "radial-gradient(circle at 70% 60%, #1F2833 0%, #0B0C10 70%)",
          "radial-gradient(circle at 30% 40%, #1F2833 0%, #0B0C10 70%)",
        ],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
  );
}
