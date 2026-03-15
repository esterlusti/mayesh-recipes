import React from 'react';

const STEP_LABELS = ['סוג מנה', 'ציוד', 'קטגוריה', 'מנה', 'מרכיבים', 'מתכון'];

export default function ProgressBar({ current, total = 6 }) {
  return (
    <div className="progress-bar-wrap">
      <div className="progress-segments">
        {STEP_LABELS.map((label, i) => (
          <div
            key={i}
            className={`progress-seg ${i + 1 < current ? 'done' : ''} ${i + 1 === current ? 'active' : ''}`}
            title={label}
          />
        ))}
      </div>
      <div className="progress-step-label">{STEP_LABELS[current - 1]}</div>
    </div>
  );
}
