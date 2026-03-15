import React, { useState } from 'react';
import { PROTEINS, VEGETABLES, SPICES } from '../data/ingredients';
import { SAUCES } from '../data/sauces';

export default function Step5Ingredients({ kosherType, onGenerate, useGenderText }) {
  const [proteins, setProteins] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [spices, setSpices] = useState([]);
  const [extrasProteins, setExtrasProteins] = useState('');
  const [extrasSauces, setExtrasSauces] = useState('');
  const [extrasVegetables, setExtrasVegetables] = useState('');
  const [extrasSpices, setExtrasSpices] = useState('');
  const [servings, setServings] = useState(4);
  const [recipeIdea, setRecipeIdea] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [maxMinutes, setMaxMinutes] = useState('');

  const generateText = useGenderText('צור לי מתכון ✨', 'צרי לי מתכון ✨');

  const proteinList = PROTEINS[kosherType] || PROTEINS.pareve;

  const filteredSauces = SAUCES.filter(s => {
    if (s.kosher === 'all') return true;
    if (kosherType === 'meat' && s.kosher === 'dairy') return false;
    if (kosherType === 'dairy' && s.kosher === 'meat') return false;
    if (kosherType === 'pareve' && (s.kosher === 'meat' || s.kosher === 'dairy')) return false;
    return true;
  });

  const toggleItem = (list, setList, item) => {
    setList(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const handleGenerate = () => {
    onGenerate({
      proteins, sauces, vegetables, spices,
      extrasProteins, extrasSauces, extrasVegetables, extrasSpices,
      servings, recipeIdea, difficulty,
      maxMinutes: maxMinutes ? parseInt(maxMinutes) : null
    });
  };

  return (
    <div className="step-card ingredients-step">
      <h2 className="playfair step-title">🛒 מה יש לכם?</h2>
      <p className="step-sub">סמנו את המרכיבים הזמינים</p>

      {/* Proteins */}
      <div className="card ing-card">
        <h3 className="card-title">🥩 חלבונים / בסיס</h3>
        <div className="chip-grid">
          {proteinList.map((p, index) => (
            <div
              key={p}
              className={`chip ${proteins.includes(p) ? 'on' : ''}`}
              onClick={() => toggleItem(proteins, setProteins, p)}
              style={{ '--i': index }}
            >{p}</div>
          ))}
        </div>
        <div className="other-field">
          <span className="other-label">+ הוסיפו מה שחסר:</span>
          <input
            type="text"
            placeholder="למשל: שעועית ירוקה, ענבים..."
            value={extrasProteins}
            onChange={e => setExtrasProteins(e.target.value)}
          />
        </div>
      </div>

      {/* Sauces */}
      <div className="card ing-card">
        <h3 className="card-title">🫙 רטבים ובסיסים</h3>
        <div className="chip-grid">
          {filteredSauces.map((s, index) => (
            <div
              key={s.label}
              className={`chip ${sauces.includes(s.label) ? 'on' : ''}`}
              onClick={() => toggleItem(sauces, setSauces, s.label)}
              style={{ '--i': index }}
            >{s.emoji} {s.label}</div>
          ))}
        </div>
        <div className="other-field">
          <span className="other-label">+ הוסיפו מה שחסר:</span>
          <input
            type="text"
            placeholder="למשל: רוטב טריאקי ביתי..."
            value={extrasSauces}
            onChange={e => setExtrasSauces(e.target.value)}
          />
        </div>
      </div>

      {/* Vegetables */}
      <div className="card ing-card">
        <h3 className="card-title">🥬 ירקות ותוספות</h3>
        <div className="chip-grid">
          {VEGETABLES.map((v, index) => (
            <div
              key={v}
              className={`chip ${vegetables.includes(v) ? 'on' : ''}`}
              onClick={() => toggleItem(vegetables, setVegetables, v)}
              style={{ '--i': index }}
            >{v}</div>
          ))}
        </div>
        <div className="other-field">
          <span className="other-label">+ הוסיפו מה שחסר:</span>
          <input
            type="text"
            placeholder="למשל: גבינת עיזים, ענבים..."
            value={extrasVegetables}
            onChange={e => setExtrasVegetables(e.target.value)}
          />
        </div>
      </div>

      {/* Spices */}
      <div className="card ing-card">
        <h3 className="card-title">🧂 תבלינים</h3>
        <div className="chip-grid">
          {SPICES.map((s, index) => (
            <div
              key={s}
              className={`chip ${spices.includes(s) ? 'on' : ''}`}
              onClick={() => toggleItem(spices, setSpices, s)}
              style={{ '--i': index }}
            >{s}</div>
          ))}
        </div>
        <div className="other-field">
          <span className="other-label">+ הוסיפו מה שחסר:</span>
          <input
            type="text"
            placeholder="למשל: סומאק, שמיר..."
            value={extrasSpices}
            onChange={e => setExtrasSpices(e.target.value)}
          />
        </div>
      </div>

      {/* Recipe idea */}
      <div className="card optional-card">
        <label className="card-title">💡 יש לכם רעיון? (אופציונלי)</label>
        <textarea
          placeholder="למשל: 'משהו בסגנון אסייתי עם אטריות' או 'עוגה שמתאימה לשבת'..."
          rows={3}
          value={recipeIdea}
          onChange={e => setRecipeIdea(e.target.value)}
          maxLength={200}
        />
      </div>

      {/* Difficulty */}
      <div className="card">
        <div className="card-title">⭐ דרגת קושי מועדפת</div>
        <div className="difficulty-row">
          {['easy', 'medium', 'hard'].map(d => (
            <div
              key={d}
              className={`difficulty-chip ${difficulty === d ? 'on' : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d === 'easy' ? '😌 קל' : d === 'medium' ? '🙂 בינוני' : '💪 מאתגר'}
            </div>
          ))}
        </div>
      </div>

      {/* Max time */}
      <div className="card optional-card">
        <div className="card-title">⏱️ זמן מקסימלי (אופציונלי)</div>
        <div className="time-row">
          <input
            type="number"
            min="10" max="240" step="5"
            placeholder="—"
            value={maxMinutes}
            onChange={e => setMaxMinutes(e.target.value)}
          />
          <span>דקות</span>
        </div>
        <div className="card-sub">השאירו ריק אם אין מגבלת זמן</div>
      </div>

      {/* Servings */}
      <div className="card">
        <div className="card-title">🍽️ מספר מנות</div>
        <div className="servings-row">
          <button className="servings-btn" onClick={() => setServings(Math.max(1, servings - 1))}>−</button>
          <span className="servings-num">{servings}</span>
          <button className="servings-btn" onClick={() => setServings(Math.min(12, servings + 1))}>+</button>
        </div>
      </div>

      <button className="btn btn-generate" onClick={handleGenerate}>
        {generateText}
      </button>
    </div>
  );
}
