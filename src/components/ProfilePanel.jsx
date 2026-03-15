import React, { useState, useEffect, useRef } from 'react';
import { doSignOut, getRecentRecipes, saveUserDoc } from '../firebase';
import { EQUIPMENT } from '../data/equipment';
import { VEGETABLES, SPICES } from '../data/ingredients';
import { SAUCES } from '../data/sauces';
import { PANTRY_DEFAULTS } from '../data/pantryDefaults';

// All pantry-eligible items across categories
const PANTRY_ITEMS = [
  ...VEGETABLES.filter(v => v.pantry),
  ...SPICES.filter(s => s.pantry),
  ...SAUCES.filter(s => s.pantry),
];

export default function ProfilePanel({ user, open, onClose, useGenderText, pantryStaples = [], onPantryChange }) {
  const [recipes, setRecipes] = useState([]);
  const [profileEquip, setProfileEquip] = useState([]);
  const [profileEquipType, setProfileEquipType] = useState('meat');
  const [saving, setSaving] = useState(false);
  const [localPantry, setLocalPantry] = useState(pantryStaples);
  const [pantrySaved, setPantrySaved] = useState(false);
  const panelRef = useRef();

  const equipTitle = useGenderText('הציוד שלי', 'הציוד שלי');

  useEffect(() => {
    setLocalPantry(pantryStaples);
  }, [pantryStaples]);

  useEffect(() => {
    if (open && user && !user.isAnonymous) {
      getRecentRecipes(user.uid).then(setRecipes).catch(console.error);
    }
  }, [open, user]);

  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  const toggleEquip = (id) => {
    setProfileEquip(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSaveEquip = async () => {
    if (!user || user.isAnonymous) return;
    setSaving(true);
    try {
      await saveUserDoc(user.uid, { equipment: profileEquip, equipmentType: profileEquipType });
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const togglePantry = (id) => {
    setLocalPantry(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSavePantry = () => {
    onPantryChange(localPantry);
    setPantrySaved(true);
    setTimeout(() => setPantrySaved(false), 2000);
  };

  const handleResetPantry = () => {
    setLocalPantry(PANTRY_DEFAULTS);
  };

  const equipList = [
    ...(EQUIPMENT[profileEquipType] || []),
    ...EQUIPMENT.general
  ];

  const handleSignOut = async () => {
    await doSignOut();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="profile-overlay">
      <div className="profile-panel" ref={panelRef}>
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.photoURL
              ? <img src={user.photoURL} alt="" className="profile-avatar-img" />
              : <span className="profile-avatar-placeholder">
                  {useGenderText('👨‍🍳', '👩‍🍳')}
                </span>
            }
          </div>
          <div className="profile-info">
            <div className="profile-name playfair">
              {user?.isAnonymous
                ? useGenderText('אורח', 'אורחת')
                : (user?.displayName || user?.email?.split('@')[0] || '')}
            </div>
            {user?.email && <div className="profile-email">{user.email}</div>}
          </div>
          <button className="profile-close" onClick={onClose}>✕</button>
        </div>

        {user && !user.isAnonymous && (
          <>
            <div className="profile-section">
              <h3 className="playfair">מתכונים אחרונים</h3>
              {recipes.length === 0 ? (
                <p className="profile-empty">אין מתכונים שמורים עדיין</p>
              ) : (
                <div className="profile-recipes">
                  {recipes.map(r => (
                    <div key={r.id} className="profile-recipe-card">
                      <span className="profile-recipe-title">{r.title}</span>
                      <div className="profile-recipe-meta">
                        <span>{r.kosher === 'meat' ? '🔴' : r.kosher === 'dairy' ? '🔵' : '🟢'}</span>
                        {r.difficulty && <span>⭐ {r.difficulty}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="profile-section">
              <h3 className="playfair">{equipTitle}</h3>
              <div className="profile-equip-type">
                <button
                  className={`equip-type-btn ${profileEquipType === 'meat' ? 'active' : ''}`}
                  onClick={() => setProfileEquipType('meat')}
                >בשרי</button>
                <button
                  className={`equip-type-btn ${profileEquipType === 'dairy' ? 'active' : ''}`}
                  onClick={() => setProfileEquipType('dairy')}
                >חלבי</button>
              </div>
              <div className="equip-chips">
                {equipList.map(eq => (
                  <div
                    key={eq.id}
                    className={`chip ${profileEquip.includes(eq.id) ? 'on' : ''}`}
                    onClick={() => toggleEquip(eq.id)}
                  >
                    {eq.emoji} {eq.label}
                  </div>
                ))}
              </div>
              <button className="btn btn-save-equip" onClick={handleSaveEquip} disabled={saving}>
                {saving ? 'שומר...' : 'שמור ציוד'}
              </button>
            </div>
          </>
        )}

        {/* Pantry staples — available to all users */}
        <div className="profile-section">
          <h3 className="playfair">מה תמיד יש בבית?</h3>
          <p className="profile-section-sub">אלה יסומנו אוטומטית בכל פעם שתבחרו מרכיבים</p>
          <div className="pantry-chips">
            {PANTRY_ITEMS.map(item => (
              <div
                key={item.id}
                className={`chip ${localPantry.includes(item.id) ? 'on' : ''}`}
                onClick={() => togglePantry(item.id)}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div className="pantry-actions">
            <button className="btn btn-save-equip" onClick={handleSavePantry}>
              {pantrySaved ? '✓ נשמר!' : 'שמור'}
            </button>
            <button className="btn btn-reset-pantry" onClick={handleResetPantry}>
              אפס לברירת מחדל
            </button>
          </div>
        </div>

        {user && !user.isAnonymous && (
          <button className="btn btn-signout" onClick={handleSignOut}>
            התנתקות
          </button>
        )}
      </div>
    </div>
  );
}
