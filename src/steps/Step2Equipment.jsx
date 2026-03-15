import React from 'react';
import { EQUIPMENT } from '../data/equipment';

export default function Step2Equipment({ kosherType, pareveEquipType, equipment, setEquipment, onNext, useGenderText }) {
  const effectiveType = kosherType === 'pareve' ? pareveEquipType : kosherType;
  const nextText = useGenderText('המשך', 'המשיכי');

  const typeEquipment = EQUIPMENT[effectiveType] || [];
  const generalEquipment = EQUIPMENT.general;

  const toggle = (id) => {
    setEquipment(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="step-card">
      <h2 className="playfair step-title">🍳 מה יש לכם במטבח?</h2>
      <p className="step-sub">
        {effectiveType === 'meat' ? 'ציוד בשרי + כללי' : 'ציוד חלבי + כללי'}
      </p>

      <div className="equip-section">
        <h3 className="equip-section-title">
          {effectiveType === 'meat' ? '🥩 כלים בשריים' : '🧀 כלים חלביים'}
        </h3>
        <div className="equip-chips">
          {typeEquipment.map(eq => (
            <div
              key={eq.id}
              className={`chip ${equipment.includes(eq.id) ? 'on' : ''}`}
              onClick={() => toggle(eq.id)}
            >
              {eq.emoji} {eq.label}
            </div>
          ))}
        </div>
      </div>

      <div className="equip-section">
        <h3 className="equip-section-title">🔧 ציוד כללי</h3>
        <div className="equip-chips">
          {generalEquipment.map(eq => (
            <div
              key={eq.id}
              className={`chip ${equipment.includes(eq.id) ? 'on' : ''}`}
              onClick={() => toggle(eq.id)}
            >
              {eq.emoji} {eq.label}
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn btn-next"
        onClick={onNext}
        disabled={equipment.length === 0}
      >
        {nextText} →
      </button>
    </div>
  );
}
