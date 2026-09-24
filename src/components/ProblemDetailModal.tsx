import React, { useState, useEffect } from 'react';
import { Problem, ConfidenceLevel, SolvingMethod, ProblemNotes } from '../types';
import { ExternalLink, Play, Square, RotateCcw, Clock, Save, History, CheckCircle2 } from 'lucide-react';
interface ProblemDetailModalProps {
  problem: Problem;
  onClose: () => void;
  onSave: (updatedProblem: Problem, solvingMethod: SolvingMethod, confidence: ConfidenceLevel, solveTimeSec: number) => void;
  historicalAvgMinutes: number;
}
export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  problem,
  onClose,
  onSave,
  historicalAvgMinutes,
}) => {
  
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(problem.solve_time || 0);
  
  const [method, setMethod] = useState<SolvingMethod>('Independent');
  const [confidence, setConfidence] = useState<ConfidenceLevel>(problem.confidence || 'Strong');
  const [notes, setNotes] = useState<ProblemNotes>({
    approach: problem.notes?.approach || '',
    key_insight: problem.notes?.key_insight || '',
    mistake: problem.notes?.mistake || '',
    pattern: problem.notes?.pattern || '',
  });
  const [hintUsed, setHintUsed] = useState(problem.hint_used || false);
  const [solutionViewed, setSolutionViewed] = useState(problem.solution_viewed || false);
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handleSave = () => {
    const updated: Problem = {
      ...problem,
      confidence,
      notes,
      hint_used: hintUsed || method === 'With Hint',
      solution_viewed: solutionViewed || method === 'Saw Solution',
    };
    onSave(updated, method, confidence, secondsElapsed);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '720px', padding: '1.75rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="mono" style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                LeetCode #{problem.leetcode_id}
              </span>
              <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-base)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                {problem.topic}
              </span>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {problem.title}
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
              Frequency: {problem.frequency}% &bull; Acceptance: {problem.acceptance_rate}%
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              OPEN ON LEETCODE <ExternalLink size={14} />
            </a>
            <button onClick={onClose} className="btn btn-sm" style={{ padding: '0.3rem 0.6rem' }}>✕</button>
          </div>
        </div>
        
        <div style={{
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Clock size={20} color="var(--accent-primary)" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                PROBLEM STOPWATCH
              </div>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.05em', color: timerRunning ? 'var(--status-warning)' : 'var(--text-primary)' }}>
                {formatTimer(secondsElapsed)}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {!timerRunning ? (
              <button onClick={() => setTimerRunning(true)} className="btn btn-sm" style={{ color: 'var(--status-success)' }}>
                <Play size={14} /> START
              </button>
            ) : (
              <button onClick={() => setTimerRunning(false)} className="btn btn-sm" style={{ color: 'var(--status-danger)' }}>
                <Square size={14} /> STOP
              </button>
            )}
            <button onClick={() => { setTimerRunning(false); setSecondsElapsed(0); }} className="btn btn-sm" title="Reset Timer">
              <RotateCcw size={14} />
            </button>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            Historical Avg ({problem.difficulty}): <strong style={{ color: 'var(--text-secondary)' }}>{historicalAvgMinutes} min</strong>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
              How did you solve it?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
              {(['Independent', 'With Hint', 'Saw Solution', "Couldn't Solve"] as SolvingMethod[]).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMethod(m);
                    if (m === 'With Hint') setHintUsed(true);
                    if (m === 'Saw Solution') setSolutionViewed(true);
                  }}
                  style={{
                    padding: '0.5rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${method === m ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    background: method === m ? 'var(--accent-subtle)' : 'var(--bg-base)',
                    color: method === m ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontWeight: method === m ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  [{m}]
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
              Confidence Level
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {(['Strong', 'Medium', 'Weak'] as ConfidenceLevel[]).map(c => {
                const isSel = confidence === c;
                const emoji = c === 'Strong' ? '🟢' : c === 'Medium' ? '🟡' : '🔴';
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setConfidence(c)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      fontSize: '0.825rem',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${isSel ? 'var(--border-focus)' : 'var(--border-subtle)'}`,
                      background: isSel ? 'var(--bg-elevated)' : 'var(--bg-base)',
                      color: 'var(--text-primary)',
                      fontWeight: isSel ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {emoji} {c}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
              Problem Notes & Learning Insights
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>APPROACH</span>
                <textarea
                  rows={2}
                  value={notes.approach}
                  onChange={e => setNotes({ ...notes, approach: e.target.value })}
                  placeholder="e.g. Two-pointer scan with sorting..."
                  className="input"
                  style={{ width: '100%', marginTop: '0.2rem', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>KEY INSIGHT</span>
                <textarea
                  rows={2}
                  value={notes.key_insight}
                  onChange={e => setNotes({ ...notes, key_insight: e.target.value })}
                  placeholder="e.g. Skip duplicates to avoid duplicate triplets..."
                  className="input"
                  style={{ width: '100%', marginTop: '0.2rem', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>MISTAKE / PITFALL</span>
                <textarea
                  rows={2}
                  value={notes.mistake}
                  onChange={e => setNotes({ ...notes, mistake: e.target.value })}
                  placeholder="e.g. Off-by-one boundary check when inner left > right..."
                  className="input"
                  style={{ width: '100%', marginTop: '0.2rem', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>PATTERN RECOGNITION</span>
                <textarea
                  rows={2}
                  value={notes.pattern}
                  onChange={e => setNotes({ ...notes, pattern: e.target.value })}
                  placeholder="e.g. 3Sum -> Target sum 2-pointer variant..."
                  className="input"
                  style={{ width: '100%', marginTop: '0.2rem', fontSize: '0.8rem' }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><History size={13} /> Attempts: {problem.attempt_count || 0}</span>
          <span>&bull;</span>
          <span>Next Review: {problem.next_review_at || 'Not scheduled'}</span>
          <span>&bull;</span>
          <span>Review Interval: {problem.review_interval_days || 0}d</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button onClick={onClose} className="btn">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary" style={{ padding: '0.55rem 1.25rem' }}>
            <Save size={14} /> SAVE & UPDATE STATUS
          </button>
        </div>
      </div>
    </div>
  );
};