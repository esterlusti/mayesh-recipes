import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, BookOpen, Users, Bot, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAllRecentRecipes, getRecentQueryLogs, getAllUsers,
  deleteRecipeDoc, updateAIModel
} from '../firebase';
import { useAISettings } from '../hooks/useAISettings';

export default function AdminPanel({ open, onClose, user }) {
  const [tab, setTab] = useState('queries');
  const [queries, setQueries] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { activeModel } = useAISettings();
  const panelRef = useRef();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    if (tab === 'queries') {
      getRecentQueryLogs(50).then(setQueries).catch(console.error).finally(() => setLoading(false));
    } else if (tab === 'recipes') {
      getAllRecentRecipes(50).then(setRecipes).catch(console.error).finally(() => setLoading(false));
    } else if (tab === 'users') {
      getAllUsers(100).then(setUsers).catch(console.error).finally(() => setLoading(false));
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
  ];

  return (
    <div className="admin-overlay">
      <div className="admin-panel" ref={panelRef}>
        <div className="admin-header">
          <h2 className="playfair">פאנל ניהול</h2>
          <button className="profile-close" onClick={onClose}><X size={18} /></button>
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
                        {q.requestPayload?.model && <span className="admin-tag admin-tag-model">{q.requestPayload.model}</span>}
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
                        {r.difficulty && <span className="admin-tag">{r.difficulty}</span>}
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
                        <span className="admin-card-name">{u.id.slice(0, 8)}...</span>
                      </div>
                      <div className="admin-card-details">
                        {u.gender && <span className="admin-tag">{u.gender === 'male' ? 'זכר' : 'נקבה'}</span>}
                        {u.equipmentType && <span className="admin-tag">{u.equipmentType === 'meat' ? 'בשרי' : 'חלבי'}</span>}
                        {u.isAdmin && <span className="admin-tag admin-tag-admin">מנהל</span>}
                      </div>
                    </div>
                  ))}
                </div>
          )}

          {!loading && tab === 'ai' && (
            <div className="admin-ai-section">
              <p className="admin-ai-status">
                מודל פעיל: <strong>{activeModel === 'openai' ? 'OpenAI (GPT-4o-mini)' : 'Gemini 2.0 Flash'}</strong>
              </p>
              <div className="admin-ai-toggle">
                <button
                  className={`admin-model-btn ${activeModel === 'openai' ? 'active' : ''}`}
                  onClick={() => handleModelSwitch('openai')}
                >
                  OpenAI (GPT-4o-mini)
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
        </div>
      </div>
    </div>
  );
}
