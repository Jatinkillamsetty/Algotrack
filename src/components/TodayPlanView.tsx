import React from 'react';
import { Problem, UserPlan, ConfidenceLevel } from '../types';
import { ExternalLink, Play, CheckCircle2, XCircle, Flame, Target, Clock, AlertCircle } from 'lucide-react';
interface TodayPlanViewProps {
  todaysProblems: Problem[];
  problems: Problem[];
  plan: UserPlan;
  streak: number;
  dueReviewsCount: number;
  onOpenProblem: (problem: Problem) => void;
  onQuickSolve: (problem: Problem, confidence: ConfidenceLevel) => void;
  onQuickFail: (problem: Problem) => void;
  onStartTimer: (problem: Problem) => void;
  onNavigateToReview: () => void;
}
export const TodayPlanView: React.FC<TodayPlanViewProps> = ({
  todaysProblems,
  problems,
  plan,
  streak,
  dueReviewsCount,
  onOpenProblem,
  onQuickSolve,
  onQuickFail,
  onStartTimer,
  onNavigateToReview,
}) => {
  const total = problems.length || plan.total_problems || 798;
  const solved = problems.filter(p => p.status === 'SOLVED' || p.status === 'MASTERED').length;
  const remaining = total - solved;
  const completedTodayCount = todaysProblems.filter(p => p.status === 'SOLVED' || p.status === 'MASTERED').length;
  const targetToday = todaysProblems.length || plan.daily_target || 5;
  const pct = ((solved / total) * 100).toFixed(1);
  
  const startDate = new Date(plan.start_date);
  const targetDate = new Date(plan.target_date);
  const now = new Date();
  const totalDays = Math.max(1, Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
  const elapsedDays = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
  const expectedSolved = Math.min(total, Math.round((total / totalDays) * elapsedDays));
  const delta = solved - expectedSolved;
  const dateHeaderStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
              {dateHeaderStr}
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
              YOUR SIX-MONTH RUN
            </h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
              <span className="num-stat" style={{ fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1 }}>
                {solved} <span style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>/ {total}</span>
              </span>
              <span className="num-stat" style={{ fontSize: '1.25rem', color: 'var(--accent-primary)' }}>
                {pct}%
              </span>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Completed</div>
              <div className="num-stat" style={{ fontSize: '1.1rem', color: 'var(--status-success)' }}>{solved} solved</div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Remaining</div>
              <div className="num-stat" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{remaining} left</div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Today</div>
              <div className="num-stat" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>
                {completedTodayCount} / {targetToday}
              </div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Streak</div>
              <div className="num-stat" style={{ fontSize: '1.1rem', color: 'var(--status-warning)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Flame size={14} fill="var(--status-warning)" /> {streak} days
              </div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Pace</div>
              <div className="num-stat" style={{ 
                fontSize: '1.1rem', 
                color: delta >= 0 ? 'var(--status-success)' : 'var(--status-danger)' 
              }}>
                {delta >= 0 ? `+${delta} ahead` : `${delta} behind`}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '1.25rem' }}>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      
      {dueReviewsCount > 0 && (
        <div style={{
          background: 'var(--status-warning-bg)',
          border: '1px solid rgba(242, 200, 121, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={18} color="var(--status-warning)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              You have <strong style={{ color: 'var(--status-warning)' }}>{dueReviewsCount} problem{dueReviewsCount > 1 ? 's' : ''}</strong> due in your Spaced Repetition Review Queue today.
            </span>
          </div>
          <button onClick={onNavigateToReview} className="btn btn-sm" style={{ borderColor: 'rgba(242, 200, 121, 0.4)' }}>
            GO TO REVIEW QUEUE →
          </button>
        </div>
      )}
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.05em' }}>
              CENTRAL FOCUS
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.1rem 0' }}>
              TODAY'S RUN
            </h2>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{todaysProblems.length}</strong> problems &middot;{' '}
            <strong style={{ color: 'var(--status-success)' }}>{completedTodayCount}</strong> completed
          </div>
        </div>
        {todaysProblems.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No problems scheduled for today. Take a rest or start a random practice drill!
          </div>
        ) : (
          <div className="timeline-session">
            {todaysProblems.map((prob, idx) => {
              const isSolved = prob.status === 'SOLVED' || prob.status === 'MASTERED';
              const isFailed = prob.status === 'FAILED';
              const isFirstUnsolved = !isSolved && todaysProblems.findIndex(p => p.status !== 'SOLVED' && p.status !== 'MASTERED') === idx;
              const estMinutes = prob.difficulty === 'Easy' ? 20 : prob.difficulty === 'Medium' ? 35 : 50;
              return (
                <div key={prob.id} className="timeline-item">
                  
                  <div className={`timeline-node ${isSolved ? 'completed' : isFailed ? 'failed' : isFirstUnsolved ? 'active' : ''}`} />
                  <div style={{
                    background: isFirstUnsolved ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                    border: `1px solid ${isFirstUnsolved ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    opacity: isSolved ? 0.65 : 1,
                    transition: 'all var(--transition-fast)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                            #{prob.id}
                          </span>
                          <span className={`badge badge-${prob.difficulty.toLowerCase()}`}>
                            {prob.difficulty}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-base)', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                            {prob.topic}
                          </span>
                        </div>
                        <h3 style={{
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          color: isSolved ? 'var(--text-secondary)' : 'var(--text-primary)',
                          textDecoration: isSolved ? 'line-through' : 'none',
                          marginBottom: '0.4rem',
                          cursor: 'pointer',
                        }}
                        onClick={() => onOpenProblem(prob)}
                        >
                          {prob.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                          <span>Freq: {prob.frequency}%</span>
                          <span>&bull;</span>
                          <span>Acc: {prob.acceptance_rate}%</span>
                          <span>&bull;</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Clock size={12} /> Est. {estMinutes}m
                          </span>
                          {prob.solve_time && (
                            <>
                              <span>&bull;</span>
                              <span style={{ color: 'var(--status-success)' }}>
                                Solved in {Math.round(prob.solve_time / 60)}m
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm"
                          style={{ color: 'var(--accent-primary)', borderColor: 'rgba(124, 156, 255, 0.3)' }}
                        >
                          OPEN ON LEETCODE <ExternalLink size={12} />
                        </a>
                        <button
                          onClick={() => onStartTimer(prob)}
                          className="btn btn-sm"
                          title="Start Problem Stopwatch"
                        >
                          <Play size={12} /> Timer
                        </button>
                        {!isSolved ? (
                          <>
                            <button
                              onClick={() => onQuickSolve(prob, 'Strong')}
                              className="btn btn-sm btn-primary"
                              style={{ background: 'var(--status-success)', color: '#0B0D0F', borderColor: 'var(--status-success)' }}
                            >
                              <CheckCircle2 size={12} /> Solved
                            </button>
                            <button
                              onClick={() => onQuickFail(prob)}
                              className="btn btn-sm"
                              style={{ color: 'var(--status-danger)', borderColor: 'rgba(232, 131, 131, 0.3)' }}
                            >
                              <XCircle size={12} /> Failed
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onOpenProblem(prob)}
                            className="btn btn-sm"
                            style={{ color: 'var(--status-success)' }}
                          >
                            <CheckCircle2 size={12} /> Log Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};