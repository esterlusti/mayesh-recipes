import React from 'react';
import { ChefHat } from 'lucide-react';

export default function GenderSelect({ onSelect }) {
  return (
    <div className="modal-overlay">
      <div className="gender-card">
        <h2 className="playfair gender-title">רגע אחד</h2>
        <p className="gender-sub">איך לפנות אליך?</p>
        <div className="gender-options">
          <div className="gender-option gender-option-male" onClick={() => onSelect('male')}>
            <span className="gender-icon"><ChefHat size={44} strokeWidth={1.5} /></span>
            <span className="playfair gender-label">שף</span>
          </div>
          <div className="gender-option gender-option-female" onClick={() => onSelect('female')}>
            <span className="gender-icon gender-icon-female"><ChefHat size={44} strokeWidth={1.5} /></span>
            <span className="playfair gender-label">שפית</span>
          </div>
        </div>
      </div>
    </div>
  );
}
