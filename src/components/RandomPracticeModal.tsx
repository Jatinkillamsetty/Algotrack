import React from 'react';
import { Problem } from '../types';
import { Shuffle, Zap, AlertTriangle, RotateCcw } from 'lucide-react';
interface RandomPracticeModalProps {
  problems: Problem[];
  onClose: () => void;
  onSelectProblem: (problem: Problem) => void;
  weakTopicName?: string;
}
export const RandomPracticeModal: React.FC<RandomPracticeModalProps> = ({
  problems,
  onClose,
  onSelectProblem,
  weakTopicName,
}) => {
  const pickRandom = (filterFn: (p: Problem) => boolean) => {
    const candidates = problems.filter(filterFn);
    if (candidates.length === 0) {
      alert('No matching problems found for this filter.');
      return;
    }
    const randomIndex = Math.floor(Math.random() * candidates.length);
    onSelectProblem(candidates[randomIndex]);
    onClose();
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shuffle size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>RANDOM PRACTICE DRILL</h2>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            onClick={() => pickRandom(p => p.difficulty === 'Easy')}
            className="btn"
            style={{ padding: '0.75rem', justifyContent: 'flex-start' }}
          >
            <span className="badge badge-easy">EASY</span> Random Easy Problem
          </button>
          <button
            onClick={() => pickRandom(p => p.difficulty === 'Medium')}
            className="btn"
            style={{ padding: '0.75rem', justifyContent: 'flex-start' }}
          >
            <span className="badge badge-medium">MEDIUM</span> Random Medium Problem
          </button>
          <button
            onClick={() => pickRandom(p => p.difficulty === 'Hard')}
            className="btn"
            style={{ padding: '0.75rem', justifyContent: 'flex-start' }}
          >
            <span className="badge badge-hard">HARD</span> Random Hard Challenge
          </button>
          {weakTopicName && (
            <button
              onClick={() => pickRandom(p => p.topic === weakTopicName)}
              className="btn"
              style={{ padding: '0.75rem', justifyContent: 'flex-start', color: 'var(--status-danger)', borderColor: 'rgba(232, 131, 131, 0.4)' }}
            >
              <AlertTriangle size={14} /> Weak Topic: {weakTopicName}
            </button>
          )}
          <button
            onClick={() => pickRandom(p => p.status === 'FAILED' || p.confidence === 'Weak')}
            className="btn"
            style={{ padding: '0.75rem', justifyContent: 'flex-start' }}
          >
            <RotateCcw size={14} /> Previously Failed / Low Confidence
          </button>
        </div>
      </div>
    </div>
  );
};