import React, { useState, useEffect } from 'react';
import { Problem, Difficulty } from '../types';
import { Zap, Clock, ExternalLink, Play, Square, CheckCircle2, XCircle } from 'lucide-react';
interface MockInterviewViewProps {
  problems: Problem[];
  onCompleteMock: (completedIds: number[], timeSpentSec: number) => void;
}
export const MockInterviewView: React.FC<MockInterviewViewProps> = ({ problems, onCompleteMock }) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [selectedDiff, setSelectedDiff] = useState<Difficulty | 'RANDOM' | 'WEAK'>('Medium');
  const [mockProblems, setMockProblems] = useState<Problem[]>([]);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [failedIds, setFailedIds] = useState<number[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(45 * 60);
  const [sessionFinished, setSessionFinished] = useState(false);
  useEffect(() => {
    let timer: any = null;
    if (sessionActive && remainingSeconds > 0) {
      timer = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            setSessionActive(false);
            setSessionFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionActive, remainingSeconds]);
  const startInterview = () => {
    
    let candidatePool = [...problems];
    if (selectedDiff !== 'RANDOM' && selectedDiff !== 'WEAK') {
      candidatePool = candidatePool.filter(p => p.difficulty === selectedDiff);
    }
    
    const shuffled = [...candidatePool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, durationMinutes >= 45 ? 2 : 1);
    setMockProblems(selected);
    setCompletedIds([]);
    setFailedIds([]);
    setRemainingSeconds(durationMinutes * 60);
    setSessionActive(true);
    setSessionFinished(false);
  };
  const finishInterview = () => {
    setSessionActive(false);
    setSessionFinished(true);
    const timeSpentSec = durationMinutes * 60 - remainingSeconds;
    onCompleteMock(completedIds, timeSpentSec);
  };
  const toggleSolve = (id: number) => {
    if (completedIds.includes(id)) {
      setCompletedIds(completedIds.filter(i => i !== id));
    } else {
      setCompletedIds([...completedIds, id]);
      setFailedIds(failedIds.filter(i => i !== id));
    }
  };
  const toggleFail = (id: number) => {
    if (failedIds.includes(id)) {
      setFailedIds(failedIds.filter(i => i !== id));
    } else {
      setFailedIds([...failedIds, id]);
      setCompletedIds(completedIds.filter(i => i !== id));
    }
  };
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
          TIME-BOUND ASSESSMENT
        </div>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          MOCK INTERVIEW MODE
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Simulate timed technical interview sessions without hints or solutions.
        </p>
      </div>
      {!sessionActive && !sessionFinished ? (
        
        <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.75rem', maxWidth: '640px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            SESSION CONFIGURATION
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Session Duration
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${durationMinutes === mins ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      background: durationMinutes === mins ? 'var(--accent-subtle)' : 'var(--bg-base)',
                      color: durationMinutes === mins ? 'var(--accent-primary)' : 'var(--text-primary)',
                      fontWeight: durationMinutes === mins ? 700 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {mins} MIN
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Problem Difficulty / Selection
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
                {(['Easy', 'Medium', 'Hard', 'RANDOM', 'WEAK'] as const).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDiff(d as any)}
                    style={{
                      padding: '0.5rem',
                      fontSize: '0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${selectedDiff === d ? 'var(--border-focus)' : 'var(--border-subtle)'}`,
                      background: selectedDiff === d ? 'var(--bg-elevated)' : 'var(--bg-base)',
                      color: 'var(--text-primary)',
                      fontWeight: selectedDiff === d ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={startInterview}
              className="btn btn-primary"
              style={{ padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.5rem' }}
            >
              <Play size={16} /> START MOCK INTERVIEW
            </button>
          </div>
        </div>
      ) : sessionActive ? (
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ background: 'var(--bg-surface)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={20} color="var(--status-warning)" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>COUNTDOWN TIMER</div>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--status-warning)' }}>
                  {formatTimer(remainingSeconds)}
                </div>
              </div>
            </div>
            <button onClick={finishInterview} className="btn btn-sm" style={{ color: 'var(--status-danger)', borderColor: 'rgba(232, 131, 131, 0.4)' }}>
              <Square size={13} /> END SESSION
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockProblems.map(prob => {
              const isSolved = completedIds.includes(prob.id);
              const isFailed = failedIds.includes(prob.id);
              return (
                <div key={prob.id} className="card" style={{ background: 'var(--bg-elevated)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>#{prob.id}</span>
                        <span className={`badge badge-${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{prob.topic}</span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{prob.title}</h3>
                    </div>
                    <a href={prob.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ color: 'var(--accent-primary)' }}>
                      LEETCODE <ExternalLink size={12} />
                    </a>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <button
                      onClick={() => toggleSolve(prob.id)}
                      className="btn btn-sm"
                      style={{
                        background: isSolved ? 'var(--status-success)' : 'var(--bg-base)',
                        color: isSolved ? '#0B0D0F' : 'var(--text-primary)',
                        borderColor: isSolved ? 'var(--status-success)' : 'var(--border-subtle)',
                      }}
                    >
                      <CheckCircle2 size={13} /> {isSolved ? 'SOLVED' : 'MARK SOLVED'}
                    </button>
                    <button
                      onClick={() => toggleFail(prob.id)}
                      className="btn btn-sm"
                      style={{
                        background: isFailed ? 'var(--status-danger-bg)' : 'var(--bg-base)',
                        color: isFailed ? 'var(--status-danger)' : 'var(--text-primary)',
                        borderColor: isFailed ? 'var(--status-danger)' : 'var(--border-subtle)',
                      }}
                    >
                      <XCircle size={13} /> {isFailed ? 'FAILED' : 'MARK FAILED'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        
        <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.75rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
            SESSION PERFORMANCE ANALYSIS
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>TIME ELAPSED</div>
              <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 600 }}>
                {formatTimer(durationMinutes * 60 - remainingSeconds)}
              </div>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>COMPLETED</div>
              <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--status-success)' }}>
                {completedIds.length} / {mockProblems.length}
              </div>
            </div>
          </div>
          <button onClick={() => setSessionFinished(false)} className="btn btn-primary" style={{ width: '100%', padding: '0.65rem' }}>
            START NEW SESSION
          </button>
        </div>
      )}
    </div>
  );
};