"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Briefcase, Sparkles } from "lucide-react";
import { RoleCategories } from "@/lib/types";
import { getRoles } from "@/lib/api";

interface RoleSelectorProps {
  onStart: (role: string, jobDescription?: string) => void;
}

export default function RoleSelector({ onStart }: RoleSelectorProps) {
  const [categories, setCategories] = useState<RoleCategories>({});
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customRole, setCustomRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showJD, setShowJD] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRoles()
      .then((res) => {
        setCategories(res.categories);
        const first = Object.keys(res.categories)[0];
        setActiveCategory(first);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const finalRole = customRole.trim() || selectedRole;

  return (
    <div className="w-full max-w-2xl mx-auto px-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-1.5 text-xs font-display font-semibold tracking-[0.15em] text-[var(--violet)] uppercase mb-4 px-3 py-1.5 rounded-full bg-[var(--violet-soft)]">
          <Sparkles size={12} /> AI Interview Coach
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl leading-tight mb-3">
          Practice the interview
          <br className="hidden sm:block" /> before it counts.
        </h1>
        <p className="text-[var(--muted)] text-[15px] max-w-md mx-auto">
          Pick a role. Get real questions, one at a time, with honest feedback
          after every answer — not just a generic quiz.
        </p>
      </motion.div>

      {loading ? (
        <div className="h-64 rounded-2xl animate-shimmer" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6"
        >
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-1 px-1">
            {Object.keys(categories).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 text-xs font-display font-semibold px-3.5 py-2 rounded-full border transition-all ${
                  activeCategory === cat
                    ? "border-[var(--violet)] bg-[var(--violet-soft)] text-[var(--violet)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Role grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-2 gap-2 mb-5"
            >
              {(categories[activeCategory] || []).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setCustomRole("");
                  }}
                  className={`text-left text-sm px-3.5 py-3 rounded-xl border transition-all ${
                    selectedRole === role && !customRole
                      ? "border-[var(--violet)] bg-[var(--violet-soft)] text-[var(--ink)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--violet)]/40 hover:text-[var(--ink)]"
                  }`}
                >
                  {role}
                </button>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Custom role input */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--muted)]">or type any role</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div className="relative mb-4">
            <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="e.g. Investment Banking Analyst"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] pl-10 pr-4 py-3 text-sm outline-none focus:border-[var(--violet)] transition"
            />
          </div>

          {/* Optional JD */}
          <button
            onClick={() => setShowJD(!showJD)}
            className="text-xs text-[var(--muted)] hover:text-[var(--violet)] transition mb-2"
          >
            {showJD ? "− Hide" : "+ Add"} job description for more targeted questions (optional)
          </button>
          <AnimatePresence>
            {showJD && (
              <motion.textarea
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here…"
                rows={4}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--violet)] transition resize-none mb-2"
              />
            )}
          </AnimatePresence>

          <button
            onClick={() => finalRole && onStart(finalRole, jobDescription || undefined)}
            disabled={!finalRole}
            className="mt-3 w-full flex items-center justify-center gap-2 font-display font-semibold text-sm bg-[var(--violet)] text-[#0a0a0f] rounded-xl py-3.5 hover:opacity-90 active:scale-[0.99] transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Start mock interview <ChevronRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
