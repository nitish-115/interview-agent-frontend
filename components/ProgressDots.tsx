"use client";

import { motion } from "framer-motion";

interface ProgressDotsProps {
  current: number;
  total: number;
}

export default function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < current - 1;
        const isActive = i === current - 1;
        return (
          <motion.div
            key={i}
            initial={false}
            animate={{
              width: isActive ? 28 : 8,
              backgroundColor: isDone || isActive ? "var(--violet)" : "var(--border)",
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="h-2 rounded-full"
          />
        );
      })}
    </div>
  );
}
