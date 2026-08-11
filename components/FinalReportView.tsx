"use client";

import { motion } from "framer-motion";
import { RotateCcw, Award } from "lucide-react";
import { FinalReport } from "@/lib/types";

function colorForVerdict(v: string): string {
  const lower = v.toLowerCase();
  if (lower.includes("strong") || lower.includes("ready")) return "var(--good)";
  if (lower.includes("getting there")) return "var(--warn)";
  return "var(--bad)";
}

export default function FinalReportView({
  report,
  role,
  onRestart,
}: {
  report: FinalReport;
  role: string;
  onRestart: () => void;
}) {
  const color = colorForVerdict(report.readiness_verdict);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (report.overall_score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto px-5"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-display font-semibold tracking-[0.15em] text-[var(--violet)] uppercase mb-3 px-3 py-1.5 rounded-full bg-[var(--violet-soft)]">
          <Award size={12} /> Interview Complete
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl">{role}</h1>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-36 h-36">
            <svg width={144} height={144} className="-rotate-90">
              <circle cx={72} cy={72} r={54} fill="none" stroke="var(--border)" strokeWidth={10} />
              <motion.circle
                cx={72} cy={72} r={54} fill="none" stroke={color} strokeWidth={10}
                strokeLinecap="round" strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-bold text-4xl" style={{ color }}>
                {report.overall_score}
              </span>
              <span className="text-[10px] text-[var(--muted)]">OUT OF 100</span>
            </div>
          </div>
          <p className="font-display font-semibold text-lg mt-4" style={{ color }}>
            {report.readiness_verdict}
          </p>
        </div>

        <p className="text-sm text-[var(--muted)] text-center leading-relaxed mb-6 px-2">
          {report.summary}
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-display font-semibold uppercase tracking-wide text-[var(--good)] mb-2">
              Top strengths
            </p>
            <div className="flex flex-col gap-1.5">
              {report.top_strengths.map((s, i) => (
                <p key={i} className="text-sm text-[var(--muted)] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--good)]">
                  {s}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-display font-semibold uppercase tracking-wide text-[var(--gold)] mb-2">
              Priority improvements
            </p>
            <div className="flex flex-col gap-1.5">
              {report.priority_improvements.map((s, i) => (
                <p key={i} className="text-sm text-[var(--muted)] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--gold)]">
                  {s}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-5 w-full flex items-center justify-center gap-2 font-display font-semibold text-sm border border-[var(--border)] rounded-xl py-3.5 text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--violet)]/40 transition"
      >
        <RotateCcw size={15} /> Practice another role
      </button>
    </motion.div>
  );
}
