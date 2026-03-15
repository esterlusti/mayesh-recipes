import React, { useState, useEffect } from 'react';
import { PROTEINS, VEGETABLES, SPICES } from '../data/ingredients';
import { SAUCES } from '../data/sauces';

const TABS = [
  { key: 'proteins',   label: 'חלבון'   },
  { key: 'vegetables', label: 'ירקות'   },
  { key: 'sauces',     label: 'רטבים'   },
  { key: 'spices',     label: 'תבלינים' },
];

// Build a map from ingredient id → ingredient object for quick lookup
function buildIdMap(lists) {
  const map = {};
  lists.flat().forEach(item => { if (item.id) map[item.id] = item; });
  return map;
}

export default function Step5Ingredients({ kosherType, onGenerate, useGenderText, pantryStaples = [] }) {
  const [proteins, setProteins]     = useState([]);
  const [sauces, setSauces]         = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [spices, setSpices]         = useState([]);

  const [extrasProteins, setExtrasProteins]     = useState('');
  const [extrasSauces, setExtrasSauces]         = useState('');
  const [extrasVegetables, setExtrasVegetables] = useState('');
  const [extrasSpices, setExtrasSpices]         = useState('');

  const [servings, setServings]     = useState(4);
  const [recipeIdea, setRecipeIdea] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [maxMinutes, setMaxMinutes] = useState('');
  const [activeTab, setActiveTab]   = useState(0);

  const generateText = useGenderText('צור לי מתכון ✦', 'צרי לי מתכון ✦');

  const proteinList = PROTEINS[kosherType] || PROTEINS.pareve;

  const filteredSauces = SAUCES.filter(s => {
    if (s.kosher === 'all') return true;
    if (kosherType === 'meat'   && s.kosher === 'dairy') return false;
    if (kosherType === 'dairy'  && s.kosher === 'meat')  return false;
    if (kosherType === 'pareve' && (s.kosher === 'meat' || s.kosher === 'dairy')) return false;
    return true;
  });

  // Pre-select pantry staples on mount
  useEffect(() => {
    if (!pantryStaples.length) return;

    const preSelect = (list) =>
      list.filter(item => pantryStaples.includes(item.id))
          .map(item => ({ id: item.id, label: item.label, qty: item.defaultQty ?? null }));

    setProteins(preSelect(proteinList));
    setVegetables(preSelect(VEGETABLES));
    setSauces(preSelect(filteredSauces));
    setSpices(preSelect(SPICES));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pantryStaples.join(','), kosherType]);

  // Toggle an ingredient on/off (generic)
  const toggle = (list, setList, item) => {
    setList(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.filter(i => i.id !== item.id);
      return [...prev, { id: item.id, label: item.label, qty: item.defaultQty ?? null }];
    });
  };

  // Change quantity for a selected ingredient
  const changeQty = (list, setList, id, delta, item) => {
    setList(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newQty = Math.max(item.qtyStep ?? 1, (i.qty ?? item.defaultQty ?? 1) + delta);
      return { ...i, qty: newQty };
    }));
  };

  const isSelected = (list, id) => list.some(i => i.id === id);
  const getQty = (list, id) => list.find(i => i.id === id)?.qty ?? null;

  const handleGenerate = () => {
    const formatItem = (i) => i.qty != null
      ? `${i.label}${i.qty > 1 ? ` (${i.qty})` : ''}`
      : i.label;

    onGenerate({
      proteins:          proteins.map(formatItem),
      sauces:            sauces.map(i => i.label),
      vegetables:        vegetables.map(formatItem),
      spices:            spices.map(i => i.label),
      extrasProteins,    extrasSauces,
      extrasVegetables,  extrasSpices,
      servings, recipeIdea, difficulty,
      maxMinutes: maxMinutes ? parseInt(maxMinutes) : null
    });
  };

  // Helper: renders a chip + optional quantity control
  const renderChip = (item, list, setList) => {
    const on = isSelected(list, item.id);
    const qty = getQty(list, item.id);
    const hasQty = on && item.qtyType;
    const step = item.qtyStep ?? 1;

    return (
      <div key={item.id} className="chip-wrapper" style={{ '--i': 0 }}>
        <div
          className={`chip ${on ? 'on' : ''}`}
          onClick={() => toggle(list, setList, item)}
        >
          {item.label}
        </div>
        {hasQty && (
          <div className="qty-control">
            <button className="qty-btn" onClick={() => changeQty(list, setList, item.id, -step, item)}>−</button>
            <span className="qty-value">{qty}{item.unit ? ` ${item.unit}` : ''}</span>
            <button className="qty-btn" onClick={() => changeQty(list, setList, item.id, +step, item)}>+</button>
          </div>
        )}
      </div>
    );
  };

  const tabContent = {
    proteins: {
      items: proteinList,
      list: proteins, setList: setProteins,
      extra: extrasProteins, setExtra: setExtrasProteins,
      placeholder: 'למשל: שעועית לבנה, גבינה בולגרית...',
    },
    vegetables: {
      items: VEGETABLES,
      list: vegetables, setList: setVegetables,
      extra: extrasVegetables, setExtra: setExtrasVegetables,
      placeholder: 'למשל: ארטישוק, כרישה...',
    },
    sauces: {
      items: filteredSauces,
      list: sauces, setList: setSauces,
      extra: extrasSauces, setExtra: setExtrasSauces,
      placeholder: 'למשל: רוטב טריאקי...',
    },
    spices: {
      items: SPICES,
      list: spices, setList: setSpices,
      extra: extrasSpices, setExtra: setExtrasSpices,
      placeholder: 'למשל: סומאק, שמיר...',
    },
  };

  const currentTab = TABS[activeTab];
  const current = tabContent[currentTab.key];

  const tabCount = (key) => {
    const map = { proteins, vegetables, sauces, spices };
    return map[key]?.length ?? 0;
  };

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
            {tabCount(tab.key) > 0 && (
              <span className="tab-badge">{tabCount(tab.key)}</span>
            )}
          </div>
        ))}
      </div>

      {/* Tab summary */}
      <div className="tab-summary">
        {TABS.map((tab, i) => (
          <span key={tab.key} className={tabCount(tab.key) > 0 ? 'tab-summary-item active' : 'tab-summary-item'}>
            {tab.label}: {tabCount(tab.key)}
          </span>
        ))}
      </div>

      {/* Tab content */}
      <div className="ing-tab-panel">
        <div className="ing-tab-chips">
          {current.items.map(item =>
            renderChip(item, current.list, current.setList)
          )}
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
                { key: 'easy',   label: 'קל'    },
                { key: 'medium', label: 'בינוני'},
                { key: 'hard',   label: 'מאתגר' },
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
