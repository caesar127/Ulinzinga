import { motion } from "framer-motion";

function AnimatedActionButton({ icon, label }) {
  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center bg-gray-100 px-2 py-3 rounded-2xl shadow-sm hover:bg-gray-200 transition"
    >
      <div className="text-black mb-2">{icon}</div>
      <p className="text-xs font-medium">{label}</p>
    </motion.button>
  );
}

export default AnimatedActionButton;