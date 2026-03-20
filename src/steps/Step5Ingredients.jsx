import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { PROTEINS, VEGETABLES, SPICES, CARBS } from '../data/ingredients';
import { SAUCES } from '../data/sauces';

const PROTEIN_TAB_LABELS = {
  meat:   'בשר ועוף',
  dairy:  'גבינות וביצים',
  pareve: 'דגים וקטניות',
};

const getTabs = (kosherType) => [
  { key: 'proteins',   label: PROTEIN_TAB_LABELS[kosherType] || 'בשר ודגים' },
  { key: 'carbs',      label: 'דגנים ופסטה' },
  { key: 'vegetables', label: 'ירקות'       },
  { key: 'flavors',    label: 'טעמים'       },
];

export default function Step5Ingredients({ kosherType, onNext, useGenderText, pantryStaples = [] }) {
  const [proteins, setProteins]     = useState([]);
  const [carbs, setCarbs]           = useState([]);
  const [sauces, setSauces]         = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [spices, setSpices]         = useState([]);

  // Custom chips per section
  const [customProteins, setCustomProteins]     = useState([]);
  const [customCarbs, setCustomCarbs]           = useState([]);
  const [customVegetables, setCustomVegetables] = useState([]);
  const [customSauces, setCustomSauces]         = useState([]);
  const [customSpices, setCustomSpices]         = useState([]);

  // Input state per section
  const [addingTab, setAddingTab] = useState(null);
  const [inputVal, setInputVal]   = useState('');
  const inputRef = useRef();

  const [activeTab, setActiveTab] = useState(0);
  const [visitedTabs, setVisitedTabs] = useState(new Set([0]));

  const tabs = getTabs(kosherType);

  const goToTab = (i) => {
    setActiveTab(i);
    setVisitedTabs(prev => new Set([...prev, i]));
  };

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

  const handleNext = () => {
    const formatItem = (i) => i.qty != null ? `${i.label}${i.qty > 1 ? ` (${i.qty})` : ''}` : i.label;
    onNext({
      proteins:         proteins.map(formatItem),
      carbs:            carbs.map(i => i.label),
      sauces:           sauces.map(i => i.label),
      vegetables:       vegetables.map(formatItem),
      spices:           spices.map(i => i.label),
      customProteins,
      customCarbs,
      customVegetables,
      customSauces,
      customSpices,
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

  const renderGroupedChips = (items, list, setList) => {
    let lastGroup = null;
    return items.map(item => {
      const showHeader = item.group && item.group !== lastGroup;
      if (item.group) lastGroup = item.group;
      return (
        <React.Fragment key={item.id}>
          {showHeader && (
            <div className="chip-group-header">{item.group}</div>
          )}
          {renderChip(item, list, setList)}
        </React.Fragment>
      );
    });
  };

  const renderAddButton = (customKey) => (
    addingTab === customKey ? (
      <div className="chip-add-input-wrap">
        <input
          ref={inputRef}
          className="chip-add-input"
          type="text"
          placeholder="הוסיפי מרכיב..."
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') addCustomChip(customKey);
            if (e.key === 'Escape') { setAddingTab(null); setInputVal(''); }
          }}
          onBlur={() => { if (!inputVal.trim()) { setAddingTab(null); setInputVal(''); } }}
        />
        <button className="chip-add-confirm" onClick={() => addCustomChip(customKey)} disabled={!inputVal.trim()}>
          <Plus size={14} />
        </button>
      </div>
    ) : (
      <div className="chip chip-add-btn" onClick={() => setAddingTab(customKey)}>
        <Plus size={13} /> הוסיפי מרכיב
      </div>
    )
  );

  const tabCountMap = {
    proteins:   (proteins?.length ?? 0) + (customProteins?.length ?? 0),
    carbs:      (carbs?.length ?? 0) + (customCarbs?.length ?? 0),
    vegetables: (vegetables?.length ?? 0) + (customVegetables?.length ?? 0),
    flavors:    (sauces?.length ?? 0) + (spices?.length ?? 0) + (customSauces?.length ?? 0) + (customSpices?.length ?? 0),
  };

  const currentTab = tabs[activeTab];

  const renderTabContent = () => {
    if (currentTab.key === 'flavors') {
      return (
        <>
          <div className="chip-group-header first">רטבים ושמנים</div>
          {filteredSauces.map(item => renderChip(item, sauces, setSauces))}
          {customSauces.map((label, idx) => (
            <div key={`cs-${idx}`} className="chip-wrapper">
              <div className="chip on chip-custom">
                {label}
                <button className="chip-remove" onClick={() => removeCustomChip('sauces', idx)}><X size={11} /></button>
              </div>
            </div>
          ))}
          {renderAddButton('sauces')}

          <div className="chip-group-header">תבלינים</div>
          {SPICES.map(item => renderChip(item, spices, setSpices))}
          {customSpices.map((label, idx) => (
            <div key={`csp-${idx}`} className="chip-wrapper">
              <div className="chip on chip-custom">
                {label}
                <button className="chip-remove" onClick={() => removeCustomChip('spices', idx)}><X size={11} /></button>
              </div>
            </div>
          ))}
          {renderAddButton('spices')}
        </>
      );
    }

    const contentMap = {
      proteins:   { items: proteinList,  list: proteins,   setList: setProteins,   custom: customProteins,   customKey: 'proteins'   },
      carbs:      { items: CARBS,        list: carbs,      setList: setCarbs,      custom: customCarbs,      customKey: 'carbs'      },
      vegetables: { items: VEGETABLES,   list: vegetables, setList: setVegetables, custom: customVegetables, customKey: 'vegetables' },
    };
    const current = contentMap[currentTab.key];
    const hasGroups = current.items.some(i => i.group);

    return (
      <>
        {hasGroups
          ? renderGroupedChips(current.items, current.list, current.setList)
          : current.items.map(item => renderChip(item, current.list, current.setList))
        }
        {current.custom.map((label, idx) => (
          <div key={`custom-${idx}`} className="chip-wrapper">
            <div className="chip on chip-custom">
              {label}
              <button className="chip-remove" onClick={() => removeCustomChip(current.customKey, idx)}><X size={11} /></button>
            </div>
          </div>
        ))}
        {renderAddButton(current.customKey)}
      </>
    );
  };

  const isLastTab = activeTab === tabs.length - 1;
  const currentCount = tabCountMap[currentTab.key];
  const nextTab = tabs[activeTab + 1];

  return (
    <div className="step-card ingredients-step">
      <h2 className="playfair step-title">מרכיבים</h2>
      <p className="step-sub">סמנו מה יש לכם בבית</p>

      {/* Segmented tab bar */}
      <div className="ing-seg-bar">
        {tabs.map((tab, i) => {
          const isDone = visitedTabs.has(i) && i !== activeTab && tabCountMap[tab.key] > 0;
          const isActive = activeTab === i;
          const stateClass = isActive ? 'active' : isDone ? 'done' : visitedTabs.has(i) ? 'visited' : 'future';
          return (
            <button
              key={tab.key}
              className={`ing-seg-btn ${stateClass}`}
              onClick={() => goToTab(i)}
            >
              {isDone && <Check size={11} className="seg-check" />}
              <span className="seg-label">{tab.label}</span>
              {tabCountMap[tab.key] > 0 && !isActive && (
                <span className="seg-count">{tabCountMap[tab.key]}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Section header */}
      <div className="ing-section-header">
        <span className="ing-section-title">{currentTab.label}</span>
        {currentCount > 0 && (
          <span className="ing-section-count">{currentCount} נבחרו ✓</span>
        )}
      </div>

      {/* Tab content */}
      <div className="ing-tab-panel">
        <div className="ing-tab-chips">
          {renderTabContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="ing-nav-row">
        {isLastTab ? (
          <button className="btn btn-next btn-generate" onClick={handleNext}>
            צור לי מתכון! ←
          </button>
        ) : (
          <>
            <button className="btn btn-next ing-btn-next-tab" onClick={() => goToTab(activeTab + 1)}>
              המשך: {nextTab.label} ←
            </button>
            <button className="btn-skip-to-end" onClick={handleNext}>
              דלג לסוף ←
            </button>
          </>
        )}
      </div>
    </div>
  );
}
