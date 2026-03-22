import React from 'react';

const STEP_LABELS = ['סוג מנה', 'ציוד', 'קטגוריה', 'מנה', 'מרכיבים', 'הגדרות'];

export default function ProgressBar({ current, total = 6 }) {
  return (
    <div className="progress-bar-wrap" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total} aria-label={`שלב ${current} מתוך ${total}: ${STEP_LABELS[current - 1]}`}>
      <div className="progress-segments">
        {STEP_LABELS.map((label, i) => (
          <div
            key={i}
            className={`progress-seg ${i + 1 < current ? 'done' : ''} ${i + 1 === current ? 'active' : ''}`}
            title={label}
          />
        ))}
      </div>
      <div className="progress-step-label">
        <span className="progress-step-num">{current} / {total}</span>
        <span className="progress-step-name">{STEP_LABELS[current - 1]}</span>
      </div>
    </div>
  );
}
