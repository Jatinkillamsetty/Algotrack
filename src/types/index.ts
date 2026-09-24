export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SOLVED'
  | 'FAILED'
  | 'NEEDS_REVIEW'
  | 'MASTERED';
export type ConfidenceLevel = 'Strong' | 'Medium' | 'Weak';
export type SolvingMethod = 
  | 'Independent'
  | 'With Hint'
  | 'Saw Solution'
  | 'Couldn\'t Solve';
export interface ProblemNotes {
  approach: string;
  key_insight: string;
  mistake: string;
  pattern: string;
}
export interface Problem {
  id: number;
  leetcode_id: number;
  url: string;
  title: string;
  difficulty: Difficulty;
  acceptance_rate: number; 
  frequency: number;       
  topic: string;
  status: ProblemStatus;
  first_solved_at: string | null;
  last_attempted_at: string | null;
  solve_time: number | null; 
  confidence: ConfidenceLevel | null;
  notes: ProblemNotes;
  next_review_at: string | null;
  review_interval_days: number;
  attempt_count: number;
  hint_used: boolean;
  solution_viewed: boolean;
  scheduled_date?: string | null;
}
export interface UserPlan {
  total_problems: number;
  start_date: string; 
  target_date: string; 
  days_per_week: number; 
  daily_target: number;
  is_onboarded: boolean;
  reminders: {
    morning_time: string; 
    evening_time: string; 
    enabled: boolean;
  };
}
export interface AttemptLog {
  id: string;
  problem_id: number;
  timestamp: string;
  solving_method: SolvingMethod;
  confidence: ConfidenceLevel;
  solve_time: number;
  notes: ProblemNotes;
}
export interface TopicStats {
  topic: string;
  total: number;
  solved: number;
  mastered: number;
  failed_attempts: number;
  avg_confidence_score: number; 
  percentage: number;
}
export interface MockSession {
  id: string;
  timestamp: string;
  duration_minutes: number;
  problem_ids: number[];
  completed_ids: number[];
  time_spent_seconds: number;
}
export type NavTab = 
  | 'today'
  | 'problems'
  | 'review'
  | 'progress'
  | 'analytics'
  | 'goals'
  | 'interview';