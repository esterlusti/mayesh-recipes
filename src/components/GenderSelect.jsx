import React, { useRef } from 'react';
import { ChefHat } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function GenderSelect({ onSelect }) {
  const cardRef = useRef(null);
  useFocusTrap(cardRef, true);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="gender-title">
      <div className="gender-card" ref={cardRef}>
        <h2 id="gender-title" className="playfair gender-title">רגע אחד</h2>
        <p className="gender-sub">איך לפנות אליך?</p>
        <div className="gender-options">
          <div className="gender-option gender-option-male" onClick={() => onSelect('male')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onSelect('male')} aria-label="שף - פנייה בלשון זכר">
            <span className="gender-icon"><ChefHat size={44} strokeWidth={1.5} /></span>
            <span className="playfair gender-label">שף</span>
          </div>
          <div className="gender-option gender-option-female" onClick={() => onSelect('female')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onSelect('female')} aria-label="שפית - פנייה בלשון נקבה">
            <span className="gender-icon gender-icon-female"><ChefHat size={44} strokeWidth={1.5} /></span>
            <span className="playfair gender-label">שפית</span>
          </div>
        </div>
      </div>
    </div>
  );
}
