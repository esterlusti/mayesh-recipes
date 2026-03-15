import React, { useState } from 'react';

const KOSHER_OPTIONS = [
  { id: 'meat',   name: 'בשרי', emoji: '🥩', color: 'var(--meat)',   bg: 'var(--meat-lt)',   desc: 'בשר, עוף, הודו' },
  { id: 'dairy',  name: 'חלבי', emoji: '🧀', color: 'var(--milk)',   bg: 'var(--milk-lt)',   desc: 'גבינות, חלב, שמנת' },
  { id: 'pareve', name: 'פרווה',emoji: '🌿', color: 'var(--pareve)', bg: 'var(--pareve-lt)', desc: 'דגים, ירקות, קטניות' },
];

export default function Step1Kosher({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const [pareveEquip, setPareveEquip] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
    if (id !== 'pareve') onSelect(id, null);
  };

  const handlePareveEquip = (type) => {
    setPareveEquip(type);
    onSelect('pareve', type);
  };

  return (
    <div className="step-card">
      <h2 className="playfair step-title">קטגוריה</h2>
      <p className="step-sub">בחרו את הקטגוריה של המנה</p>

      <div className="kosher-grid">
        {KOSHER_OPTIONS.map((opt, index) => (
          <div
            key={opt.id}
            className={`kosher-card ${selected === opt.id ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.id)}
            style={{ '--i': index }}
          >
            <div className="kosher-circle" style={{ background: opt.color }}>
              <span className="kosher-emoji">{opt.emoji}</span>
            </div>
            <h3 className="playfair kosher-name">{opt.name}</h3>
            <p className="kosher-desc">{opt.desc}</p>
          </div>
        ))}
      </div>

      {selected === 'pareve' && (
        <div className="pareve-sub animate-in">
          <p className="pareve-question">באילו כלים תרצו להשתמש?</p>
          <div className="pareve-options">
            <button
              className={`pareve-btn ${pareveEquip === 'meat' ? 'active' : ''}`}
              onClick={() => handlePareveEquip('meat')}
            >
              כלים בשריים
            </button>
            <button
              className={`pareve-btn ${pareveEquip === 'dairy' ? 'active' : ''}`}
              onClick={() => handlePareveEquip('dairy')}
            >
              כלים חלביים
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
