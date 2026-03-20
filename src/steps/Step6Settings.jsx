import React, { useState } from 'react';

export default function Step6Settings({ onGenerate, useGenderText }) {
  const [servings, setServings]       = useState(4);
  const [recipeIdea, setRecipeIdea]   = useState('');
  const [difficulty, setDifficulty]   = useState('easy');
  const [maxMinutes, setMaxMinutes]   = useState('');
  const [recipeStyle, setRecipeStyle] = useState('classic');

  const generateText = useGenderText('צור לי מתכון ✦', 'צרי לי מתכון ✦');

  const handleGenerate = () => {
    onGenerate({ servings, recipeIdea, difficulty, recipeStyle, maxMinutes: maxMinutes ? parseInt(maxMinutes) : null });
  };

  return (
    <div className="step-card">
      <h2 className="playfair step-title">הגדרות מתכון</h2>
      <p className="step-sub">התאימו את המתכון לצרכים שלכם</p>

      {/* Recipe idea */}
      <div className="ing-idea-card" style={{ marginTop: 8, marginBottom: 14 }}>
        <span className="ing-idea-label">יש לכם רעיון? (אופציונלי)</span>
        <textarea
          placeholder="למשל: משהו בסגנון אסייתי, עוגה לשבת..."
          rows={2}
          value={recipeIdea}
          onChange={e => setRecipeIdea(e.target.value)}
          maxLength={200}
        />
      </div>

      {/* Settings */}
      <div className="ing-settings-card">
        <div className="ing-settings-row">
          <div className="ing-setting-group">
            <span className="ing-setting-label">סגנון</span>
            <div className="difficulty-row">
              {[
                { key: 'classic', label: 'קלאסי' },
                { key: 'special', label: 'מיוחד' },
              ].map(d => (
                <div key={d.key} className={`difficulty-chip ${recipeStyle === d.key ? 'on' : ''}`} onClick={() => setRecipeStyle(d.key)}>
                  {d.label}
                </div>
              ))}
            </div>
          </div>

          <div className="ing-setting-group">
            <span className="ing-setting-label">קושי</span>
            <div className="difficulty-row">
              {[
                { key: 'easy',   label: 'קל'    },
                { key: 'medium', label: 'בינוני'},
                { key: 'hard',   label: 'מאתגר' },
              ].map(d => (
                <div key={d.key} className={`difficulty-chip ${difficulty === d.key ? 'on' : ''}`} onClick={() => setDifficulty(d.key)}>
                  {d.label}
                </div>
              ))}
            </div>
          </div>

          <div className="ing-setting-group">
            <span className="ing-setting-label">זמן מקסימלי (דקות)</span>
            <div className="time-row">
              <input type="number" min="10" max="240" step="5" placeholder="—" value={maxMinutes} onChange={e => setMaxMinutes(e.target.value)} />
              <span>דק'</span>
            </div>
          </div>

          <div className="ing-setting-group">
            <span className="ing-setting-label">מנות</span>
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
      </div>

      <button className="btn btn-generate" onClick={handleGenerate}>
        {generateText}
      </button>
    </div>
  );
}
