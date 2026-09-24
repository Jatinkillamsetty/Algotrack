import { Problem, AttemptLog } from '../types';
export interface AnalyticsSummary {
  totalSolved: number;
  totalFailed: number;
  avgSolveTimeMinutes: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  difficultyDistribution: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  methodBreakdown: {
    Independent: number;
    WithHint: number;
    SawSolution: number;
    CouldntSolve: number;
  };
  currentStreak: number;
  longestStreak: number;
  activeDaysCount: number;
  weeklyGrid: { dayName: string; active: boolean; dateStr: string }[];
  milestones: { target: number; reached: boolean; dateReached?: string }[];
}
export function computeAnalytics(
  problems: Problem[],
  attemptLogs: AttemptLog[],
  dateFilterDays: number = 0 
): AnalyticsSummary {
  const now = new Date();
  const cutoffTime = dateFilterDays > 0 ? now.getTime() - dateFilterDays * 24 * 60 * 60 * 1000 : 0;
  
  const filteredAttempts = attemptLogs.filter(a => {
    if (cutoffTime === 0) return true;
    return new Date(a.timestamp).getTime() >= cutoffTime;
  });
  const solvedProblems = problems.filter(p => {
    if (p.status !== 'SOLVED' && p.status !== 'MASTERED') return false;
    if (cutoffTime === 0) return true;
    if (p.last_attempted_at) {
      return new Date(p.last_attempted_at).getTime() >= cutoffTime;
    }
    return true;
  });
  const failedProblems = problems.filter(p => p.status === 'FAILED');
  
  const timeSums = { Easy: 0, Medium: 0, Hard: 0 };
  const timeCounts = { Easy: 0, Medium: 0, Hard: 0 };
  solvedProblems.forEach(p => {
    if (p.solve_time && p.solve_time > 0) {
      timeSums[p.difficulty] += p.solve_time;
      timeCounts[p.difficulty]++;
    }
  });
  const avgSolveTimeMinutes = {
    Easy: timeCounts.Easy > 0 ? Math.round(timeSums.Easy / timeCounts.Easy / 60) : 18,
    Medium: timeCounts.Medium > 0 ? Math.round(timeSums.Medium / timeCounts.Medium / 60) : 31,
    Hard: timeCounts.Hard > 0 ? Math.round(timeSums.Hard / timeCounts.Hard / 60) : 48,
  };
  
  const difficultyDistribution = {
    Easy: solvedProblems.filter(p => p.difficulty === 'Easy').length,
    Medium: solvedProblems.filter(p => p.difficulty === 'Medium').length,
    Hard: solvedProblems.filter(p => p.difficulty === 'Hard').length,
  };
  
  const methodBreakdown = {
    Independent: filteredAttempts.filter(a => a.solving_method === 'Independent').length,
    WithHint: filteredAttempts.filter(a => a.solving_method === 'With Hint').length,
    SawSolution: filteredAttempts.filter(a => a.solving_method === 'Saw Solution').length,
    CouldntSolve: filteredAttempts.filter(a => a.solving_method === "Couldn't Solve").length,
  };
  
  const activeDates = new Set<string>();
  attemptLogs.forEach(a => {
    activeDates.add(a.timestamp.split('T')[0]);
  });
  problems.forEach(p => {
    if (p.last_attempted_at) activeDates.add(p.last_attempted_at.split('T')[0]);
    if (p.first_solved_at) activeDates.add(p.first_solved_at.split('T')[0]);
  });
  const sortedDates = Array.from(activeDates).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let checkDate = new Date();
  if (!activeDates.has(todayStr) && activeDates.has(yesterdayStr)) {
    checkDate = new Date(Date.now() - 86400000);
  }
  while (activeDates.has(checkDate.toISOString().split('T')[0])) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  if (sortedDates.length > 0) {
    tempStreak = 1;
    longestStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
  }
  
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const curr = new Date();
  const firstDayOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay()));
  const weeklyGrid = daysOfWeek.map((dayName, idx) => {
    const d = new Date(firstDayOfWeek);
    d.setDate(d.getDate() + idx);
    const dateStr = d.toISOString().split('T')[0];
    return {
      dayName,
      active: activeDates.has(dateStr),
      dateStr,
    };
  });
  
  const milestoneTargets = [100, 200, 300, 400, 500, 600, 700, 798];
  const milestones = milestoneTargets.map(target => ({
    target,
    reached: solvedProblems.length >= target,
  }));
  return {
    totalSolved: solvedProblems.length,
    totalFailed: failedProblems.length,
    avgSolveTimeMinutes,
    difficultyDistribution,
    methodBreakdown,
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    activeDaysCount: activeDates.size,
    weeklyGrid,
    milestones,
  };
}