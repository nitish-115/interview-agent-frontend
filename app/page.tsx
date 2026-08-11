"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, AlertCircle } from "lucide-react";
import CinematicBackground from "@/components/CinematicBackground";
import RoleSelector from "@/components/RoleSelector";
import ProgressDots from "@/components/ProgressDots";
import FeedbackCard from "@/components/FeedbackCard";
import ThinkingIndicator from "@/components/ThinkingIndicator";
import FinalReportView from "@/components/FinalReportView";
import { startInterview, submitAnswer, ApiRequestError } from "@/lib/api";
import { HistoryItem, Feedback, FinalReport } from "@/lib/types";

type Stage = "select" | "interview" | "report";

const THINKING_LABELS = [
  "Reading your answer…",
  "Weighing strengths and gaps…",
  "Preparing the next question…",
];

export default function Home() {
  const [stage, setStage] = useState<Stage>("select");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState<string | undefined>();
  const [totalQuestions, setTotalQuestions] = useState(6);

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart(selectedRole: string, jd?: string) {
    setRole(selectedRole);
    setJobDescription(jd);
    setLoading(true);
    setError(null);
    try {
      const res = await startInterview(selectedRole, jd);
      setCurrentQuestion(res.question);
      setQuestionNumber(res.question_number);
      setTotalQuestions(res.total_questions);
      setStage("interview");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitAnswer() {
    if (!answer.trim()) return;
    setLoading(true);
    setError(null);
    setLastFeedback(null);

    const newHistoryItem: HistoryItem = { question: currentQuestion, answer };
    const updatedHistory = [...history, newHistoryItem];

    try {
      const res = await submitAnswer(role, updatedHistory, answer, jobDescription);
      updatedHistory[updatedHistory.length - 1].feedback = res.feedback;
      setHistory(updatedHistory);
      setLastFeedback(res.feedback);
      setAnswer("");

      if (res.is_complete && res.final_report) {
        setTimeout(() => {
          setFinalReport(res.final_report!);
          setStage("report");
        }, 1800);
      } else if (res.next_question) {
        setTimeout(() => {
          setCurrentQuestion(res.next_question!);
          setQuestionNumber(res.question_number + 1);
          setLastFeedback(null);
        }, 1800);
      }
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setStage("select");
    setRole("");
    setJobDescription(undefined);
    setCurrentQuestion("");
    setQuestionNumber(1);
    setAnswer("");
    setHistory([]);
    setLastFeedback(null);
    setFinalReport(null);
    setError(null);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-16">
      <CinematicBackground />

      <AnimatePresence mode="wait">
        {stage === "select" && (
          <motion.div key="select" exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <RoleSelector onStart={handleStart} />
            {loading && (
              <div className="max-w-2xl mx-auto px-5 mt-4">
                <ThinkingIndicator label="Preparing your first question…" />
              </div>
            )}
            {error && (
              <div className="max-w-2xl mx-auto px-5 mt-4 rounded-xl border border-[var(--bad)]/30 bg-[var(--bad-soft)] p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-[var(--bad)] shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--bad)]">{error}</p>
              </div>
            )}
          </motion.div>
        )}

        {stage === "interview" && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl mx-auto px-5"
          >
            <div className="text-center mb-2">
              <p className="text-xs font-display font-semibold tracking-[0.15em] text-[var(--violet)] uppercase mb-1">
                {role}
              </p>
            </div>
            <ProgressDots current={questionNumber} total={totalQuestions} />

            <AnimatePresence mode="wait">
              {!lastFeedback ? (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-7 mb-4">
                    <p className="text-xs text-[var(--muted)] font-display font-semibold uppercase tracking-wide mb-3">
                      Question {questionNumber} of {totalQuestions}
                    </p>
                    <p className="text-lg sm:text-xl font-medium leading-snug">{currentQuestion}</p>
                  </div>

                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer as you would say it out loud…"
                    rows={6}
                    disabled={loading}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 text-sm outline-none focus:border-[var(--violet)] transition resize-none mb-3 disabled:opacity-50"
                  />

                  {loading ? (
                    <ThinkingIndicator label={THINKING_LABELS[0]} />
                  ) : (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!answer.trim()}
                      className="w-full flex items-center justify-center gap-2 font-display font-semibold text-sm bg-[var(--violet)] text-[#0a0a0f] rounded-xl py-3.5 hover:opacity-90 active:scale-[0.99] transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Submit answer <Send size={15} />
                    </button>
                  )}

                  {error && (
                    <div className="mt-4 rounded-xl border border-[var(--bad)]/30 bg-[var(--bad-soft)] p-4 flex items-start gap-3">
                      <AlertCircle size={18} className="text-[var(--bad)] shrink-0 mt-0.5" />
                      <p className="text-sm text-[var(--bad)]">{error}</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="feedback">
                  <FeedbackCard feedback={lastFeedback} />
                  <div className="mt-4">
                    <ThinkingIndicator
                      label={
                        questionNumber >= totalQuestions
                          ? "Compiling your final report…"
                          : "Preparing the next question…"
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {stage === "report" && finalReport && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FinalReportView report={finalReport} role={role} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
