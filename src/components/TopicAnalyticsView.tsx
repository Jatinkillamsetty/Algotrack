import React from 'react';
import { Problem } from '../types';
import { CANONICAL_TOPICS } from '../services/topicMapper';
import { AlertCircle, Target, BarChart2 } from 'lucide-react';
interface TopicAnalyticsViewProps {
  problems: Problem[];
}
export const TopicAnalyticsView: React.FC<TopicAnalyticsViewProps> = ({ problems }) => {
  
  const topicStats = CANONICAL_TOPICS.map(topicName => {
    const topicProblems = problems.filter(p => p.topic === topicName);
    const total = topicProblems.length;
    const solved = topicProblems.filter(p => p.status === 'SOLVED' || p.status === 'MASTERED').length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
    const failedCount = topicProblems.filter(p => p.status === 'FAILED' || p.attempt_count > 1).length;
    return {
      topic: topicName,
      total,
      solved,
      percentage,
      failedCount,
    };
  });
  
  topicStats.sort((a, b) => b.percentage - a.percentage);
  
  const weakTopic = [...topicStats].sort((a, b) => a.percentage - b.percentage)[0];
  const renderTextBar = (pct: number) => {
    const totalBlocks = 12;
    const filledBlocks = Math.round((pct / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
          TOPIC MASTERY ENGINE
        </div>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          PATTERN & TOPIC BREAKDOWN
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Real-time tracking across 15 canonical Data Structures and Algorithms topic domains.
        </p>
      </div>
      
      {weakTopic && (
        <div style={{
          background: 'var(--status-danger-bg)',
          border: '1px solid rgba(232, 131, 131, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
        }}>
          <AlertCircle size={24} color="var(--status-danger)" style={{ marginTop: '0.1rem' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--status-danger)', fontWeight: 700, letterSpacing: '0.05em' }}>
              YOUR CURRENT WEAKNESS DETECTED
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
              {weakTopic.topic} &middot; <span style={{ color: 'var(--status-danger)' }}>{weakTopic.percentage}% Mastery</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Recommended: <strong style={{ color: 'var(--text-primary)' }}>8 {weakTopic.topic} problems this week</strong> to raise pattern confidence. The Smart Scheduler has automatically elevated this topic in your daily mix.
            </div>
          </div>
        </div>
      )}
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          TOPIC MASTERY BARS
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {topicStats.map(stat => (
            <div key={stat.topic} style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              padding: '0.85rem 1.1rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {stat.topic}
                  </span>
                  <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {stat.solved} / {stat.total} solved
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span className="mono" style={{
                    fontSize: '0.95rem',
                    color: stat.percentage >= 70 ? 'var(--status-success)' : stat.percentage >= 40 ? 'var(--status-warning)' : 'var(--status-danger)',
                    letterSpacing: '0.05em',
                  }}>
                    {renderTextBar(stat.percentage)}
                  </span>
                  <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {stat.percentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};