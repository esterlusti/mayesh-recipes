import React, { useState } from 'react';
import { EQUIPMENT } from '../data/equipment';
import Icon from '../components/icons';

export default function Step2Equipment({ kosherType, pareveEquipType, equipment, setEquipment, onNext, useGenderText, preloadedFromProfile }) {
  const effectiveType = kosherType === 'pareve' ? pareveEquipType : kosherType;
  const nextText = useGenderText('המשך', 'המשיכי');
  const [editMode, setEditMode] = useState(!preloadedFromProfile);

  const typeEquipment = EQUIPMENT[effectiveType] || [];
  const generalEquipment = EQUIPMENT.general;
  const allEquipment = [...typeEquipment, ...generalEquipment];

  const toggle = (id) => {
    setEquipment(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedLabels = equipment
    .map(id => allEquipment.find(e => e.id === id)?.label)
    .filter(Boolean);

  if (!editMode) {
    return (
      <div className="step-card">
        <h2 className="playfair step-title">ציוד המטבח</h2>
        <p className="step-sub">הציוד שמור מהפרופיל שלך</p>
        <div className="equip-chips" style={{ marginBottom: 16 }}>
          {selectedLabels.map(label => (
            <div key={label} className="chip on">{label}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-next" onClick={onNext}>
            {nextText} →
          </button>
          <button className="btn btn-back" style={{ flex: 'none' }} onClick={() => setEditMode(true)}>
            שנה ציוד
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-card">
      <h2 className="playfair step-title">ציוד המטבח</h2>
      <p className="step-sub">סמנו את הציוד הזמין</p>

      <div className="equip-section">
        <h3 className="equip-section-title">
          {effectiveType === 'meat' ? 'כלים בשריים' : 'כלים חלביים'}
        </h3>
        <div className="equip-chips">
          {typeEquipment.map(eq => (
            <div
              key={eq.id}
              className={`chip ${equipment.includes(eq.id) ? 'on' : ''}`}
              onClick={() => toggle(eq.id)}
            >
              <Icon name={eq.iconKey} size={16} className="chip-icon" />
              {eq.label}
            </div>
          ))}
        </div>
      </div>

      <div className="equip-section">
        <h3 className="equip-section-title">ציוד כללי</h3>
        <div className="equip-chips">
          {generalEquipment.map(eq => (
            <div
              key={eq.id}
              className={`chip ${equipment.includes(eq.id) ? 'on' : ''}`}
              onClick={() => toggle(eq.id)}
            >
              <Icon name={eq.iconKey} size={16} className="chip-icon" />
              {eq.label}
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
