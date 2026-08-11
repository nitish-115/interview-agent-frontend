export interface RoleCategories {
  [category: string]: string[];
}

export interface RolesResponse {
  categories: RoleCategories;
  total_questions: number;
}

export interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  one_line_verdict: string;
}

export interface HistoryItem {
  question: string;
  answer: string;
  feedback?: Feedback;
}

export interface StartResponse {
  question: string;
  question_number: number;
  total_questions: number;
}

export interface FinalReport {
  overall_score: number;
  readiness_verdict: string;
  top_strengths: string[];
  priority_improvements: string[];
  summary: string;
}

export interface TurnResponse {
  feedback: Feedback;
  is_complete: boolean;
  question_number: number;
  total_questions: number;
  next_question?: string;
  final_report?: FinalReport;
}
