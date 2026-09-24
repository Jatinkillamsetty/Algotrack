import React, { useState } from 'react';
import { Problem, Difficulty, ProblemStatus } from '../types';
import { CANONICAL_TOPICS } from '../services/topicMapper';
import { Search, Upload, ExternalLink, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { parseCsvToProblems } from '../services/storage';
interface ProblemsListViewProps {
  problems: Problem[];
  onOpenProblem: (problem: Problem) => void;
  onImportProblems: (newProblems: Problem[]) => void;
  onUpdateTopic: (problemId: number, newTopic: string) => void;
}
export const ProblemsListView: React.FC<ProblemsListViewProps> = ({
  problems,
  onOpenProblem,
  onImportProblems,
  onUpdateTopic,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiff, setSelectedDiff] = useState<Difficulty | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<ProblemStatus | 'ALL'>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(50); 
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  
  const filtered = problems.filter(p => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchId = p.id.toString().includes(q) || p.leetcode_id.toString().includes(q);
      if (!matchTitle && !matchId) return false;
    }
    if (selectedDiff !== 'ALL' && p.difficulty !== selectedDiff) return false;
    if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
    if (selectedTopic !== 'ALL' && p.topic !== selectedTopic) return false;
    return true;
  });
  
  const effectivePageSize = pageSize === 0 ? filtered.length : pageSize;
  const totalPages = Math.max(1, Math.ceil(filtered.length / (effectivePageSize || 1)));
  const paginatedProblems = filtered.slice((currentPage - 1) * effectivePageSize, currentPage * effectivePageSize);
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        const parsed = parseCsvToProblems(text);
        if (parsed.length > 0) {
          onImportProblems(parsed);
          alert(`Successfully imported ${parsed.length} problems from CSV!`);
        } else {
          alert('Failed to parse problems from the uploaded CSV file.');
        }
      }
    };
    reader.readAsText(file);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      <div className="card" style={{ background: 'var(--bg-surface)', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.05em' }}>
              DATA ENGINE
            </div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0.1rem 0' }}>
              PROBLEM CATALOG ({problems.length} TOTAL)
            </h1>
          </div>
          
          <label className="btn btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Upload size={14} /> IMPORT CUSTOM CSV
            <input type="file" accept=".csv" onChange={handleCsvUpload} style={{ display: 'none' }} />
          </label>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
          
          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by title or #..."
              className="input"
              style={{ paddingLeft: '2rem', width: '100%' }}
            />
          </div>
          
          <select value={selectedDiff} onChange={e => { setSelectedDiff(e.target.value as any); setCurrentPage(1); }} className="input">
            <option value="ALL">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          
          <select value={selectedStatus} onChange={e => { setSelectedStatus(e.target.value as any); setCurrentPage(1); }} className="input">
            <option value="ALL">Status: All</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="SOLVED">Solved</option>
            <option value="FAILED">Failed</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
            <option value="MASTERED">Mastered</option>
          </select>
          
          <select value={selectedTopic} onChange={e => { setSelectedTopic(e.target.value); setCurrentPage(1); }} className="input">
            <option value="ALL">Topic: All ({CANONICAL_TOPICS.length})</option>
            {CANONICAL_TOPICS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          
          <select value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value, 10)); setCurrentPage(1); }} className="input">
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
            <option value={0}>Show All ({filtered.length})</option>
          </select>
        </div>
      </div>
      
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          <span>MATCHING: {filtered.length} PROBLEMS</span>
          <span>CLICK TITLE OR STATUS TO LOG PERFORMANCE</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="cmd-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>TITLE</th>
                <th style={{ width: '100px' }}>DIFFICULTY</th>
                <th style={{ width: '180px' }}>TOPIC</th>
                <th style={{ width: '90px' }}>FREQ %</th>
                <th style={{ width: '90px' }}>ACC %</th>
                <th style={{ width: '120px' }}>STATUS</th>
                <th style={{ width: '130px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.map(prob => {
                const isSolved = prob.status === 'SOLVED' || prob.status === 'MASTERED';
                const isFailed = prob.status === 'FAILED';
                return (
                  <tr key={prob.id}>
                    <td className="mono" style={{ color: 'var(--text-tertiary)' }}>
                      #{prob.id}
                    </td>
                    <td>
                      <span
                        onClick={() => onOpenProblem(prob)}
                        style={{
                          fontWeight: 600,
                          color: isSolved ? 'var(--text-secondary)' : 'var(--text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        {prob.title}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${prob.difficulty.toLowerCase()}`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td>
                      {editingTopicId === prob.id ? (
                        <select
                          value={prob.topic}
                          onChange={e => {
                            onUpdateTopic(prob.id, e.target.value);
                            setEditingTopicId(null);
                          }}
                          onBlur={() => setEditingTopicId(null)}
                          autoFocus
                          className="input"
                          style={{ fontSize: '0.75rem', padding: '0.15rem' }}
                        >
                          {CANONICAL_TOPICS.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      ) : (
                        <span
                          onClick={() => setEditingTopicId(prob.id)}
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            background: 'var(--bg-base)',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                          }}
                          title="Click to change topic"
                        >
                          {prob.topic}
                        </span>
                      )}
                    </td>
                    <td className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {prob.frequency}%
                    </td>
                    <td className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {prob.acceptance_rate}%
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                        color: isSolved ? 'var(--status-success)' : isFailed ? 'var(--status-danger)' : 'var(--text-tertiary)',
                      }}>
                        {prob.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <a
                        href={prob.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm"
                        style={{ padding: '0.25rem 0.5rem', color: 'var(--accent-primary)' }}
                      >
                        LEETCODE <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {pageSize > 0 && totalPages > 1 && (
          <div style={{
            padding: '0.85rem 1.25rem',
            background: 'var(--bg-elevated)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
          }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="btn btn-sm"
              style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={14} /> PREVIOUS
            </button>
            <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Page <strong style={{ color: 'var(--text-primary)' }}>{currentPage}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong> ({filtered.length} problems total)
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="btn btn-sm"
              style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
            >
              NEXT <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};