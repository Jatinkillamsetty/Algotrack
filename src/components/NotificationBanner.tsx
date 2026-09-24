import React, { useState } from 'react';
import { UserPlan } from '../types';
import { Bell, Clock, Check, X } from 'lucide-react';
interface NotificationBannerProps {
  plan: UserPlan;
  remainingTodayCount: number;
  delta: number;
  onSaveReminders: (updatedReminders: UserPlan['reminders']) => void;
  onClose: () => void;
}
export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  plan,
  remainingTodayCount,
  delta,
  onSaveReminders,
  onClose,
}) => {
  const [morningTime, setMorningTime] = useState(plan.reminders.morning_time || '08:00');
  const [eveningTime, setEveningTime] = useState(plan.reminders.evening_time || '20:00');
  const [enabled, setEnabled] = useState(plan.reminders.enabled ?? true);
  const handleSave = () => {
    onSaveReminders({
      morning_time: morningTime,
      evening_time: eveningTime,
      enabled,
    });
    onClose();
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>REMINDER CONFIGURATION</h2>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--bg-base)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>MORNING NOTIFICATION ({morningTime})</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              "Your DSA Run is ready. 5 problems scheduled for today."
            </div>
          </div>
          <div style={{ background: 'var(--bg-base)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>EVENING NOTIFICATION ({eveningTime})</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {remainingTodayCount > 0
                ? `"You have ${remainingTodayCount} problem${remainingTodayCount > 1 ? 's' : ''} remaining today."`
                : delta < 0
                ? `"You're currently ${Math.abs(delta)} problems behind schedule."`
                : `"Today's Run completed! Excellent discipline."`}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
            />
            Enable Daily Run Reminders
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Morning Time
              </label>
              <input
                type="time"
                value={morningTime}
                onChange={e => setMorningTime(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Evening Time
              </label>
              <input
                type="time"
                value={eveningTime}
                onChange={e => setEveningTime(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <button onClick={handleSave} className="btn btn-primary" style={{ padding: '0.65rem', marginTop: '0.5rem' }}>
            <Check size={14} /> SAVE REMINDER SETTINGS
          </button>
        </div>
      </div>
    </div>
  );
};