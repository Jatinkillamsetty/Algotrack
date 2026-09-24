import React from 'react';
import { Problem } from '../types';
import { Repeat, CheckCircle2, RotateCcw, ExternalLink } from 'lucide-react';
interface ReviewQueueViewProps {
  dueReviews: Problem[];
  onRemember: (problem: Problem) => void;
  onForgotten: (problem: Problem) => void;
  onOpenProblem: (problem: Problem) => void;
}
export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({
  dueReviews,
  onRemember,
  onForgotten,
  onOpenProblem,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--status-warning)', fontWeight: 600, letterSpacing: '0.05em' }}>
              SPACED REPETITION ENGINE
            </div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0.1rem 0' }}>
              REVIEW QUEUE
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Default interval schedule: Day 0 &rarr; Day 1 &rarr; Day 3 &rarr; Day 7 &rarr; Day 14 &rarr; Day 30.
            </p>
          </div>
          <div style={{
            background: 'var(--status-warning-bg)',
            border: '1px solid rgba(242, 200, 121, 0.3)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--status-warning)',
          }}>
            TODAY &middot; {dueReviews.length} REVIEWS DUE
          </div>
        </div>
      </div>
      {dueReviews.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <CheckCircle2 size={32} color="var(--status-success)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Review Queue Clean!
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            You have no due revisions today. All learned patterns are reinforced.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {dueReviews.map(prob => {
            const lastSolvedStr = prob.last_attempted_at ? `${prob.last_attempted_at.split('T')[0]}` : 'Recently';
            return (
              <div
                key={prob.id}
                className="card"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                      #{prob.id}
                    </span>
                    <span className={`badge badge-${prob.difficulty.toLowerCase()}`}>
                      {prob.difficulty}
                    </span>
                  </div>
                  <h3
                    onClick={() => onOpenProblem(prob)}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '0.35rem',
                      cursor: 'pointer',
                    }}
                  >
                    {prob.title}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    Topic: <strong style={{ color: 'var(--text-primary)' }}>{prob.topic}</strong>
                  </div>
                  <div style={{
                    background: 'var(--bg-base)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-tertiary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span>Last Solved: <strong style={{ color: 'var(--text-secondary)' }}>{lastSolvedStr}</strong></span>
                    <span>Interval: <strong style={{ color: 'var(--accent-primary)' }}>{prob.review_interval_days || 1}d</strong></span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <button
                    onClick={() => onRemember(prob)}
                    className="btn btn-sm btn-primary"
                    style={{ flex: 1, background: 'var(--status-success)', color: '#0B0D0F', borderColor: 'var(--status-success)' }}
                  >
                    <CheckCircle2 size={13} /> REMEMBER
                  </button>
                  <button
                    onClick={() => onForgotten(prob)}
                    className="btn btn-sm"
                    style={{ flex: 1, color: 'var(--status-danger)', borderColor: 'rgba(232, 131, 131, 0.4)' }}
                  >
                    <RotateCcw size={13} /> FORGOTTEN
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};