import React from 'react';

const STEP_LABELS = ['כשרות', 'ציוד', 'קטגוריה', 'סוג מנה', 'מרכיבים', 'מתכון'];

export default function ProgressBar({ current, total = 6 }) {
  return (
    <div className="progress-bar-wrap">
      <div className="progress-steps">
        {STEP_LABELS.map((label, i) => (
          <div
            key={i}
            className={`progress-step ${i + 1 <= current ? 'done' : ''} ${i + 1 === current ? 'active' : ''}`}
          >
            <div className="progress-dot">{i + 1}</div>
            <span className="progress-label">{label}</span>
          </div>
        ))}
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
