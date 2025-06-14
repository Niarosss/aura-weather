import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      style={{
        border: "4px solid rgba(0, 0, 0, 0.1)",
        borderLeftColor: "#09f",
        borderRadius: "50%",
        width: 36,
        height: 36,
        margin: "20px auto",
      }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  );
}
