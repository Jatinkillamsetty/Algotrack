import Papa from 'papaparse';
import { Problem, UserPlan, AttemptLog, MockSession } from '../types';
import { classifyProblemTopic } from './topicMapper';
const STORAGE_KEYS = {
  PROBLEMS: 'dsa_run_problems_v1',
  PLAN: 'dsa_run_plan_v1',
  ATTEMPTS: 'dsa_run_attempts_v1',
  MOCK_SESSIONS: 'dsa_run_mocks_v1',
};
export const DEFAULT_PLAN: UserPlan = {
  total_problems: 798,
  start_date: new Date().toISOString().split('T')[0],
  target_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  days_per_week: 7,
  daily_target: 5,
  is_onboarded: false,
  reminders: {
    morning_time: '08:00',
    evening_time: '20:00',
    enabled: true,
  },
};
export async function fetchDefaultDataset(): Promise<Problem[]> {
  try {
    const response = await fetch('/dataset/leetcode_798.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV dataset: ${response.statusText}`);
    }
    const csvText = await response.text();
    return parseCsvToProblems(csvText);
  } catch (err) {
    console.error('Error fetching default dataset:', err);
    return [];
  }
}
export function parseCsvToProblems(csvText: string): Problem[] {
  const parsed = Papa.parse<any>(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
  });
  if (!parsed.data || parsed.data.length === 0) {
    return [];
  }
  return parsed.data.map((row: any, index: number) => {
    const idNum = parseInt(row['ID'] || row['id'] || `${index + 1}`, 10);
    const title = (row['Title'] || row['title'] || `Problem #${idNum}`).trim();
    const url = (row['URL'] || row['url'] || `https://leetcode.com/problems/problem-${idNum}`).trim();
    
    let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
    const rawDiff = (row['Difficulty'] || row['difficulty'] || '').toLowerCase();
    if (rawDiff.includes('easy')) difficulty = 'Easy';
    else if (rawDiff.includes('hard')) difficulty = 'Hard';
    let acceptance_rate = 50.0;
    if (row['Acceptance %'] || row['acceptance_rate']) {
      const val = parseFloat(`${row['Acceptance %'] || row['acceptance_rate']}`.replace('%', ''));
      if (!isNaN(val)) acceptance_rate = val;
    }
    let frequency = 50.0;
    if (row['Frequency %'] || row['frequency']) {
      const val = parseFloat(`${row['Frequency %'] || row['frequency']}`.replace('%', ''));
      if (!isNaN(val)) frequency = val;
    }
    const topic = classifyProblemTopic(title, row['Topic'] || row['topic']);
    return {
      id: idNum,
      leetcode_id: idNum,
      url,
      title,
      difficulty,
      acceptance_rate,
      frequency,
      topic,
      status: 'NOT_STARTED',
      first_solved_at: null,
      last_attempted_at: null,
      solve_time: null,
      confidence: null,
      notes: {
        approach: '',
        key_insight: '',
        mistake: '',
        pattern: '',
      },
      next_review_at: null,
      review_interval_days: 0,
      attempt_count: 0,
      hint_used: false,
      solution_viewed: false,
    };
  });
}
export function loadProblems(): Problem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading problems from storage:', err);
  }
  return [];
}
export function saveProblems(problems: Problem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problems));
  } catch (err) {
    console.error('Error saving problems to storage:', err);
  }
}
export function loadUserPlan(): UserPlan {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLAN);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading plan from storage:', err);
  }
  return DEFAULT_PLAN;
}
export function saveUserPlan(plan: UserPlan): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
  } catch (err) {
    console.error('Error saving plan to storage:', err);
  }
}
export function loadAttemptLogs(): AttemptLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading attempt logs:', err);
  }
  return [];
}
export function saveAttemptLogs(logs: AttemptLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving attempt logs:', err);
  }
}
export function loadMockSessions(): MockSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOCK_SESSIONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading mock sessions:', err);
  }
  return [];
}
export function saveMockSessions(sessions: MockSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MOCK_SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving mock sessions:', err);
  }
}
export function exportFullDataBackup(): string {
  const data = {
    problems: loadProblems(),
    plan: loadUserPlan(),
    attempts: loadAttemptLogs(),
    mockSessions: loadMockSessions(),
    exported_at: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}
export function importFullDataBackup(jsonText: string): boolean {
  try {
    const parsed = JSON.parse(jsonText);
    if (parsed.problems && Array.isArray(parsed.problems)) {
      saveProblems(parsed.problems);
    }
    if (parsed.plan) {
      saveUserPlan(parsed.plan);
    }
    if (parsed.attempts) {
      saveAttemptLogs(parsed.attempts);
    }
    if (parsed.mockSessions) {
      saveMockSessions(parsed.mockSessions);
    }
    return true;
  } catch (err) {
    console.error('Failed to import data backup:', err);
    return false;
  }
}