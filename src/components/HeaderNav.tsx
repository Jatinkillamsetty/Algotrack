import React from 'react';
import { NavTab, UserPlan, Problem } from '../types';
import { 
  CheckSquare, 
  ListFilter, 
  Repeat, 
  TrendingUp, 
  BarChart3, 
  Flag, 
  Zap, 
  Bell, 
  Shuffle 
} from 'lucide-react';
interface HeaderNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  plan: UserPlan;
  problems: Problem[];
  dueReviewsCount: number;
  onOpenRandom: () => void;
  onOpenNotifications: () => void;
  onOpenOnboarding: () => void;
}
export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  plan,
  problems,
  dueReviewsCount,
  onOpenRandom,
  onOpenNotifications,
  onOpenOnboarding,
}) => {
  const total = problems.length || plan.total_problems || 798;
  const solved = problems.filter(p => p.status === 'SOLVED' || p.status === 'MASTERED').length;
  const pct = ((solved / total) * 100).toFixed(1);
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'today', label: "Today's Run", icon: <CheckSquare size={15} /> },
    { id: 'problems', label: 'Problems', icon: <ListFilter size={15} /> },
    { id: 'review', label: 'Review', icon: <Repeat size={15} />, badge: dueReviewsCount },
    { id: 'progress', label: 'Progress', icon: <TrendingUp size={15} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={15} /> },
    { id: 'goals', label: 'Goals', icon: <Flag size={15} /> },
    { id: 'interview', label: 'Mock Interview', icon: <Zap size={15} /> },
  ];
  return (
    <header style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ cursor: 'pointer' }} onClick={onOpenOnboarding}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                fontFamily: 'var(--font-mono)', 
                fontWeight: 700, 
                fontSize: '1.05rem', 
                letterSpacing: '0.05em',
                color: 'var(--text-primary)'
              }}>
                DSA RUN
              </span>
              <span style={{ 
                fontSize: '0.65rem', 
                background: 'var(--accent-subtle)', 
                color: 'var(--accent-primary)',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600
              }}>
                COMMAND CENTER
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '0.1rem' }}>
              {todayStr}
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            padding: '0.3rem 0.7rem',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.775rem',
          }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{solved}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>/ {total}</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600, marginLeft: '0.2rem' }}>{pct}%</span>
          </div>
        </div>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', overflowX: 'auto' }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span style={{
                    background: 'var(--status-warning)',
                    color: '#0B0D0F',
                    borderRadius: '8px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.05rem 0.35rem',
                    lineHeight: 1,
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={onOpenRandom}
            className="btn btn-sm"
            title="Random Practice Drill"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Shuffle size={13} />
            <span style={{ fontSize: '0.75rem' }}>Random</span>
          </button>
          
          <button
            onClick={onOpenNotifications}
            className="btn btn-sm"
            title="Reminder Settings"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: plan.reminders.enabled ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
          >
            <Bell size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};