import React from 'react';
import { Problem, UserPlan } from '../types';
import { Flag, CheckCircle2, Circle } from 'lucide-react';
interface GoalsTimelineViewProps {
  problems: Problem[];
  plan: UserPlan;
}
export const GoalsTimelineView: React.FC<GoalsTimelineViewProps> = ({ problems, plan }) => {
  const total = problems.length || plan.total_problems || 798;
  const solved = problems.filter(p => p.status === 'SOLVED' || p.status === 'MASTERED').length;
  const milestoneTargets = [100, 200, 300, 400, 500, 600, 700, 798];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
          MILESTONE TRACKER
        </div>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          JOURNEY TIMELINE & GOALS
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Track your progress towards the 798 mastery target through structured horizontal milestones.
        </p>
      </div>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '2rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2rem' }}>
          798 PROBLEM MASTERY ROADMAP
        </h2>
        <div style={{ position: 'relative', padding: '1rem 0' }}>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '20px',
            right: '20px',
            height: '4px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}>
            <div style={{
              height: '100%',
              background: 'var(--accent-primary)',
              width: `${Math.min(100, (solved / total) * 100)}%`,
              transition: 'width var(--transition-normal)',
            }} />
          </div>
          
          <div style={{
            display: 'flex',
            justify: 'space-between',
            position: 'relative',
            zIndex: 2,
          }}>
            {milestoneTargets.map(target => {
              const isReached = solved >= target;
              const isCurrentTarget = !isReached && (milestoneTargets.find(t => solved < t) === target);
              return (
                <div key={target} style={{ textAlign: 'center', background: 'var(--bg-surface)', padding: '0 0.5rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isReached ? 'var(--status-success)' : isCurrentTarget ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                    border: `2px solid ${isReached ? 'var(--status-success)' : isCurrentTarget ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    color: isReached || isCurrentTarget ? '#0B0D0F' : 'var(--text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.5rem auto',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {isReached ? <CheckCircle2 size={18} /> : target}
                  </div>
                  <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: isReached ? 'var(--status-success)' : isCurrentTarget ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}>
                    {target}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          ACTIVE TARGET PACING
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>DAILY GOAL</div>
            <div className="num-stat" style={{ fontSize: '1.3rem', color: 'var(--accent-primary)' }}>
              {plan.daily_target} / day
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>WEEKLY GOAL</div>
            <div className="num-stat" style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              {plan.daily_target * plan.days_per_week} / week
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>MONTHLY TARGET</div>
            <div className="num-stat" style={{ fontSize: '1.3rem', color: 'var(--status-success)' }}>
              {Math.round(plan.daily_target * plan.days_per_week * 4.3)} / month
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>6-MONTH MASTERY</div>
            <div className="num-stat" style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              {total} Problems
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};