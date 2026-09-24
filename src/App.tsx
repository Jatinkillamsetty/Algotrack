import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Problem, 
  UserPlan, 
  AttemptLog, 
  NavTab, 
  ConfidenceLevel, 
  SolvingMethod 
} from './types';
import {
  loadProblems,
  saveProblems,
  loadUserPlan,
  saveUserPlan,
  loadAttemptLogs,
  saveAttemptLogs,
  fetchDefaultDataset,
} from './services/storage';
import { generateDailySchedule, calculateNextReviewInterval } from './services/scheduler';
import { computeWeakTopics } from './services/scheduler';
import { HeaderNav } from './components/HeaderNav';
import { OnboardingModal } from './components/OnboardingModal';
import { TodayPlanView } from './components/TodayPlanView';
import { ProblemDetailModal } from './components/ProblemDetailModal';
import { ReviewQueueView } from './components/ReviewQueueView';
import { ProblemsListView } from './components/ProblemsListView';
import { ProgressView } from './components/ProgressView';
import { TopicAnalyticsView } from './components/TopicAnalyticsView';
import { AnalyticsView } from './components/AnalyticsView';
import { GoalsTimelineView } from './components/GoalsTimelineView';
import { MockInterviewView } from './components/MockInterviewView';
import { RandomPracticeModal } from './components/RandomPracticeModal';
import { NotificationBanner } from './components/NotificationBanner';
import { 
  CheckSquare, 
  ListFilter, 
  Repeat, 
  TrendingUp, 
  BarChart3, 
  Flag, 
  Zap 
} from 'lucide-react';
export const App: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [plan, setPlan] = useState<UserPlan>(loadUserPlan());
  const [attemptLogs, setAttemptLogs] = useState<AttemptLog[]>(loadAttemptLogs());
  const [activeTab, setActiveTab] = useState<NavTab>('today');
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function initData() {
      let stored = loadProblems();
      if (stored.length === 0) {
        stored = await fetchDefaultDataset();
        if (stored.length > 0) {
          saveProblems(stored);
        }
      }
      setProblems(stored);
      const userPlan = loadUserPlan();
      setPlan(userPlan);
      if (!userPlan.is_onboarded) {
        setShowOnboarding(true);
      }
      setLoading(false);
    }
    initData();
  }, []);
  
  const updateProblemsState = (newProblems: Problem[]) => {
    setProblems(newProblems);
    saveProblems(newProblems);
    
    const solvedCount = newProblems.filter(p => p.status === 'SOLVED' || p.status === 'MASTERED').length;
    if (solvedCount >= 798) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };
  const handleSavePlan = (updatedPlan: UserPlan) => {
    setPlan(updatedPlan);
    saveUserPlan(updatedPlan);
    setShowOnboarding(false);
  };
  
  const scheduleResult = generateDailySchedule(problems, plan);
  const dueReviewsCount = scheduleResult.dueReviews.length;
  
  const activeDates = new Set<string>();
  attemptLogs.forEach(a => activeDates.add(a.timestamp.split('T')[0]));
  problems.forEach(p => {
    if (p.last_attempted_at) activeDates.add(p.last_attempted_at.split('T')[0]);
  });
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let currentStreak = 0;
  let checkDate = new Date();
  if (!activeDates.has(todayStr) && activeDates.has(yesterdayStr)) {
    checkDate = new Date(Date.now() - 86400000);
  }
  while (activeDates.has(checkDate.toISOString().split('T')[0])) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  const handleQuickSolve = (prob: Problem, confidence: ConfidenceLevel = 'Strong') => {
    const nowIso = new Date().toISOString();
    const updated = problems.map(p => {
      if (p.id === prob.id) {
        const rev = calculateNextReviewInterval(p.review_interval_days || 0, true);
        return {
          ...p,
          status: 'SOLVED' as const,
          confidence,
          first_solved_at: p.first_solved_at || nowIso,
          last_attempted_at: nowIso,
          attempt_count: (p.attempt_count || 0) + 1,
          next_review_at: rev.nextReviewDateIso,
          review_interval_days: rev.nextIntervalDays,
        };
      }
      return p;
    });
    updateProblemsState(updated);
  };
  const handleQuickFail = (prob: Problem) => {
    const nowIso = new Date().toISOString();
    const updated = problems.map(p => {
      if (p.id === prob.id) {
        const rev = calculateNextReviewInterval(p.review_interval_days || 0, false);
        return {
          ...p,
          status: 'FAILED' as const,
          confidence: 'Weak' as const,
          last_attempted_at: nowIso,
          attempt_count: (p.attempt_count || 0) + 1,
          next_review_at: rev.nextReviewDateIso,
          review_interval_days: rev.nextIntervalDays,
        };
      }
      return p;
    });
    updateProblemsState(updated);
  };
  const handleSaveModalAttempt = (
    prob: Problem, 
    method: SolvingMethod, 
    confidence: ConfidenceLevel, 
    solveTimeSec: number
  ) => {
    const nowIso = new Date().toISOString();
    const isSuccess = method === 'Independent' || method === 'With Hint' || method === 'Saw Solution';
    const rev = calculateNextReviewInterval(prob.review_interval_days || 0, isSuccess);
    const updatedProblem: Problem = {
      ...prob,
      status: isSuccess ? 'SOLVED' : 'FAILED',
      confidence,
      solve_time: solveTimeSec > 0 ? solveTimeSec : prob.solve_time,
      first_solved_at: isSuccess ? (prob.first_solved_at || nowIso) : prob.first_solved_at,
      last_attempted_at: nowIso,
      attempt_count: (prob.attempt_count || 0) + 1,
      next_review_at: rev.nextReviewDateIso,
      review_interval_days: rev.nextIntervalDays,
    };
    const updatedProblems = problems.map(p => p.id === prob.id ? updatedProblem : p);
    updateProblemsState(updatedProblems);
    
    const newLog: AttemptLog = {
      id: `${Date.now()}-${prob.id}`,
      problem_id: prob.id,
      timestamp: nowIso,
      solving_method: method,
      confidence,
      solve_time: solveTimeSec,
      notes: prob.notes,
    };
    const newLogs = [newLog, ...attemptLogs];
    setAttemptLogs(newLogs);
    saveAttemptLogs(newLogs);
    setSelectedProblem(null);
  };
  const handleSpacedRemember = (prob: Problem) => {
    handleQuickSolve(prob, 'Strong');
  };
  const handleSpacedForgotten = (prob: Problem) => {
    handleQuickFail(prob);
  };
  const handleTopicUpdate = (problemId: number, newTopic: string) => {
    const updated = problems.map(p => p.id === problemId ? { ...p, topic: newTopic } : p);
    updateProblemsState(updated);
  };
  const weakTopics = computeWeakTopics(problems);
  const topWeakTopic = weakTopics.length > 0 ? weakTopics[0].topic : undefined;
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
      }}>
        INITIALIZING DSA COMMAND CENTER...
      </div>
    );
  }
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        plan={plan}
        problems={problems}
        dueReviewsCount={dueReviewsCount}
        onOpenRandom={() => setShowRandomModal(true)}
        onOpenNotifications={() => setShowNotificationModal(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />
      
      <main className="command-container">
        {activeTab === 'today' && (
          <TodayPlanView
            todaysProblems={scheduleResult.todaysProblems}
            problems={problems}
            plan={plan}
            streak={currentStreak}
            dueReviewsCount={dueReviewsCount}
            onOpenProblem={(p) => setSelectedProblem(p)}
            onQuickSolve={handleQuickSolve}
            onQuickFail={handleQuickFail}
            onStartTimer={(p) => setSelectedProblem(p)}
            onNavigateToReview={() => setActiveTab('review')}
          />
        )}
        {activeTab === 'problems' && (
          <ProblemsListView
            problems={problems}
            onOpenProblem={(p) => setSelectedProblem(p)}
            onImportProblems={updateProblemsState}
            onUpdateTopic={handleTopicUpdate}
          />
        )}
        {activeTab === 'review' && (
          <ReviewQueueView
            dueReviews={scheduleResult.dueReviews}
            onRemember={handleSpacedRemember}
            onForgotten={handleSpacedForgotten}
            onOpenProblem={(p) => setSelectedProblem(p)}
          />
        )}
        {activeTab === 'progress' && (
          <ProgressView
            problems={problems}
            plan={plan}
          />
        )}
        {activeTab === 'analytics' && (
          <TopicAnalyticsView
            problems={problems}
          />
        )}
        {activeTab === 'goals' && (
          <GoalsTimelineView
            problems={problems}
            plan={plan}
          />
        )}
        {activeTab === 'interview' && (
          <MockInterviewView
            problems={problems}
            onCompleteMock={(completedIds) => {
              completedIds.forEach(id => {
                const targetProb = problems.find(p => p.id === id);
                if (targetProb) handleQuickSolve(targetProb, 'Strong');
              });
            }}
          />
        )}
      </main>
      
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'none',
        justify: 'space-around',
        padding: '0.5rem 0.25rem',
        zIndex: 40,
      }} className="mobile-nav">
        {[
          { id: 'today', label: 'Today', icon: <CheckSquare size={16} /> },
          { id: 'problems', label: 'Problems', icon: <ListFilter size={16} /> },
          { id: 'review', label: 'Review', icon: <Repeat size={16} />, badge: dueReviewsCount },
          { id: 'progress', label: 'Progress', icon: <TrendingUp size={16} /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as NavTab)}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === item.id ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.65rem',
              gap: '0.2rem',
              cursor: 'pointer',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      
      {showOnboarding && (
        <OnboardingModal
          plan={plan}
          totalProblemsCount={problems.length}
          onSavePlan={handleSavePlan}
          onClose={() => setShowOnboarding(false)}
          isInitialSetup={!plan.is_onboarded}
        />
      )}
      {selectedProblem && (
        <ProblemDetailModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onSave={handleSaveModalAttempt}
          historicalAvgMinutes={
            selectedProblem.difficulty === 'Easy' ? 18 : selectedProblem.difficulty === 'Medium' ? 31 : 48
          }
        />
      )}
      {showRandomModal && (
        <RandomPracticeModal
          problems={problems}
          onClose={() => setShowRandomModal(false)}
          onSelectProblem={(p) => setSelectedProblem(p)}
          weakTopicName={topWeakTopic}
        />
      )}
      {showNotificationModal && (
        <NotificationBanner
          plan={plan}
          remainingTodayCount={scheduleResult.todaysProblems.filter(p => p.status !== 'SOLVED' && p.status !== 'MASTERED').length}
          delta={scheduleResult.aheadBehindStatus.delta}
          onSaveReminders={(updated) => {
            const updatedPlan = { ...plan, reminders: updated };
            setPlan(updatedPlan);
            saveUserPlan(updatedPlan);
          }}
          onClose={() => setShowNotificationModal(false)}
        />
      )}
    </div>
  );
};