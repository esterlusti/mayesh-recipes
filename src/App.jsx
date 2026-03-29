import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { CookingPot } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { useGender } from './hooks/useGender';
import { useUserData } from './hooks/useUserData';
import { usePantryStaples } from './hooks/usePantryStaples';
import { useAdmin } from './hooks/useAdmin';
import AuthBar from './components/AuthBar';
import AuthModal from './components/AuthModal';
import OnboardingTour from './components/OnboardingTour';
import GenderSelect from './components/GenderSelect';
import ProgressBar from './components/ProgressBar';
import ContactFooter from './components/ContactFooter';
import Step1Kosher from './steps/Step1Kosher';
import Step2Equipment from './steps/Step2Equipment';
import Step3Category from './steps/Step3Category';
import Step4DishType from './steps/Step4DishType';
import Step5Ingredients from './steps/Step5Ingredients';
import Step6Settings from './steps/Step6Settings';
import Step6Recipe from './steps/Step6Recipe';
import StepQuick from './steps/StepQuick';
import { Toaster } from 'react-hot-toast';
import { EQUIPMENT } from './data/equipment';
import { getAuthRedirectResult, signInGoogle } from './firebase';

const ProfilePanel = lazy(() => import('./components/ProfilePanel'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));

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
  const { isAdmin } = useAdmin(user);

  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [step, setStep] = useState(1);
  const [page, setPage] = useState('recipe'); // 'recipe' | 'about' | 'contact'
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    getAuthRedirectResult().catch(e => console.error('Auth redirect error:', e));
  }, []);

  // Show tour on first visit or for anonymous users (once per session)
  useEffect(() => {
    if (!user) return;
    const key = user.isAnonymous ? 'tour_guest_shown' : `tour_shown_${user.uid}`;
    if (!sessionStorage.getItem(key)) {
      const t = setTimeout(() => setShowTour(true), 800);
      sessionStorage.setItem(key, '1');
      return () => clearTimeout(t);
    }
  }, [user?.uid, user?.isAnonymous]);

  useEffect(() => {
    let cancelled = false;
    const checkHealth = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch('/api/health');
          const data = await res.json();
          if (!cancelled) {
            if (data.ok) { setApiError(null); return; }
          }
        } catch {}
        if (i < retries - 1) await new Promise(r => setTimeout(r, 5000));
      }
      if (!cancelled) setApiError('לא ניתן להתחבר לשרת. נסו שוב מאוחר יותר.');
    };
    checkHealth();
    return () => { cancelled = true; };
  }, []);

  // Step data
  const [kosherType, setKosherType] = useState(null);
  const [pareveEquipType, setPareveEquipType] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [category, setCategory] = useState(null);
  const [dishType, setDishType] = useState(null);
  const [pendingIngredients, setPendingIngredients] = useState(null);

  // Recipe state
  const [recipe, setRecipe] = useState(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeError, setRecipeError] = useState(null);
  const [recipeServings, setRecipeServings] = useState(4);
  const [recipeDifficulty, setRecipeDifficulty] = useState('medium');
  const [lastRequestData, setLastRequestData] = useState(null);
  const [quickMode, setQuickMode] = useState(false);

  const fetchRecipe = useCallback(async (payload) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'שגיאה בשרת');
      return result.recipe;
    } catch (e) {
      clearTimeout(timeout);
      if (e.name === 'AbortError') throw new Error('הבקשה ארכה יותר מדי זמן, נסו שוב');
      throw e;
    }
  }, []);

  // Resolve equipment labels for API
  const getEquipmentLabels = useCallback(() => {
    const effectiveType = kosherType === 'pareve' ? pareveEquipType : kosherType;
    const allEquip = [...(EQUIPMENT[effectiveType] || []), ...EQUIPMENT.general];
    return equipment.map(id => {
      const found = allEquip.find(e => e.id === id);
      return found ? found.label : id;
    });
  }, [kosherType, pareveEquipType, equipment]);

  const handleKosherSelect = useCallback((type, pareveEquip) => {
    setKosherType(type);
    setPareveEquipType(pareveEquip);
    if (user && !user.isAnonymous && savedEquipment.length > 0) {
      const effectiveType = type === 'pareve' ? pareveEquip : type;
      if (savedEquipmentType === effectiveType) {
        setEquipment(savedEquipment);
      }
    }
    setStep(2);
  }, [user, savedEquipment, savedEquipmentType]);

  const handleQuickMode = useCallback((type, pareveEquip) => {
    setKosherType(type);
    setPareveEquipType(pareveEquip);
    setQuickMode(true);
    if (user && !user.isAnonymous && savedEquipment.length > 0) {
      const effectiveType = type === 'pareve' ? pareveEquip : type;
      if (savedEquipmentType === effectiveType) {
        setEquipment(savedEquipment);
      }
    }
    setStep('quick');
  }, [user, savedEquipment, savedEquipmentType]);

  const handleCategorySelect = useCallback((cat) => {
    setCategory(cat);
    setStep(4);
  }, []);

  const handleDishSelect = useCallback((dish) => {
    setDishType(dish);
    setStep(5);
  }, []);

  const handleIngredientsNext = useCallback((ingredientData) => {
    setPendingIngredients(ingredientData);
    setStep(6);
  }, []);

  const handleGenerate = useCallback(async (data) => {
    const mergedData = pendingIngredients ? { ...pendingIngredients, ...data } : data;
    setRecipeServings(mergedData.servings);
    setRecipeDifficulty(mergedData.difficulty);
    setStep(7);
    setRecipeLoading(true);
    setRecipeError(null);
    setRecipe(null);

    const requestPayload = {
      category: category?.name || '',
      kosherType,
      equipmentType: pareveEquipType,
      dishType,
      proteins: mergedData.proteins,
      carbs: mergedData.carbs,
      sauces: mergedData.sauces,
      vegetables: mergedData.vegetables,
      spices: mergedData.spices,
      staples: mergedData.staples,
      customProteins: mergedData.customProteins,
      customCarbs: mergedData.customCarbs,
      customVegetables: mergedData.customVegetables,
      customSauces: mergedData.customSauces,
      customSpices: mergedData.customSpices,
      customStaples: mergedData.customStaples,
      equipment: getEquipmentLabels(),
      servings: mergedData.servings,
      recipeIdea: mergedData.recipeIdea,
      difficulty: mergedData.difficulty,
      recipeStyle: mergedData.recipeStyle,
      maxMinutes: mergedData.maxMinutes
    };
    setLastRequestData(requestPayload);

    try {
      setRecipe(await fetchRecipe(requestPayload));
    } catch (e) {
      setRecipeError(e.message || 'שגיאה לא צפויה');
    }
    setRecipeLoading(false);
  }, [pendingIngredients, category, kosherType, pareveEquipType, dishType, fetchRecipe, getEquipmentLabels]);

  const handleSelectOption = useCallback(async (option) => {
    if (!lastRequestData) return;
    setRecipeLoading(true);
    setRecipeError(null);
    setRecipe(null);

    try {
      let recipeText = await fetchRecipe({ ...lastRequestData, selectedOption: option });

      if (recipeText.trim().startsWith('OPTION: DUAL')) {
        recipeText = await fetchRecipe({
          ...lastRequestData,
          selectedOption: option,
          forceSingle: true
        });
      }

      if (recipeText.trim().startsWith('OPTION: DUAL')) {
        throw new Error('לא הצלחנו לטעון מתכון, אנא נסו שוב');
      }

      setRecipe(recipeText);
    } catch (e) {
      setRecipeError(e.message || 'שגיאה לא צפויה');
    }
    setRecipeLoading(false);
  }, [lastRequestData, fetchRecipe]);

  const handleAnotherRecipe = useCallback(async () => {
    if (!lastRequestData) return;
    setRecipeLoading(true);
    setRecipeError(null);
    setRecipe(null);

    try {
      setRecipe(await fetchRecipe(lastRequestData));
    } catch (e) {
      setRecipeError(e.message || 'שגיאה לא צפויה');
    }
    setRecipeLoading(false);
  }, [lastRequestData, fetchRecipe]);

  const handleRestart = useCallback(() => {
    setStep(1);
    setKosherType(null);
    setPareveEquipType(null);
    setEquipment([]);
    setCategory(null);
    setDishType(null);
    setRecipe(null);
    setRecipeError(null);
    setQuickMode(false);
    setPendingIngredients(null);
  }, []);

  const handleNavChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Show auth modal if no user
  if (authLoading) {
    return (
      <div className="app-loading">
        <div className="loading-pot"><CookingPot size={52} strokeWidth={1.5} /></div>
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
        <div className="hero-welcome">
          <img src="/logo.png" alt="מה יש לך בבית" className="welcome-logo" />
          <h1 className="hero-title welcome-hero-title">מה יש לך<br /><em>בבית?</em></h1>
          <p className="hero-joke welcome-hero-joke"><span className="hero-joke-brace">&#123;</span> חוץ מאסוך שמן <span className="hero-joke-brace">&#125;</span></p>
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
      <GenderSelect onSelect={setGender} />
    );
  }

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: '#1A1A1A', color: '#fff', border: '1px solid #333', borderRadius: '8px', fontSize: '14px', fontFamily: "'Heebo', sans-serif" },
          success: { iconTheme: { primary: '#e85d04', secondary: '#fff' } },
        }}
      />
      <AuthBar
        user={user}
        onAvatarClick={() => setShowProfile(true)}
        onAdminClick={() => setShowAdmin(true)}
        useGenderText={useGenderText}
        isAdmin={isAdmin}
        page={page}
        onPageChange={handleNavChange}
      />


      <Suspense fallback={null}>
        <ProfilePanel
          user={user}
          open={showProfile}
          onClose={() => setShowProfile(false)}
          useGenderText={useGenderText}
          pantryStaples={pantryStaples}
          onPantryChange={setPantryStaples}
        />
      </Suspense>

      {isAdmin && (
        <Suspense fallback={null}>
          <AdminPanel
            open={showAdmin}
            onClose={() => setShowAdmin(false)}
            user={user}
          />
        </Suspense>
      )}

      {apiError && (
        <div className="api-error-banner">
          <span>⚠️ {apiError}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {page === 'about' && (
          <motion.main
            key="about"
            className="main-content page-content page-transition-wrap"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <Suspense fallback={null}>
              <AboutPage isAdmin={isAdmin} />
            </Suspense>
          </motion.main>
        )}

        {page === 'contact' && (
          <motion.main
            key="contact"
            className="main-content page-content page-transition-wrap"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <Suspense fallback={null}>
              <ContactPage user={user} />
            </Suspense>
          </motion.main>
        )}
      </AnimatePresence>

      {page === 'recipe' && (
        <main className="main-content" style={{ paddingTop: 85 }}>
          {step === 1 && (
            <section className="hero">
              <img src="/logo.png" alt="מה יש לך בבית" className="hero-logo" />
              <p className="hero-joke"><span className="hero-joke-brace">&#123;</span> חוץ מאסוך שמן <span className="hero-joke-brace">&#125;</span></p>
              <p className="hero-sub">מתכון בהתאמה אישית לפי הרכיבים הקיימים בבית</p>
            </section>
          )}

          {step !== 'quick' && step < 7 && <ProgressBar current={step} total={6} />}

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
                {step === 1 && <Step1Kosher onSelect={handleKosherSelect} onQuickMode={handleQuickMode} />}
                {step === 'quick' && <StepQuick onGenerate={handleGenerate} useGenderText={useGenderText} />}
                {step === 2 && (
                  <Step2Equipment
                    kosherType={kosherType}
                    pareveEquipType={pareveEquipType}
                    equipment={equipment}
                    setEquipment={setEquipment}
                    onNext={() => setStep(3)}
                    useGenderText={useGenderText}
                    preloadedFromProfile={!user?.isAnonymous && savedEquipment.length > 0 && savedEquipmentType === (kosherType === 'pareve' ? pareveEquipType : kosherType)}
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
                    onNext={handleIngredientsNext}
                    useGenderText={useGenderText}
                    pantryStaples={pantryStaples}
                    savedIngredients={pendingIngredients}
                  />
                )}
                {step === 6 && (
                  <Step6Settings
                    onGenerate={handleGenerate}
                    useGenderText={useGenderText}
                  />
                )}
                {step === 7 && (
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

          {((step > 1 && step < 7) || step === 'quick') && (
            <button className="btn btn-back" onClick={() => {
              if (step === 'quick') { setQuickMode(false); setStep(1); }
              else setStep(s => s - 1);
            }}>
              → חזרה
            </button>
          )}
        </main>
      )}

      <ContactFooter user={user} onContactClick={() => setPage('contact')} />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} useGenderText={useGenderText} isAnonymous={!!user?.isAnonymous} />}
      {showTour && <OnboardingTour onClose={() => setShowTour(false)} useGenderText={useGenderText} />}
    </>
  );
}
