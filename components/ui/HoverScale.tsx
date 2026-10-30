"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HoverScaleProps {
  children: ReactNode;
  scale?: number;
}

export const HoverScale = ({ children, scale = 1.05 }: HoverScaleProps) => {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
};
