"use client";

import { motion } from "framer-motion";

export default function ThinkingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-[var(--muted)] text-sm py-4">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--violet)]"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      {label}
    </div>
  );
}
