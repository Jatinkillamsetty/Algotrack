import React, { useState } from 'react';
import { Problem, AttemptLog } from '../types';
import { computeAnalytics } from '../services/analytics';
import { Clock, Flame, CheckCircle2, AlertOctagon, Calendar, Zap, ShieldCheck } from 'lucide-react';
interface AnalyticsViewProps {
  problems: Problem[];
  attemptLogs: AttemptLog[];
}
export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ problems, attemptLogs }) => {
  const [dateFilterDays, setDateFilterDays] = useState<number>(0); 
  const stats = computeAnalytics(problems, attemptLogs, dateFilterDays);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.05em' }}>
              PERFORMANCE METRICS
            </div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0.1rem 0' }}>
              ANALYTICS & METRICS
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-base)', padding: '0.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            {[
              { label: '7 Days', days: 7 },
              { label: '30 Days', days: 30 },
              { label: '3 Months', days: 90 },
              { label: 'All Time', days: 0 },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setDateFilterDays(item.days)}
                className="btn btn-sm"
                style={{
                  background: dateFilterDays === item.days ? 'var(--bg-elevated)' : 'transparent',
                  color: dateFilterDays === item.days ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: '1px solid transparent',
                  fontWeight: dateFilterDays === item.days ? 600 : 400,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          CONSISTENCY TRACKER
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Flame size={28} color="var(--status-warning)" fill="var(--status-warning)" />
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>CURRENT STREAK</div>
              <div className="num-stat" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{stats.currentStreak} Days</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Zap size={28} color="var(--accent-primary)" />
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>LONGEST STREAK</div>
              <div className="num-stat" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{stats.longestStreak} Days</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Calendar size={28} color="var(--status-success)" />
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>ACTIVE DAYS</div>
              <div className="num-stat" style={{ fontSize: '1.4rem', color: 'var(--status-success)' }}>{stats.activeDaysCount} Days</div>
            </div>
          </div>
        </div>
        
        <div style={{
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem',
          display: 'flex',
          justify: 'space-around',
          alignItems: 'center',
        }}>
          {stats.weeklyGrid.map((item, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
                {item.dayName}
              </div>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: item.active ? 'var(--status-success)' : 'var(--bg-elevated)',
                border: `1px solid ${item.active ? 'var(--status-success)' : 'var(--border-subtle)'}`,
                margin: '0 auto',
              }} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          AVERAGE SOLVE TIME BY DIFFICULTY
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <span className="badge badge-easy" style={{ marginBottom: '0.5rem' }}>EASY</span>
            <div className="num-stat" style={{ fontSize: '1.6rem', color: 'var(--status-success)' }}>
              {stats.avgSolveTimeMinutes.Easy} <span style={{ fontSize: '0.9rem' }}>min</span>
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <span className="badge badge-medium" style={{ marginBottom: '0.5rem' }}>MEDIUM</span>
            <div className="num-stat" style={{ fontSize: '1.6rem', color: 'var(--status-warning)' }}>
              {stats.avgSolveTimeMinutes.Medium} <span style={{ fontSize: '0.9rem' }}>min</span>
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <span className="badge badge-hard" style={{ marginBottom: '0.5rem' }}>HARD</span>
            <div className="num-stat" style={{ fontSize: '1.6rem', color: 'var(--status-danger)' }}>
              {stats.avgSolveTimeMinutes.Hard} <span style={{ fontSize: '0.9rem' }}>min</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          SOLVING METHOD & INDEPENDENCE RATE
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>INDEPENDENT</div>
            <div className="num-stat" style={{ fontSize: '1.4rem', color: 'var(--status-success)' }}>
              {stats.methodBreakdown.Independent}
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>WITH HINT</div>
            <div className="num-stat" style={{ fontSize: '1.4rem', color: 'var(--status-warning)' }}>
              {stats.methodBreakdown.WithHint}
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>SAW SOLUTION</div>
            <div className="num-stat" style={{ fontSize: '1.4rem', color: 'var(--accent-primary)' }}>
              {stats.methodBreakdown.SawSolution}
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>COULDN'T SOLVE</div>
            <div className="num-stat" style={{ fontSize: '1.4rem', color: 'var(--status-danger)' }}>
              {stats.methodBreakdown.CouldntSolve}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};