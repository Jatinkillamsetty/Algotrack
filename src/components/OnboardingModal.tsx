import React, { useState } from 'react';
import { UserPlan } from '../types';
import { Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
interface OnboardingModalProps {
  plan: UserPlan;
  totalProblemsCount: number;
  onSavePlan: (updatedPlan: UserPlan) => void;
  onClose?: () => void;
  isInitialSetup?: boolean;
}
export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  plan,
  totalProblemsCount,
  onSavePlan,
  onClose,
  isInitialSetup = false,
}) => {
  const [step, setStep] = useState<'welcome' | 'setup'>(isInitialSetup ? 'welcome' : 'setup');
  
  const [startDate, setStartDate] = useState(plan.start_date || new Date().toISOString().split('T')[0]);
  
  const defaultTarget = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [targetDate, setTargetDate] = useState(plan.target_date || defaultTarget);
  const [daysPerWeek, setDaysPerWeek] = useState(plan.days_per_week || 7);
  
  const totalProblems = totalProblemsCount || 798;
  const start = new Date(startDate);
  const target = new Date(targetDate);
  const totalDays = Math.max(1, Math.ceil((target.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  const totalWeeks = Number((totalDays / 7).toFixed(1));
  const activeDaysRatio = daysPerWeek / 7;
  const activeDays = Math.max(1, Math.ceil(totalDays * activeDaysRatio));
  const problemsPerDay = Number((totalProblems / activeDays).toFixed(1));
  const problemsPerWeek = Number((problemsPerDay * daysPerWeek).toFixed(1));
  const handleComplete = () => {
    onSavePlan({
      ...plan,
      total_problems: totalProblems,
      start_date: startDate,
      target_date: targetDate,
      days_per_week: daysPerWeek,
      daily_target: Math.ceil(problemsPerDay),
      is_onboarded: true,
    });
    if (onClose) onClose();
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', padding: '2rem' }}>
        {step === 'welcome' ? (
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em' }}>
              DSA RUN
            </div>
            
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.75rem 0 0.5rem 0', lineHeight: 1.2 }}>
              798 problems.<br />
              6 months.<br />
              One system.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              A personal training command center built to answer one critical question every day: <em>"What LeetCode problems should I solve today?"</em>
            </p>
            <button
              onClick={() => setStep('setup')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
            >
              START YOUR RUN <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Run Configuration</h2>
              {!isInitialSetup && onClose && (
                <button onClick={onClose} className="btn btn-sm" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              
              <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Problems</span>
                <span className="mono" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent-primary)' }}>{totalProblems}</span>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Start Date
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} color="var(--text-tertiary)" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Target Date (6 Months Recommended)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} color="var(--text-tertiary)" />
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="input"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Active Days Per Week
                </label>
                <select
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(parseInt(e.target.value, 10))}
                  className="input"
                  style={{ width: '100%' }}
                >
                  <option value={7}>7 days / week (Intense Daily Run)</option>
                  <option value={6}>6 days / week (1 Rest Day)</option>
                  <option value={5}>5 days / week (Weekday Focus)</option>
                </select>
              </div>
              
              <div style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginTop: '0.5rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>TOTAL DURATION</div>
                  <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{totalDays} days ({totalWeeks} wks)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>DAILY TARGET</div>
                  <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                    {problemsPerDay} / day
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>WEEKLY TARGET</div>
                  <div className="mono" style={{ fontSize: '1rem', fontWeight: 500 }}>{problemsPerWeek} / week</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>ESTIMATED FINISH</div>
                  <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{targetDate}</div>
                </div>
              </div>
              <button
                onClick={handleComplete}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem', marginTop: '0.5rem' }}
              >
                <CheckCircle2 size={16} /> SAVE CONFIGURATION & BEGIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};