import { Problem, UserPlan, ConfidenceLevel } from '../types';
export const REVISION_INTERVALS = [0, 1, 3, 7, 14, 30]; 
export interface DailyScheduleResult {
  todaysProblems: Problem[];
  dueReviews: Problem[];
  dailyTarget: number;
  completedTodayCount: number;
  aheadBehindStatus: {
    status: 'AHEAD' | 'BEHIND' | 'ON_TRACK';
    delta: number; 
    recommendedPace: number; 
  };
  weakTopics: { topic: string; score: number }[];
}
export function calculatePaceStats(problems: Problem[], plan: UserPlan) {
  const total = problems.length || plan.total_problems || 798;
  const solved = problems.filter(p => p.status === 'SOLVED' || p.status === 'MASTERED').length;
  const remaining = total - solved;
  const startDate = new Date(plan.start_date);
  const targetDate = new Date(plan.target_date);
  const now = new Date();
  
  const totalDays = Math.max(1, Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
  
  
  const elapsedDays = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
  const remainingDays = Math.max(1, totalDays - elapsedDays);
  
  const activeDaysRatio = plan.days_per_week / 7;
  const remainingActiveDays = Math.max(1, Math.ceil(remainingDays * activeDaysRatio));
  
  const expectedPacePerDay = total / totalDays;
  const expectedSolved = Math.min(total, Math.round(expectedPacePerDay * elapsedDays));
  
  const delta = solved - expectedSolved;
  let status: 'AHEAD' | 'BEHIND' | 'ON_TRACK' = 'ON_TRACK';
  if (delta > 1) status = 'AHEAD';
  else if (delta < -1) status = 'BEHIND';
  
  const recommendedPace = Number((remaining / remainingActiveDays).toFixed(1));
  const dailyTarget = Math.max(3, Math.ceil(recommendedPace));
  return {
    total,
    solved,
    remaining,
    totalDays,
    elapsedDays,
    remainingDays,
    remainingActiveDays,
    expectedSolved,
    delta,
    status,
    recommendedPace,
    dailyTarget,
  };
}
export function getDueReviews(problems: Problem[]): Problem[] {
  const todayStr = new Date().toISOString().split('T')[0];
  return problems.filter(p => {
    if (p.status === 'NEEDS_REVIEW') return true;
    if (p.next_review_at) {
      return p.next_review_at <= todayStr;
    }
    return false;
  });
}
export function computeWeakTopics(problems: Problem[]): { topic: string; score: number }[] {
  const topicMap: Record<string, { total: number; solved: number; weakCount: number; failedCount: number }> = {};
  problems.forEach(p => {
    if (!topicMap[p.topic]) {
      topicMap[p.topic] = { total: 0, solved: 0, weakCount: 0, failedCount: 0 };
    }
    topicMap[p.topic].total++;
    if (p.status === 'SOLVED' || p.status === 'MASTERED') {
      topicMap[p.topic].solved++;
    }
    if (p.confidence === 'Weak' || p.status === 'FAILED') {
      topicMap[p.topic].weakCount++;
    }
    if (p.attempt_count > 1 || p.status === 'FAILED') {
      topicMap[p.topic].failedCount++;
    }
  });
  const topicScores = Object.entries(topicMap).map(([topic, data]) => {
    const solveRatio = data.solved / (data.total || 1);
    
    const score = solveRatio * 100 - (data.weakCount * 15 + data.failedCount * 10);
    return { topic, score };
  });
  
  return topicScores.sort((a, b) => a.score - b.score);
}
export function generateDailySchedule(
  problems: Problem[],
  plan: UserPlan,
  currentSeedDate: string = new Date().toISOString().split('T')[0]
): DailyScheduleResult {
  const pace = calculatePaceStats(problems, plan);
  const dueReviews = getDueReviews(problems);
  const weakTopics = computeWeakTopics(problems);
  const weakestTopicNames = new Set(weakTopics.slice(0, 3).map(w => w.topic));
  const todayStr = currentSeedDate;
  
  
  const touchedToday = problems.filter(
    p => (p.last_attempted_at && p.last_attempted_at.startsWith(todayStr)) ||
         (p.first_solved_at && p.first_solved_at.startsWith(todayStr))
  );
  const completedTodayCount = touchedToday.filter(p => p.status === 'SOLVED' || p.status === 'MASTERED').length;
  
  const unsolvedPool = problems.filter(
    p => p.status === 'NOT_STARTED' || p.status === 'IN_PROGRESS' || p.status === 'FAILED'
  );
  
  const scheduled: Problem[] = [...touchedToday];
  const neededNew = Math.max(0, pace.dailyTarget - scheduled.length);
  if (neededNew > 0 && unsolvedPool.length > 0) {
    
    const scoredPool = unsolvedPool.map(p => {
      let weight = 0;
      
      weight += (p.frequency || 50) * 0.4;
      
      weight += (p.acceptance_rate || 50) * 0.2;
      
      if (weakestTopicNames.has(p.topic)) {
        weight += 40;
      }
      
      if (p.status === 'FAILED') {
        weight += 50;
      }
      return { problem: p, weight };
    });
    
    scoredPool.sort((a, b) => b.weight - a.weight);
    
    const easyCandidates = scoredPool.filter(s => s.problem.difficulty === 'Easy');
    const medCandidates = scoredPool.filter(s => s.problem.difficulty === 'Medium');
    const hardCandidates = scoredPool.filter(s => s.problem.difficulty === 'Hard');
    const selectedIds = new Set(scheduled.map(s => s.id));
    const added: Problem[] = [];
    
    const tryAdd = (candidates: { problem: Problem }[]) => {
      for (const item of candidates) {
        if (!selectedIds.has(item.problem.id) && added.length < neededNew) {
          selectedIds.add(item.problem.id);
          added.push(item.problem);
          break;
        }
      }
    };
    
    if (added.length < neededNew) tryAdd(easyCandidates);
    
    while (added.length < neededNew - 1 && medCandidates.length > 0) {
      const initLen = added.length;
      tryAdd(medCandidates);
      if (added.length === initLen) break;
    }
    
    if (added.length < neededNew) tryAdd(hardCandidates);
    
    while (added.length < neededNew && scoredPool.length > 0) {
      const next = scoredPool.find(s => !selectedIds.has(s.problem.id));
      if (!next) break;
      selectedIds.add(next.problem.id);
      added.push(next.problem);
    }
    scheduled.push(...added);
  }
  return {
    todaysProblems: scheduled,
    dueReviews,
    dailyTarget: pace.dailyTarget,
    completedTodayCount,
    aheadBehindStatus: {
      status: pace.status,
      delta: pace.delta,
      recommendedPace: pace.recommendedPace,
    },
    weakTopics,
  };
}
export function calculateNextReviewInterval(
  currentIntervalDays: number,
  remembered: boolean
): { nextIntervalDays: number; nextReviewDateIso: string } {
  const now = new Date();
  if (!remembered) {
    
    const nextDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    return {
      nextIntervalDays: 1,
      nextReviewDateIso: nextDate.toISOString().split('T')[0],
    };
  }
  
  const idx = REVISION_INTERVALS.indexOf(currentIntervalDays);
  let nextDays = 1;
  if (idx !== -1 && idx < REVISION_INTERVALS.length - 1) {
    nextDays = REVISION_INTERVALS[idx + 1];
  } else if (idx === REVISION_INTERVALS.length - 1) {
    nextDays = 60; 
  } else {
    nextDays = 3;
  }
  const nextDate = new Date(now.getTime() + nextDays * 24 * 60 * 60 * 1000);
  return {
    nextIntervalDays: nextDays,
    nextReviewDateIso: nextDate.toISOString().split('T')[0],
  };
}