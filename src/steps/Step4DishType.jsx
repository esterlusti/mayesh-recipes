import React from 'react';

export default function Step4DishType({ category, onSelect }) {
  if (!category || !category.dishes) return null;

  return (
    <div className="step-card">
      <h2 className="playfair step-title">{category.emoji} {category.name}</h2>
      <p className="step-sub">בחרו סוג מנה ספציפי</p>

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
      </div>
    </div>
  );
}
