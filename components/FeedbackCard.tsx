"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { Feedback } from "@/lib/types";

function colorForScore(score: number): string {
  if (score >= 7) return "var(--good)";
  if (score >= 4) return "var(--warn)";
  return "var(--bad)";
}

export default function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const color = colorForScore(feedback.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
          className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
          style={{ background: `${color}22`, color }}
        >
          {feedback.score}
        </motion.div>
        <div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide font-display font-semibold mb-0.5">
            Score out of 10
          </p>
          <p className="text-sm font-medium">{feedback.one_line_verdict}</p>
        </div>
      </div>

      {feedback.strengths.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-display font-semibold uppercase tracking-wide text-[var(--good)] mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={13} /> What worked
          </p>
          <div className="flex flex-col gap-1.5">
            {feedback.strengths.map((s, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="text-sm text-[var(--muted)] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--good)]"
              >
                {s}
              </motion.p>
            ))}
          </div>
        </div>
      )}

      {feedback.improvements.length > 0 && (
        <div>
          <p className="text-xs font-display font-semibold uppercase tracking-wide text-[var(--gold)] mb-2 flex items-center gap-1.5">
            <TrendingUp size={13} /> To improve
          </p>
          <div className="flex flex-col gap-1.5">
            {feedback.improvements.map((s, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="text-sm text-[var(--muted)] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--gold)]"
              >
                {s}
              </motion.p>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
