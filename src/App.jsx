import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { useGender } from './hooks/useGender';
import { useUserData } from './hooks/useUserData';
import { usePantryStaples } from './hooks/usePantryStaples';
import AuthBar from './components/AuthBar';
import AuthModal from './components/AuthModal';
import GenderSelect from './components/GenderSelect';
import ProfilePanel from './components/ProfilePanel';
import ProgressBar from './components/ProgressBar';
import ContactFooter from './components/ContactFooter';
import Step1Kosher from './steps/Step1Kosher';
import Step2Equipment from './steps/Step2Equipment';
import Step3Category from './steps/Step3Category';
import Step4DishType from './steps/Step4DishType';
import Step5Ingredients from './steps/Step5Ingredients';
import Step6Recipe from './steps/Step6Recipe';
import { EQUIPMENT } from './data/equipment';
import { getAuthRedirectResult } from './firebase';

const stepVariants = {
  enter: { opacity: 0, x: -30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { gender, setGender, genderLoaded, useGenderText } = useGender(user);
  const { savedEquipment, savedEquipmentType } = useUserData(user);
  const { pantryStaples, setPantryStaples } = usePantryStaples(user);

  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    getAuthRedirectResult().catch(e => console.error('Auth redirect error:', e));
  }, []);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (!data.ok) setApiError('שירות המתכונים אינו זמין כרגע. נסו שוב מאוחר יותר.');
      })
      .catch(() => setApiError('לא ניתן להתחבר לשרת. נסו שוב מאוחר יותר.'));
  }, []);

  // Step data
  const [kosherType, setKosherType] = useState(null);
  const [pareveEquipType, setPareveEquipType] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [category, setCategory] = useState(null);
  const [dishType, setDishType] = useState(null);

  // Recipe state
  const [recipe, setRecipe] = useState(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeError, setRecipeError] = useState(null);
  const [recipeServings, setRecipeServings] = useState(4);
  const [recipeDifficulty, setRecipeDifficulty] = useState('medium');
  const [lastRequestData, setLastRequestData] = useState(null);

  // Show auth modal if no user
  if (authLoading) {
    return (
      <div className="app-loading">
        <div className="loading-pot">🍳</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {apiError && (
          <div className="api-error-banner">
            <span>⚠️ {apiError}</span>
          </div>
        )}
        <div className="blobs">
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
        </div>
        <div className="hero-welcome">
          <h1 className="welcome-main-title">מה יש</h1>
          <h2 className="welcome-second-title">לך בבית?</h2>
          <p className="welcome-joke">{`{חוץ מאסוך שמן}`}</p>
          <p className="welcome-tagline">מתכונים בהתאמה אישית</p>

          <div className="welcome-features">
            <div className="welcome-feature">
              <span className="feature-icon">🍳</span>
              <span className="feature-text">מתכונים מותאמים אישית</span>
            </div>
            <div className="welcome-feature">
              <span className="feature-icon">⏱️</span>
              <span className="feature-text">מוכן תוך דקות</span>
            </div>
            <div className="welcome-feature">
              <span className="feature-icon">🛒</span>
              <span className="feature-text">רשימת קניות חכמה</span>
            </div>
          </div>

          <button className="btn btn-start" onClick={() => setShowAuth(true)}>
            בואו נתחיל לבשל →
          </button>

          <p className="welcome-footer">הרשמה חינמית • ללא כרטיס אשראי</p>
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </>
    );
  }

  // Show gender select once
  if (genderLoaded && !gender) {
    return (
      <>
        <div className="blobs">
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
        </div>
        <GenderSelect onSelect={setGender} />
      </>
    );
  }

  // Resolve equipment labels for API
  const getEquipmentLabels = () => {
    const effectiveType = kosherType === 'pareve' ? pareveEquipType : kosherType;
    const allEquip = [...(EQUIPMENT[effectiveType] || []), ...EQUIPMENT.general];
    return equipment.map(id => {
      const found = allEquip.find(e => e.id === id);
      return found ? found.label : id;
    });
  };

  const handleKosherSelect = (type, pareveEquip) => {
    setKosherType(type);
    setPareveEquipType(pareveEquip);
    // Pre-load saved equipment if matching
    if (user && !user.isAnonymous && savedEquipment.length > 0) {
      const effectiveType = type === 'pareve' ? pareveEquip : type;
      if (savedEquipmentType === effectiveType) {
        setEquipment(savedEquipment);
      }
    }
    setStep(2);
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setStep(4);
  };

  const handleDishSelect = (dish) => {
    setDishType(dish);
    setStep(5);
  };

  const handleGenerate = async (data) => {
    setRecipeServings(data.servings);
    setRecipeDifficulty(data.difficulty);
    setStep(6);
    setRecipeLoading(true);
    setRecipeError(null);
    setRecipe(null);

    const requestPayload = {
      category: category?.name || '',
      kosherType,
      equipmentType: pareveEquipType,
      dishType,
      proteins: data.proteins,
      sauces: data.sauces,
      vegetables: data.vegetables,
      spices: data.spices,
      extrasProteins: data.extrasProteins,
      extrasSauces: data.extrasSauces,
      extrasVegetables: data.extrasVegetables,
      extrasSpices: data.extrasSpices,
      equipment: getEquipmentLabels(),
      servings: data.servings,
      recipeIdea: data.recipeIdea,
      difficulty: data.difficulty,
      maxMinutes: data.maxMinutes
    };
    setLastRequestData(requestPayload);

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'שגיאה בשרת');
      setRecipe(result.recipe);
    } catch (e) {
      setRecipeError(e.message || 'שגיאה לא צפויה');
    }
    setRecipeLoading(false);
  };

  const handleSelectOption = async (option) => {
    if (!lastRequestData) return;
    setRecipeLoading(true);
    setRecipeError(null);
    setRecipe(null);

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lastRequestData, selectedOption: option })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'שגיאה בשרת');
      setRecipe(result.recipe);
    } catch (e) {
      setRecipeError(e.message || 'שגיאה לא צפויה');
    }
    setRecipeLoading(false);
  };

  const handleAnotherRecipe = async () => {
    if (!lastRequestData) return;
    setRecipeLoading(true);
    setRecipeError(null);
    setRecipe(null);

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lastRequestData)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'שגיאה בשרת');
      setRecipe(result.recipe);
    } catch (e) {
      setRecipeError(e.message || 'שגיאה לא צפויה');
    }
    setRecipeLoading(false);
  };

  const handleRestart = () => {
    setStep(1);
    setKosherType(null);
    setPareveEquipType(null);
    setEquipment([]);
    setCategory(null);
    setDishType(null);
    setRecipe(null);
    setRecipeError(null);
  };

  return (
    <>
      <div className="blobs">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>

      <AuthBar
        user={user}
        onAvatarClick={() => setShowProfile(true)}
        useGenderText={useGenderText}
      />

      {user?.isAnonymous && (
        <div className="guest-banner">
          <span className="guest-banner-text">
            <strong>גולש/ת כאורח</strong> — התחברו כדי לשמור מתכונים ולסנכרן בין מכשירים
          </span>
          <button className="guest-banner-btn" onClick={() => setShowAuth(true)}>
            התחברות / הרשמה
          </button>
        </div>
      )}

      <ProfilePanel
        user={user}
        open={showProfile}
        onClose={() => setShowProfile(false)}
        useGenderText={useGenderText}
        pantryStaples={pantryStaples}
        onPantryChange={setPantryStaples}
      />

      {apiError && (
        <div className="api-error-banner">
          <span>⚠️ {apiError}</span>
        </div>
      )}

      <main className="main-content">
        {/* Hero */}
        <section className="hero">
          <div className="hero-deco">בישול ביתי &nbsp;•&nbsp; בהתאמה אישית</div>
          <h1 className="playfair hero-title">מה יש לך<br /><em>בבית?</em></h1>
          <p className="hero-sub">ספרו לנו מה יש לכם במקרר ובמזווה —<br />נמציא לכם מתכון שאפשר להכין עכשיו</p>
          <p className="hero-joke">*חוץ מאסוך שמן</p>
        </section>

        <ProgressBar current={step} />

        <div className="steps-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 1 && <Step1Kosher onSelect={handleKosherSelect} useGenderText={useGenderText} />}
              {step === 2 && (
                <Step2Equipment
                  kosherType={kosherType}
                  pareveEquipType={pareveEquipType}
                  equipment={equipment}
                  setEquipment={setEquipment}
                  onNext={() => setStep(3)}
                  useGenderText={useGenderText}
                />
              )}
              {step === 3 && (
                <Step3Category
                  kosherType={kosherType}
                  onSelect={handleCategorySelect}
                />
              )}
              {step === 4 && (
                <Step4DishType
                  category={category}
                  onSelect={handleDishSelect}
                />
              )}
              {step === 5 && (
                <Step5Ingredients
                  kosherType={kosherType}
                  onGenerate={handleGenerate}
                  useGenderText={useGenderText}
                  pantryStaples={pantryStaples}
                />
              )}
              {step === 6 && (
                <Step6Recipe
                  recipe={recipe}
                  loading={recipeLoading}
                  error={recipeError}
                  user={user}
                  kosherType={kosherType}
                  category={category?.name}
                  servings={recipeServings}
                  difficulty={recipeDifficulty}
                  onRestart={handleRestart}
                  onSelectOption={handleSelectOption}
                  onAnotherRecipe={handleAnotherRecipe}
                  useGenderText={useGenderText}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {step > 1 && step < 6 && (
          <button className="btn btn-back" onClick={() => setStep(s => s - 1)}>
            → חזרה
          </button>
        )}
      </main>

      <ContactFooter user={user} />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} useGenderText={useGenderText} />}
    </>
  );
}
