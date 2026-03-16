import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { doSignOut, getRecentRecipes, deleteRecipe, saveUserDoc, signInGoogle } from '../firebase';
import toast from 'react-hot-toast';
import { EQUIPMENT } from '../data/equipment';
import { VEGETABLES, SPICES } from '../data/ingredients';
import { SAUCES } from '../data/sauces';
import { PANTRY_DEFAULTS } from '../data/pantryDefaults';
import RecipePopup from './RecipePopup';

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
  const [openSections, setOpenSections] = useState({});
  const [viewRecipe, setViewRecipe] = useState(null);
  const panelRef = useRef();

  const equipTitle = useGenderText('הציוד שלי', 'הציוד שלי');

  useEffect(() => {
    setLocalPantry(pantryStaples);
  }, [pantryStaples]);

  useEffect(() => {
    if (open && user && !user.isAnonymous) {
      getRecentRecipes(user.uid).then(setRecipes).catch(console.error);
    }
    if (open) {
      setOpenSections({});
      setViewRecipe(null);
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

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  const handleDeleteRecipe = async (recipeId) => {
    if (!user || user.isAnonymous) return;
    try {
      await deleteRecipe(user.uid, recipeId);
      setRecipes(prev => prev.filter(r => r.id !== recipeId));
      toast.success('המתכון נמחק');
    } catch (e) {
      console.error(e);
      toast.error('מחיקה נכשלה');
    }
  };

  const equipList = [
    ...(EQUIPMENT[profileEquipType] || []),
    ...EQUIPMENT.general
  ];

  const handleGoogleSignIn = async () => {
    try { await signInGoogle(); onClose(); }
    catch (e) { console.error(e); toast.error('כניסה עם Google נכשלה'); }
  };

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
              : <span className="profile-avatar-placeholder"><ChefHat size={24} strokeWidth={2} /></span>
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
              <h3 className="playfair profile-section-header" onClick={() => toggleSection('recipes')}>
                <span>מתכונים אחרונים</span>
                {openSections.recipes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </h3>
              {openSections.recipes && (
                <div className="profile-section-content">
                  {recipes.length === 0 ? (
                    <p className="profile-empty">אין מתכונים שמורים עדיין</p>
                  ) : (
                    <div className="profile-recipes">
                      {recipes.map(r => (
                        <div key={r.id} className="profile-recipe-card" onClick={() => setViewRecipe(r)}>
                          <span className="profile-recipe-title">{r.title}</span>
                          <div className="profile-recipe-meta">
                            <span>{r.kosher === 'meat' ? '🔴' : r.kosher === 'dairy' ? '🔵' : '🟢'}</span>
                            {r.difficulty && <span>⭐ {r.difficulty}</span>}
                            <button className="recipe-delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteRecipe(r.id); }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="profile-section">
              <h3 className="playfair profile-section-header" onClick={() => toggleSection('equipment')}>
                <span>{equipTitle}</span>
                {openSections.equipment ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </h3>
              {openSections.equipment && (
                <div className="profile-section-content">
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
              )}
            </div>
          </>
        )}

        {/* Pantry staples — available to all users */}
        <div className="profile-section">
          <h3 className="playfair profile-section-header" onClick={() => toggleSection('pantry')}>
            <span>מה תמיד יש בבית?</span>
            {openSections.pantry ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </h3>
          {openSections.pantry && (
            <div className="profile-section-content">
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
          )}
        </div>

        {user?.isAnonymous && (
          <div className="profile-section profile-guest-login">
            <p className="profile-empty">התחבר/י כדי לשמור מתכונים וציוד</p>
            <button className="auth-btn google-btn" onClick={handleGoogleSignIn}>
              <span className="auth-btn-icon">G</span>
              התחברות עם Google
            </button>
          </div>
        )}

        {user && !user.isAnonymous && (
          <button className="btn btn-signout" onClick={handleSignOut}>
            התנתקות
          </button>
        )}
      </div>

      {viewRecipe && <RecipePopup recipe={viewRecipe} onClose={() => setViewRecipe(null)} />}
    </div>
  );
}
