import React from 'react';
import { Problem, UserPlan } from '../types';
import { calculatePaceStats } from '../services/scheduler';
import { TrendingUp, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
interface ProgressViewProps {
  problems: Problem[];
  plan: UserPlan;
}
export const ProgressView: React.FC<ProgressViewProps> = ({ problems, plan }) => {
  const pace = calculatePaceStats(problems, plan);
  const total = pace.total;
  const solved = pace.solved;
  const remaining = pace.remaining;
  const pct = ((solved / total) * 100).toFixed(1);
  
  const now = new Date();
  const dayCutoff = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
  const weekCutoff = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();
  const monthCutoff = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString();
  const dailyCount = problems.filter(p => p.last_attempted_at && p.last_attempted_at >= dayCutoff && (p.status === 'SOLVED' || p.status === 'MASTERED')).length;
  const weeklyCount = problems.filter(p => p.last_attempted_at && p.last_attempted_at >= weekCutoff && (p.status === 'SOLVED' || p.status === 'MASTERED')).length;
  const monthlyCount = problems.filter(p => p.last_attempted_at && p.last_attempted_at >= monthCutoff && (p.status === 'SOLVED' || p.status === 'MASTERED')).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
          TRAINING TIMELINE
        </div>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
          6-MONTH PROGRESS MASTERY
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>TOTAL CATALOG</div>
            <div className="num-stat" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{total}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>SOLVED & MASTERED</div>
            <div className="num-stat" style={{ fontSize: '1.5rem', color: 'var(--status-success)' }}>{solved} ({pct}%)</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>REMAINING TO MASTERY</div>
            <div className="num-stat" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>{remaining}</div>
          </div>
        </div>
        <div className="progress-bar-track" style={{ height: '8px' }}>
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          EXPECTED VS ACTUAL PACE
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>EXPECTED SOLVED TODAY</div>
            <div className="num-stat" style={{ fontSize: '1.4rem', color: 'var(--text-secondary)' }}>
              {pace.expectedSolved}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
              Day {pace.elapsedDays} of {pace.totalDays}
            </div>
          </div>
          <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>ACTUAL SOLVED</div>
            <div className="num-stat" style={{ fontSize: '1.4rem', color: 'var(--status-success)' }}>
              {solved}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
              Real-time verified count
            </div>
          </div>
          <div style={{ background: 'var(--bg-base)', border: `1px solid ${pace.delta >= 0 ? 'rgba(125, 211, 168, 0.3)' : 'rgba(232, 131, 131, 0.3)'}`, padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>PACE DELTA</div>
            <div className="num-stat" style={{ fontSize: '1.4rem', color: pace.delta >= 0 ? 'var(--status-success)' : 'var(--status-danger)' }}>
              {pace.delta >= 0 ? `+${pace.delta} problems ahead` : `${Math.abs(pace.delta)} problems behind`}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
              {pace.delta >= 0 ? 'Excellent momentum!' : 'Graceful recovery plan active'}
            </div>
          </div>
        </div>
        
        {pace.delta < 0 && (
          <div style={{
            background: 'var(--status-warning-bg)',
            border: '1px solid rgba(242, 200, 121, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}>
            <AlertTriangle size={24} color="var(--status-warning)" />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                AUTOMATIC RECOVERY PLAN ACTIVE
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                You are currently {Math.abs(pace.delta)} problems behind schedule. Instead of overloading tomorrow, your recommended pace is automatically adjusted to <strong style={{ color: 'var(--accent-primary)' }}>{pace.recommendedPace} / day</strong> across the remaining {pace.remainingActiveDays} active days.
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          SOLVES BY TIME WINDOW
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>LAST 24 HOURS</div>
            <div className="num-stat" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{dailyCount}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>LAST 7 DAYS</div>
            <div className="num-stat" style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }}>{weeklyCount}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>LAST 30 DAYS</div>
            <div className="num-stat" style={{ fontSize: '1.5rem', color: 'var(--status-success)' }}>{monthlyCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};