import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, BookOpen, Users, Bot, Trash2, Package, FileText } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import toast from 'react-hot-toast';
import {
  getAllRecentRecipes, getRecentQueryLogs, getAllUsers,
  deleteRecipeDoc, updateAIModel,
  getAboutContent, saveAboutContent,
  getDefaultPantryStaples, saveDefaultPantryStaples
} from '../firebase';
import { useAISettings } from '../hooks/useAISettings';
import { PROTEINS, VEGETABLES, SPICES, CARBS } from '../data/ingredients';
import { SAUCES } from '../data/sauces';

const ALL_INGREDIENTS = [
  ...PROTEINS.meat, ...PROTEINS.dairy, ...PROTEINS.pareve,
  ...VEGETABLES, ...CARBS, ...SPICES,
  ...SAUCES.map(s => ({ id: s.id, label: s.label }))
];

export default function AdminPanel({ open, onClose, user }) {
  const [tab, setTab] = useState('queries');
  const [queries, setQueries] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { activeModel } = useAISettings();
  const panelRef = useRef();
  useFocusTrap(panelRef, open, onClose);

  // About editor
  const [aboutContent, setAboutContent] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);

  // Default pantry
  const [defaultPantry, setDefaultPantry] = useState([]);
  const [pantryLoaded, setPantryLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    if (tab === 'queries') {
      getRecentQueryLogs(50).then(setQueries).catch(console.error).finally(() => setLoading(false));
    } else if (tab === 'recipes') {
      getAllRecentRecipes(50).then(setRecipes).catch(console.error).finally(() => setLoading(false));
    } else if (tab === 'users') {
      getAllUsers(100).then(setUsers).catch(console.error).finally(() => setLoading(false));
    } else if (tab === 'about' && !aboutLoaded) {
      getAboutContent().then(data => {
        if (data) setAboutContent(data.content || '');
        setAboutLoaded(true);
      }).catch(console.error).finally(() => setLoading(false));
    } else if (tab === 'defaults' && !pantryLoaded) {
      getDefaultPantryStaples().then(staples => {
        setDefaultPantry(staples);
        setPantryLoaded(true);
      }).catch(console.error).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [open, tab]);

  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  const handleDeleteRecipe = async (uid, recipeId) => {
    try {
      await deleteRecipeDoc(uid, recipeId);
      setRecipes(prev => prev.filter(r => r.id !== recipeId));
      toast.success('מתכון נמחק');
    } catch (e) {
      console.error(e);
      toast.error('שגיאה במחיקה');
    }
  };

  const handleModelSwitch = async (model) => {
    try {
      await updateAIModel(model, user.uid);
      toast.success(`מודל AI הוחלף ל-${model === 'openai' ? 'OpenAI' : 'Gemini'}`);
    } catch (e) {
      console.error(e);
      toast.error('שגיאה בהחלפת מודל');
    }
  };

  const handleSaveAbout = async () => {
    try {
      await saveAboutContent(aboutContent, user.uid);
      toast.success('תוכן האודות עודכן');
    } catch (e) {
      console.error(e);
      toast.error('שגיאה בשמירה');
    }
  };

  const togglePantryItem = (id) => {
    setDefaultPantry(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSavePantry = async () => {
    try {
      await saveDefaultPantryStaples(defaultPantry, user.uid);
      toast.success('ברירות מחדל עודכנו');
    } catch (e) {
      console.error(e);
      toast.error('שגיאה בשמירה');
    }
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('he-IL') + ' ' + d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
  };

  if (!open) return null;

  const tabs = [
    { id: 'queries', label: 'שאילתות', icon: MessageSquare },
    { id: 'recipes', label: 'מתכונים', icon: BookOpen },
    { id: 'users', label: 'משתמשים', icon: Users },
    { id: 'ai', label: 'מודל AI', icon: Bot },
    { id: 'defaults', label: 'ברירות מחדל', icon: Package },
    { id: 'about', label: 'אודות', icon: FileText },
  ];

  return (
    <div className="admin-overlay" role="dialog" aria-modal="true" aria-label="פאנל ניהול">
      <div className="admin-panel" ref={panelRef}>
        <div className="admin-header">
          <h2 className="playfair">פאנל ניהול</h2>
          <button className="profile-close" onClick={onClose} aria-label="סגירת פאנל ניהול"><X size={18} /></button>
        </div>

        <div className="admin-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`admin-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="admin-content">
          {loading && <p className="admin-loading">טוען...</p>}

          {!loading && tab === 'queries' && (
            queries.length === 0
              ? <p className="admin-empty">אין שאילתות עדיין</p>
              : <div className="admin-list">
                  {queries.map(q => (
                    <div key={q.id} className="admin-card">
                      <div className="admin-card-header">
                        <span className="admin-card-name">{q.displayName || 'אנונימי'}</span>
                        <span className="admin-card-date">{formatDate(q.createdAt)}</span>
                      </div>
                      <div className="admin-card-details">
                        {q.requestPayload?.category && <span className="admin-tag">{q.requestPayload.category}</span>}
                        {q.requestPayload?.dishType && <span className="admin-tag">{q.requestPayload.dishType}</span>}
                        {q.requestPayload?.kosherType && <span className="admin-tag">{q.requestPayload.kosherType === 'meat' ? 'בשרי' : q.requestPayload.kosherType === 'dairy' ? 'חלבי' : 'פרווה'}</span>}
                      </div>
                    </div>
                  ))}
                </div>
          )}

          {!loading && tab === 'recipes' && (
            recipes.length === 0
              ? <p className="admin-empty">אין מתכונים שמורים</p>
              : <div className="admin-list">
                  {recipes.map(r => (
                    <div key={r.id} className="admin-card">
                      <div className="admin-card-header">
                        <span className="admin-card-name">{r.title || 'ללא כותרת'}</span>
                        <button className="admin-delete-btn" onClick={() => handleDeleteRecipe(r.uid, r.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="admin-card-details">
                        {r.kosher && <span className="admin-tag">{r.kosher === 'meat' ? 'בשרי' : r.kosher === 'dairy' ? 'חלבי' : 'פרווה'}</span>}
                        <span className="admin-card-date">{formatDate(r.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
          )}

          {!loading && tab === 'users' && (
            users.length === 0
              ? <p className="admin-empty">אין משתמשים</p>
              : <div className="admin-list">
                  {users.map(u => (
                    <div key={u.id} className="admin-card">
                      <div className="admin-card-header">
                        <span className="admin-card-name">{u.displayName || u.email || u.id.slice(0, 8) + '...'}</span>
                        {u.email && u.displayName && <span className="admin-card-email" style={{ fontSize: '11px', color: 'var(--text-60)', display: 'block' }}>{u.email}</span>}
                      </div>
                      <div className="admin-card-details">
                        {u.gender && <span className="admin-tag">{u.gender === 'male' ? 'זכר' : 'נקבה'}</span>}
                        {u.equipmentType && <span className="admin-tag">{u.equipmentType === 'meat' ? 'בשרי' : 'חלבי'}</span>}
                        {u.isAdmin && <span className="admin-tag admin-tag-admin">מנהל</span>}
                        {!u.displayName && !u.email && <span className="admin-tag">אורח</span>}
                      </div>
                    </div>
                  ))}
                </div>
          )}

          {!loading && tab === 'ai' && (
            <div className="admin-ai-section">
              <p className="admin-ai-status">
                מודל פעיל: <strong>{activeModel === 'openai' ? 'OpenAI (GPT-4.1-mini)' : 'Gemini 2.0 Flash'}</strong>
              </p>
              <div className="admin-ai-toggle">
                <button
                  className={`admin-model-btn ${activeModel === 'openai' ? 'active' : ''}`}
                  onClick={() => handleModelSwitch('openai')}
                >
                  OpenAI (GPT-4.1-mini)
                </button>
                <button
                  className={`admin-model-btn ${activeModel === 'gemini' ? 'active' : ''}`}
                  onClick={() => handleModelSwitch('gemini')}
                >
                  Gemini 2.0 Flash
                </button>
              </div>
            </div>
          )}

          {!loading && tab === 'defaults' && (
            <div className="admin-defaults-section">
              <p className="admin-section-desc">סמנו מרכיבים שיסומנו כברירת מחדל לכל המשתמשים החדשים:</p>
              <div className="admin-pantry-chips">
                {ALL_INGREDIENTS.filter((item, idx, arr) =>
                  arr.findIndex(x => x.id === item.id) === idx
                ).map(item => (
                  <div
                    key={item.id}
                    className={`chip ${defaultPantry.includes(item.id) ? 'on' : ''}`}
                    onClick={() => togglePantryItem(item.id)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
              <button className="btn btn-next" onClick={handleSavePantry} style={{ marginTop: 16 }}>
                שמירת ברירות מחדל
              </button>
            </div>
          )}

          {!loading && tab === 'about' && (
            <div className="admin-about-section">
              <p className="admin-section-desc">ערכו את תוכן דף האודות:</p>
              <textarea
                className="admin-about-textarea"
                value={aboutContent}
                onChange={e => setAboutContent(e.target.value)}
                rows={10}
                placeholder="כתבו כאן את תוכן דף האודות..."
              />
              <button className="btn btn-next" onClick={handleSaveAbout} style={{ marginTop: 12 }}>
                שמירת תוכן
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
