import React, { useState } from 'react';

export default function Step4DishType({ category, onSelect }) {
  const [showInput, setShowInput] = useState(false);
  const [customDish, setCustomDish] = useState('');

  if (!category || !category.dishes) return null;

  const handleCustomSubmit = () => {
    const val = customDish.trim();
    if (val) onSelect(val);
  };

  return (
    <div className="step-card">
      <h2 className="playfair step-title">{category.emoji} {category.name}</h2>
      <p className="step-sub">איזה מנה?</p>

      <div className="dish-grid">
        {category.dishes.map(dish => (
          <div
            key={dish}
            className="dish-chip"
            onClick={() => onSelect(dish)}
          >
            {dish}
          </div>
        ))}

        {!showInput && (
          <div className="dish-chip dish-chip-custom" onClick={() => setShowInput(true)}>
            + מנה אחרת
          </div>
        )}
      </div>

      {showInput && (
        <div className="dish-custom-input-wrap">
          <input
            className="dish-custom-input"
            type="text"
            placeholder="הקלידי שם המנה..."
            value={customDish}
            onChange={e => setCustomDish(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCustomSubmit()}
            autoFocus
          />
          <button className="dish-custom-submit" onClick={handleCustomSubmit} disabled={!customDish.trim()}>
            המשך
          </button>
        </div>
      )}
    </div>
  );
}
