import React from 'react';

const KOSHER_LABELS = {
  meat: { label: 'בשרי', emoji: '🥩' },
  dairy: { label: 'חלבי', emoji: '🧀' },
  pareve: { label: 'פרווה', emoji: '🌿' },
};

export default function Breadcrumbs({ step, kosherType, equipment, category, dishType, goToStep }) {
  if (step < 2) return null;

  const crumbs = [];

  if (kosherType) {
    const k = KOSHER_LABELS[kosherType];
    crumbs.push({ label: `${k.emoji} ${k.label}`, step: 1 });
  }

  if (step > 2 && equipment?.length > 0) {
    crumbs.push({ label: `🍳 ${equipment.length} כלים`, step: 2 });
  }

  if (step > 3 && category) {
    crumbs.push({ label: `${category.emoji} ${category.name}`, step: 3 });
  }

  if (step > 4 && dishType) {
    crumbs.push({ label: dishType, step: 4 });
  }

  return (
    <div className="breadcrumbs">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.step}>
          {i > 0 && <span className="breadcrumb-sep">←</span>}
          <button className="breadcrumb-chip" onClick={() => goToStep(crumb.step)}>
            {crumb.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
