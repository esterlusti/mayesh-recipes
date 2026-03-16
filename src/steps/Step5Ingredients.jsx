import React, { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { PROTEINS, VEGETABLES, SPICES, CARBS } from '../data/ingredients';
import { SAUCES } from '../data/sauces';

const TABS = [
  { key: 'proteins',   label: 'חלבון'   },
  { key: 'carbs',      label: 'פחמימות' },
  { key: 'vegetables', label: 'ירקות'   },
  { key: 'sauces',     label: 'רטבים'   },
  { key: 'spices',     label: 'תבלינים' },
];

export default function Step5Ingredients({ kosherType, onGenerate, useGenderText, pantryStaples = [] }) {
  const [proteins, setProteins]     = useState([]);
  const [carbs, setCarbs]           = useState([]);
  const [sauces, setSauces]         = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [spices, setSpices]         = useState([]);

  // Custom chips per tab
  const [customProteins, setCustomProteins]     = useState([]);
  const [customCarbs, setCustomCarbs]           = useState([]);
  const [customVegetables, setCustomVegetables] = useState([]);
  const [customSauces, setCustomSauces]         = useState([]);
  const [customSpices, setCustomSpices]         = useState([]);

  // Input state per tab
  const [addingTab, setAddingTab] = useState(null);
  const [inputVal, setInputVal]   = useState('');
  const inputRef = useRef();

  const [servings, setServings]     = useState(4);
  const [recipeIdea, setRecipeIdea] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [maxMinutes, setMaxMinutes] = useState('');
  const [recipeStyle, setRecipeStyle] = useState('classic'); // 'classic' | 'special'
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
    setCarbs(preSelect(CARBS));
    setVegetables(preSelect(VEGETABLES));
    setSauces(preSelect(filteredSauces));
    setSpices(preSelect(SPICES));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pantryStaples.join(','), kosherType]);

  useEffect(() => {
    if (addingTab !== null && inputRef.current) inputRef.current.focus();
  }, [addingTab]);

  const toggle = (list, setList, item) => {
    setList(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.filter(i => i.id !== item.id);
      return [...prev, { id: item.id, label: item.label, qty: item.defaultQty ?? null }];
    });
  };

  const changeQty = (list, setList, id, delta, item) => {
    setList(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newQty = Math.max(item.qtyStep ?? 1, (i.qty ?? item.defaultQty ?? 1) + delta);
      return { ...i, qty: newQty };
    }));
  };

  const isSelected = (list, id) => list.some(i => i.id === id);
  const getQty = (list, id) => list.find(i => i.id === id)?.qty ?? null;

  const addCustomChip = (key) => {
    const val = inputVal.trim();
    if (!val) { setAddingTab(null); return; }
    const setMap = { proteins: setCustomProteins, carbs: setCustomCarbs, vegetables: setCustomVegetables, sauces: setCustomSauces, spices: setCustomSpices };
    setMap[key](prev => [...prev, val]);
    setInputVal('');
    setAddingTab(null);
  };

  const removeCustomChip = (key, idx) => {
    const setMap = { proteins: setCustomProteins, carbs: setCustomCarbs, vegetables: setCustomVegetables, sauces: setCustomSauces, spices: setCustomSpices };
    setMap[key](prev => prev.filter((_, i) => i !== idx));
  };

  const handleGenerate = () => {
    const formatItem = (i) => i.qty != null ? `${i.label}${i.qty > 1 ? ` (${i.qty})` : ''}` : i.label;
    onGenerate({
      proteins:   proteins.map(formatItem),
      carbs:      carbs.map(i => i.label),
      sauces:     sauces.map(i => i.label),
      vegetables: vegetables.map(formatItem),
      spices:     spices.map(i => i.label),
      customProteins, customCarbs, customVegetables, customSauces, customSpices,
      servings, recipeIdea, difficulty, recipeStyle,
      maxMinutes: maxMinutes ? parseInt(maxMinutes) : null
    });
  };

  const renderChip = (item, list, setList) => {
    const on = isSelected(list, item.id);
    const qty = getQty(list, item.id);
    const hasQty = on && item.qtyType;
    const step = item.qtyStep ?? 1;
    return (
      <div key={item.id} className="chip-wrapper">
        <div className={`chip ${on ? 'on' : ''}`} onClick={() => toggle(list, setList, item)}>
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
    proteins:   { items: proteinList,    list: proteins,   setList: setProteins,   custom: customProteins,   customKey: 'proteins'   },
    carbs:      { items: CARBS,          list: carbs,      setList: setCarbs,      custom: customCarbs,      customKey: 'carbs'      },
    vegetables: { items: VEGETABLES,     list: vegetables, setList: setVegetables, custom: customVegetables, customKey: 'vegetables' },
    sauces:     { items: filteredSauces, list: sauces,     setList: setSauces,     custom: customSauces,     customKey: 'sauces'     },
    spices:     { items: SPICES,         list: spices,     setList: setSpices,     custom: customSpices,     customKey: 'spices'     },
  };

  const currentTab = TABS[activeTab];
  const current = tabContent[currentTab.key];

  const tabCount = (key) => {
    const listMap = { proteins, carbs, vegetables, sauces, spices };
    const customMap = { proteins: customProteins, carbs: customCarbs, vegetables: customVegetables, sauces: customSauces, spices: customSpices };
    return (listMap[key]?.length ?? 0) + (customMap[key]?.length ?? 0);
  };

  return (
    <div className="step-card ingredients-step">
      <h2 className="playfair step-title">מרכיבים</h2>
      <p className="step-sub">סמנו מה יש לכם בבית</p>

      {/* Tabs */}
      <div className="ing-tabs">
        {TABS.map((tab, i) => (
          <div key={tab.key} className={`ing-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab.label}
            {tabCount(tab.key) > 0 && <span className="tab-badge">{tabCount(tab.key)}</span>}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div className="ing-tab-panel">
        <div className="ing-tab-chips">
          {current.items.map(item => renderChip(item, current.list, current.setList))}

          {/* Custom chips */}
          {current.custom.map((label, idx) => (
            <div key={`custom-${idx}`} className="chip-wrapper">
              <div className="chip on chip-custom">
                {label}
                <button className="chip-remove" onClick={() => removeCustomChip(current.customKey, idx)}><X size={11} /></button>
              </div>
            </div>
          ))}

          {/* Add custom button / input */}
          {addingTab === current.customKey ? (
            <div className="chip-add-input-wrap">
              <input
                ref={inputRef}
                className="chip-add-input"
                type="text"
                placeholder="הוסיפי מרכיב..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') addCustomChip(current.customKey);
                  if (e.key === 'Escape') { setAddingTab(null); setInputVal(''); }
                }}
                onBlur={() => { if (!inputVal.trim()) { setAddingTab(null); setInputVal(''); } }}
              />
              <button className="chip-add-confirm" onClick={() => addCustomChip(current.customKey)} disabled={!inputVal.trim()}>
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <div className="chip chip-add-btn" onClick={() => setAddingTab(current.customKey)}>
              <Plus size={13} /> הוסיפי מרכיב
            </div>
          )}
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
