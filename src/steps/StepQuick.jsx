import React, { useState } from 'react';

export default function StepQuick({ onGenerate, useGenderText }) {
  const [text, setText] = useState('');
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState('medium');

  const generateText = useGenderText('צור לי מתכון ✦', 'צרי לי מתכון ✦');

  const handleGenerate = () => {
    onGenerate({
      recipeIdea: text,
      servings,
      difficulty,
      proteins: [], carbs: [], sauces: [], vegetables: [], spices: [],
      customProteins: [], customCarbs: [], customVegetables: [], customSauces: [], customSpices: [],
      recipeStyle: 'classic',
      maxMinutes: null
    });
  };

  return (
    <div className="step-card quick-step">
      <h2 className="playfair step-title">מצב מהיר ⚡</h2>
      <p className="step-sub">ספרו לנו מה בא לכם ונמציא מתכון</p>

      <textarea
        className="quick-textarea"
        placeholder="למשל: פסטה בולונז, שקשוקה, עוף בתנור עם ירקות, משהו אסייתי..."
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={200}
        rows={3}
        autoFocus
      />

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
              onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 1) setServings(v); }}
            />
            <button className="servings-btn" onClick={() => setServings(servings + 1)}>+</button>
          </div>
        </div>
      </div>

      <button className="btn btn-generate" onClick={handleGenerate} disabled={!text.trim()}>
        {generateText}
      </button>
    </div>
  );
}
