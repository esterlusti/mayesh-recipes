import React from 'react';
import { CATEGORIES } from '../data/categories';

export default function Step3Category({ kosherType, onSelect }) {
  const categories = CATEGORIES[kosherType] || [];

  const dotColor = kosherType === 'meat' ? 'var(--meat)' : kosherType === 'dairy' ? 'var(--milk)' : 'var(--pareve)';

  return (
    <div className="step-card">
      <h2 className="playfair step-title">סוג המנה</h2>
      <p className="step-sub">בחרו קטגוריה</p>

      <div className="category-grid">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => onSelect(cat)}
            style={{ '--i': index }}
          >
            <div className="category-dot" style={{ background: dotColor }} />
            <span className="category-emoji">{cat.emoji}</span>
            <h3 className="playfair category-name">{cat.name}</h3>
            <p className="category-desc">{cat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
