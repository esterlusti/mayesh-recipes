import React from 'react';

export default function GenderSelect({ onSelect }) {
  return (
    <div className="modal-overlay">
      <div className="gender-card">
        <h2 className="playfair gender-title">רגע לפני שמתחילים...</h2>
        <p className="gender-sub">מה התפקיד שלך במטבח?</p>
        <div className="gender-options">
          <div className="gender-option" onClick={() => onSelect('male')}>
            <span className="gender-emoji">👨‍🍳</span>
            <span className="playfair gender-label">שף</span>
          </div>
          <div className="gender-option" onClick={() => onSelect('female')}>
            <span className="gender-emoji">👩‍🍳</span>
            <span className="playfair gender-label">שפית</span>
          </div>
        </div>
      </div>
    </div>
  );
}
