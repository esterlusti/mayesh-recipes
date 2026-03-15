import React, { useState } from 'react';
import { PROTEINS, VEGETABLES, SPICES } from '../data/ingredients';
import { SAUCES } from '../data/sauces';

const TABS = [
  { key: 'proteins',  label: 'חלבון'    },
  { key: 'vegetables',label: 'ירקות'    },
  { key: 'sauces',    label: 'רטבים'    },
  { key: 'spices',    label: 'תבלינים'  },
];

export default function Step5Ingredients({ kosherType, onGenerate, useGenderText }) {
  const [proteins, setProteins]       = useState([]);
  const [sauces, setSauces]           = useState([]);
  const [vegetables, setVegetables]   = useState([]);
  const [spices, setSpices]           = useState([]);
  const [extrasProteins, setExtrasProteins]     = useState('');
  const [extrasSauces, setExtrasSauces]         = useState('');
  const [extrasVegetables, setExtrasVegetables] = useState('');
  const [extrasSpices, setExtrasSpices]         = useState('');
  const [servings, setServings]       = useState(4);
  const [recipeIdea, setRecipeIdea]   = useState('');
  const [difficulty, setDifficulty]   = useState('medium');
  const [maxMinutes, setMaxMinutes]   = useState('');
  const [activeTab, setActiveTab]     = useState(0);

  const generateText = useGenderText('צור לי מתכון ✦', 'צרי לי מתכון ✦');

  const proteinList = PROTEINS[kosherType] || PROTEINS.pareve;

  const filteredSauces = SAUCES.filter(s => {
    if (s.kosher === 'all') return true;
    if (kosherType === 'meat' && s.kosher === 'dairy') return false;
    if (kosherType === 'dairy' && s.kosher === 'meat') return false;
    if (kosherType === 'pareve' && (s.kosher === 'meat' || s.kosher === 'dairy')) return false;
    return true;
  });

  const toggle = (list, setList, item) =>
    setList(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);

  const handleGenerate = () => {
    onGenerate({
      proteins, sauces, vegetables, spices,
      extrasProteins, extrasSauces, extrasVegetables, extrasSpices,
      servings, recipeIdea, difficulty,
      maxMinutes: maxMinutes ? parseInt(maxMinutes) : null
    });
  };

  const tabContent = {
    proteins: {
      items: proteinList,
      selected: proteins,
      toggle: (item) => toggle(proteins, setProteins, item),
      extra: extrasProteins,
      setExtra: setExtrasProteins,
      placeholder: 'למשל: שעועית לבנה, גבינה בולגרית...',
    },
    vegetables: {
      items: VEGETABLES,
      selected: vegetables,
      toggle: (item) => toggle(vegetables, setVegetables, item),
      extra: extrasVegetables,
      setExtra: setExtrasVegetables,
      placeholder: 'למשל: ארטישוק, כרישה...',
    },
    sauces: {
      items: filteredSauces.map(s => s.label),
      selected: sauces,
      toggle: (item) => toggle(sauces, setSauces, item),
      extra: extrasSauces,
      setExtra: setExtrasSauces,
      placeholder: 'למשל: רוטב טריאקי...',
    },
    spices: {
      items: SPICES,
      selected: spices,
      toggle: (item) => toggle(spices, setSpices, item),
      extra: extrasSpices,
      setExtra: setExtrasSpices,
      placeholder: 'למשל: סומאק, שמיר...',
    },
  };

  const currentTab = TABS[activeTab];
  const current = tabContent[currentTab.key];

  return (
    <div className="step-card ingredients-step">
      <h2 className="playfair step-title">מרכיבים</h2>
      <p className="step-sub">סמנו מה יש לכם בבית</p>

      {/* Tabs */}
      <div className="ing-tabs">
        {TABS.map((tab, i) => (
          <div
            key={tab.key}
            className={`ing-tab ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div className="ing-tab-panel">
        <div className="ing-tab-chips">
          {current.items.map((item, index) => (
            <div
              key={item}
              className={`chip ${current.selected.includes(item) ? 'on' : ''}`}
              onClick={() => current.toggle(item)}
              style={{ '--i': index }}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="ing-extra">
          <span className="ing-extra-label">הוסיפו מה שחסר</span>
          <input
            type="text"
            placeholder={current.placeholder}
            value={current.extra}
            onChange={e => current.setExtra(e.target.value)}
          />
        </div>
      </div>

      {/* Recipe idea */}
      <div className="ing-idea-card" style={{ marginTop: 14 }}>
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
            <span className="ing-setting-label">קושי</span>
            <div className="difficulty-row">
              {[
                { key: 'easy',   label: 'קל'     },
                { key: 'medium', label: 'בינוני' },
                { key: 'hard',   label: 'מאתגר'  },
              ].map(d => (
                <div
                  key={d.key}
                  className={`difficulty-chip ${difficulty === d.key ? 'on' : ''}`}
                  onClick={() => setDifficulty(d.key)}
                >
                  {d.label}
                </div>
              ))}
            </div>
          </div>

          <div className="ing-setting-group">
            <span className="ing-setting-label">זמן מקסימלי (דקות)</span>
            <div className="time-row">
              <input
                type="number"
                min="10" max="240" step="5"
                placeholder="—"
                value={maxMinutes}
                onChange={e => setMaxMinutes(e.target.value)}
              />
              <span>דק'</span>
            </div>
          </div>

          <div className="ing-setting-group">
            <span className="ing-setting-label">מנות</span>
            <div className="servings-row">
              <button className="servings-btn" onClick={() => setServings(Math.max(1, servings - 1))}>−</button>
              <span className="servings-num">{servings}</span>
              <button className="servings-btn" onClick={() => setServings(Math.min(12, servings + 1))}>+</button>
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
