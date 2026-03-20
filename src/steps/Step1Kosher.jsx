import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/icons';

const KOSHER_OPTIONS = [
  { id: 'meat',   name: 'בשרי', iconKey: 'meat',   color: 'var(--meat)',   bg: 'var(--meat-lt)',   desc: 'בשר, עוף, הודו' },
  { id: 'dairy',  name: 'חלבי', iconKey: 'dairy',  color: 'var(--milk)',   bg: 'var(--milk-lt)',   desc: 'גבינות, חלב, שמנת' },
  { id: 'pareve', name: 'פרווה',iconKey: 'pareve', color: 'var(--pareve)', bg: 'var(--pareve-lt)', desc: 'דגים, ירקות, קטניות' },
];

export default function Step1Kosher({ onSelect, onQuickMode }) {
  const [selected, setSelected] = useState(null);
  const [pareveEquip, setPareveEquip] = useState(null);
  const actionsRef = useRef(null);

  const handleSelect = (id) => {
    setSelected(id);
    setPareveEquip(null);
  };

  const handlePareveEquip = (type) => {
    setPareveEquip(type);
  };

  const isReady = selected && (selected !== 'pareve' || pareveEquip);

  useEffect(() => {
    if (isReady && actionsRef.current) {
      actionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isReady]);

  const handleContinue = () => {
    onSelect(selected, selected === 'pareve' ? pareveEquip : null);
  };

  const handleQuick = () => {
    onQuickMode(selected, selected === 'pareve' ? pareveEquip : null);
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
              <Icon name={opt.iconKey} size={28} className="kosher-icon" />
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

      {isReady && (
        <div className="kosher-actions animate-in" ref={actionsRef}>
          <button className="btn btn-next" onClick={handleContinue}>
            המשיכו לבחירה מלאה →
          </button>
          <button className="btn btn-quick" onClick={handleQuick}>
            ⚡ מצב מהיר
          </button>
        </div>
      )}
    </div>
  );
}
