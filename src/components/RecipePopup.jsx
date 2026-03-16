import React from 'react';
import { X } from 'lucide-react';

function parseRecipe(text) {
  const lines = text.split('\n');
  let title = '', timePrep = '', timeCook = '', diff = '', tip = '', serving = '';
  const ingredients = [];
  const steps = [];
  let section = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('TITLE:')) { title = trimmed.replace('TITLE:', '').trim(); continue; }
    if (trimmed.startsWith('TIME_PREP:')) { timePrep = trimmed.replace('TIME_PREP:', '').trim(); continue; }
    if (trimmed.startsWith('TIME_COOK:')) { timeCook = trimmed.replace('TIME_COOK:', '').trim(); continue; }
    if (trimmed.startsWith('DIFFICULTY:')) { diff = trimmed.replace('DIFFICULTY:', '').trim(); continue; }
    if (trimmed.startsWith('SERVING:')) { serving = trimmed.replace('SERVING:', '').trim(); continue; }
    if (trimmed.startsWith('TIP:')) { tip = trimmed.replace('TIP:', '').trim(); continue; }
    if (trimmed === 'INGREDIENTS:') { section = 'ing'; continue; }
    if (trimmed === 'STEPS:') { section = 'steps'; continue; }
    if (section === 'ing' && trimmed) {
      ingredients.push(trimmed.replace(/^[-•*]\s*/, ''));
    }
    if (section === 'steps' && trimmed) {
      steps.push(trimmed.replace(/^\d+[.)]\s*/, ''));
    }
  }
  return { title, timePrep, timeCook, difficulty: diff, ingredients, steps, serving, tip };
}

export default function RecipePopup({ recipe, onClose }) {
  if (!recipe) return null;

  const kosherEmoji = recipe.kosher === 'meat' ? '🔴' : recipe.kosher === 'dairy' ? '🔵' : '🟢';
  const kosherLabel = recipe.kosher === 'meat' ? 'בשרי' : recipe.kosher === 'dairy' ? 'חלבי' : 'פרווה';

  if (!recipe.fullText) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card recipe-popup-card" onClick={e => e.stopPropagation()}>
          <button className="recipe-popup-close" onClick={onClose}><X size={18} /></button>
          <h2 className="playfair recipe-popup-title">{recipe.title || 'מתכון'}</h2>
          <p className="recipe-popup-empty">טקסט המתכון לא נשמר</p>
        </div>
      </div>
    );
  }

  const parsed = parseRecipe(recipe.fullText);
  const displayTitle = parsed.title || recipe.title || 'מתכון';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card recipe-popup-card" onClick={e => e.stopPropagation()}>
        <button className="recipe-popup-close" onClick={onClose}><X size={18} /></button>

        <div className="recipe-popup-header">
          <h2 className="playfair recipe-popup-title">{displayTitle}</h2>
          <div className="recipe-popup-badges">
            <span className="recipe-badge">{kosherEmoji} {kosherLabel}</span>
            {parsed.timePrep && <span className="recipe-badge">הכנה: {parsed.timePrep}</span>}
            {parsed.timeCook && <span className="recipe-badge">בישול: {parsed.timeCook}</span>}
            {parsed.difficulty && <span className="recipe-badge">{parsed.difficulty}</span>}
          </div>
        </div>

        {parsed.ingredients.length > 0 && (
          <div className="recipe-popup-section">
            <h3>מרכיבים</h3>
            <ul className="recipe-popup-ingredients">
              {parsed.ingredients.map((ing, i) => (
                <li key={i}><span className="ing-dot" /> {ing}</li>
              ))}
            </ul>
          </div>
        )}

        {parsed.steps.length > 0 && (
          <div className="recipe-popup-section">
            <h3>שלבי הכנה</h3>
            <ol className="recipe-popup-steps">
              {parsed.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {parsed.serving && (
          <div className="recipe-popup-tip serving">
            <strong>🍽️ הצעת הגשה:</strong> {parsed.serving}
          </div>
        )}

        {parsed.tip && (
          <div className="recipe-popup-tip">
            <strong>💡 טיפ:</strong> {parsed.tip}
          </div>
        )}
      </div>
    </div>
  );
}
