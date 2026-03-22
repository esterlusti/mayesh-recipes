import React, { useState } from 'react';

export default function StepQuick({ onGenerate, useGenderText }) {
  const [ingredients, setIngredients] = useState('');
  const [idea, setIdea] = useState('');
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState('easy');

  const generateText = useGenderText('צור לי מתכון ✦', 'צרי לי מתכון ✦');

  const handleGenerate = () => {
    const combined = [
      ingredients.trim() ? `יש לי בבית: ${ingredients.trim()}` : '',
      idea.trim() ? idea.trim() : ''
    ].filter(Boolean).join('. ');

    onGenerate({
      recipeIdea: combined,
      servings,
      difficulty,
      proteins: [], carbs: [], sauces: [], vegetables: [], spices: [],
      customProteins: [], customCarbs: [], customVegetables: [], customSauces: [], customSpices: [],
      recipeStyle: 'classic',
      maxMinutes: null
    });
  };

  const canGenerate = ingredients.trim() || idea.trim();

  return (
    <div className="step-card quick-step">
      <h2 className="playfair step-title">מצב מהיר</h2>
      <p className="step-sub">ספרו לנו מה יש לכם ומה בא לכם</p>

      <div className="quick-section">
        <label className="quick-section-label">מה יש לכם בבית?</label>
        <textarea
          className="quick-textarea"
          placeholder="למשל: חזה עוף, אורז, בצל, שום, רוטב סויה..."
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          maxLength={300}
          rows={2}
          autoFocus
        />
      </div>

      <div className="quick-section">
        <label className="quick-section-label">מה תרצו להכין?</label>
        <textarea
          className="quick-textarea"
          placeholder="למשל: פסטה בולונז, שקשוקה, משהו אסייתי, ארוחה קלה..."
          value={idea}
          onChange={e => setIdea(e.target.value)}
          maxLength={200}
          rows={2}
        />
      </div>

      <div className="quick-settings">
        <div className="quick-setting-group">
          <span className="quick-setting-label">קושי</span>
          <div className="difficulty-row">
            {[
              { key: 'easy',   label: 'קל' },
              { key: 'medium', label: 'בינוני' },
              { key: 'hard',   label: 'מאתגר' },
            ].map(d => (
              <div key={d.key} className={`difficulty-chip ${difficulty === d.key ? 'on' : ''}`} onClick={() => setDifficulty(d.key)}>
                {d.label}
              </div>
            ))}
          </div>
        </div>

        <div className="quick-setting-group">
          <span className="quick-setting-label">מנות</span>
          <div className="servings-row">
            <button className="servings-btn" onClick={() => setServings(Math.max(1, servings - 1))}>−</button>
            <input
              type="number"
              min="1"
              max="200"
              className="servings-input"
              value={servings}
              onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 1 && v <= 200) setServings(v); }}
            />
            <button className="servings-btn" onClick={() => setServings(servings + 1)}>+</button>
          </div>
        </div>
      </div>

      <button className="btn btn-generate" onClick={handleGenerate} disabled={!canGenerate}>
        {generateText}
      </button>
    </div>
  );
}
