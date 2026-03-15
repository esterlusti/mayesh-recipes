import React, { useState, useRef } from 'react';
import { saveRecipe, saveRating } from '../firebase';
import { FileDown, Share2, BookmarkPlus, Check, RotateCcw, RefreshCw, ChefHat, ListChecks, Lightbulb, ShoppingCart, Utensils, Star, CookingPot } from 'lucide-react';

export default function RecipeResult({ recipe, user, kosherType, category, servings, difficulty, onRestart, onSelectOption, onAnotherRecipe, useGenderText }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [rating, setRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratedDone, setRatedDone] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const recipeRef = useRef(null);

  const restartText = useGenderText('התחל מחדש', 'התחילי מחדש');

  const isDual = recipe.trim().startsWith('OPTION: DUAL');

  const parseDualOptions = (text) => {
    const lines = text.split('\n');
    let optionATitle = '', optionADesc = '';
    let optionBTitle = '', optionBDesc = '';
    const shopping = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('OPTION_A_TITLE:')) optionATitle = trimmed.replace('OPTION_A_TITLE:', '').trim();
      if (trimmed.startsWith('OPTION_A_DESC:')) optionADesc = trimmed.replace('OPTION_A_DESC:', '').trim();
      if (trimmed.startsWith('OPTION_B_TITLE:')) optionBTitle = trimmed.replace('OPTION_B_TITLE:', '').trim();
      if (trimmed.startsWith('OPTION_B_DESC:')) optionBDesc = trimmed.replace('OPTION_B_DESC:', '').trim();
      if (trimmed.startsWith('- 🛒')) shopping.push(trimmed.replace(/^-\s*🛒\s*/, ''));
    }
    return { optionATitle, optionADesc, optionBTitle, optionBDesc, shopping };
  };

  const parseRecipe = (text) => {
    const lines = text.split('\n');
    let title = '', timePrep = '', timeCook = '', diff = '', tip = '';
    const ingredients = [];
    const steps = [];
    let section = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('TITLE:')) { title = trimmed.replace('TITLE:', '').trim(); continue; }
      if (trimmed.startsWith('TIME_PREP:')) { timePrep = trimmed.replace('TIME_PREP:', '').trim(); continue; }
      if (trimmed.startsWith('TIME_COOK:')) { timeCook = trimmed.replace('TIME_COOK:', '').trim(); continue; }
      if (trimmed.startsWith('DIFFICULTY:')) { diff = trimmed.replace('DIFFICULTY:', '').trim(); continue; }
      if (trimmed.startsWith('TIP:')) { tip = trimmed.replace('TIP:', '').trim(); continue; }
      if (trimmed === 'INGREDIENTS:') { section = 'ing'; continue; }
      if (trimmed === 'STEPS:') { section = 'steps'; continue; }
      if (section === 'ing' && trimmed) {
        ingredients.push(trimmed.replace(/^[-•*]\s*/, ''));
      }
      if (section === 'steps' && trimmed) {
        steps.push(trimmed.replace(/^\d+[.)]\s*/, ''));
      }
    }
    return { title, timePrep, timeCook, difficulty: diff, ingredients, steps, tip };
  };

  // Dual option view
  if (isDual) {
    const dual = parseDualOptions(recipe);
    return (
      <div className="recipe-result dual-options">
        <div className="recipe-header">
          <h2 className="playfair recipe-title">חסרים מרכיבים מרכזיים</h2>
          <p className="dual-intro">מצאנו שחסר לכם חומר גולמי חשוב למתכון שביקשתם. בחרו אחת מהאפשרויות:</p>
        </div>

        <div className="dual-cards">
          <div className="dual-card option-a" onClick={() => onSelectOption && onSelectOption('A')}>
            <div className="dual-card-badge"><Utensils size={14} /> ממה שיש</div>
            <h3 className="playfair dual-card-title">{dual.optionATitle}</h3>
            <p className="dual-card-desc">{dual.optionADesc}</p>
            <button className="btn btn-next dual-btn">{useGenderText('בחר', 'בחרי')} באפשרות זו</button>
          </div>

          <div className="dual-card option-b" onClick={() => onSelectOption && onSelectOption('B')}>
            <div className="dual-card-badge"><ShoppingCart size={14} /> עם קניות</div>
            <h3 className="playfair dual-card-title">{dual.optionBTitle}</h3>
            <p className="dual-card-desc">{dual.optionBDesc}</p>
            <div className="shopping-list">
              <h4>צריך לקנות:</h4>
              <ul>
                {dual.shopping.map((item, i) => (
                  <li key={i}><ShoppingCart size={13} /> {item}</li>
                ))}
              </ul>
            </div>
            <button className="btn btn-next dual-btn">{useGenderText('בחר', 'בחרי')} באפשרות זו</button>
          </div>
        </div>

        <button className="btn btn-restart" onClick={onRestart} style={{ marginTop: 20 }}>
          <RotateCcw size={15} /> {restartText}
        </button>
      </div>
    );
  }

  // Single recipe view
  const parsed = parseRecipe(recipe);

  const toggleStep = (i) => {
    setCheckedSteps(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const toggleIngredient = (i) => {
    setCheckedIngredients(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const allStepsDone = parsed.steps.length > 0 && parsed.steps.every((_, i) => checkedSteps[i]);

  const handleSave = async () => {
    if (!user || user.isAnonymous || saved) return;
    setSaving(true);
    try {
      await saveRecipe(user.uid, {
        title: parsed.title,
        category,
        kosher: kosherType,
        servings,
        difficulty: parsed.difficulty,
        fullText: recipe
      });
      setSaved(true);
    } catch (e) {
      console.error('Failed to save:', e);
    }
    setSaving(false);
  };

  const handleRating = async (stars) => {
    setRating(stars);
    setRatedDone(true);
    if (user) {
      try {
        await saveRating(user.uid, parsed.title, stars);
      } catch (e) {
        console.error('Failed to save rating:', e);
      }
    }
  };

  const handleDownloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const el = recipeRef.current;
    if (!el) return;

    // Temporarily switch to light mode for PDF and remove interactive mode
    const hadInteractive = el.classList.contains('interactive-mode');
    if (hadInteractive) el.classList.remove('interactive-mode');
    el.classList.add('pdf-mode');

    const actions = el.querySelector('.recipe-actions');
    const ratingSection = el.querySelector('.recipe-rating');
    const interactiveToggle = el.querySelector('.btn-interactive');
    const checkboxes = el.querySelectorAll('.step-checkbox, .ing-checkbox');
    const progressBar = el.querySelector('.steps-progress');
    if (actions) actions.style.display = 'none';
    if (ratingSection) ratingSection.style.display = 'none';
    if (interactiveToggle) interactiveToggle.style.display = 'none';
    if (progressBar) progressBar.style.display = 'none';
    checkboxes.forEach(cb => cb.style.display = 'none');

    await html2pdf().set({
      margin: [10, 10, 10, 10],
      filename: `${parsed.title || 'מתכון'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(el).save();

    el.classList.remove('pdf-mode');
    if (hadInteractive) el.classList.add('interactive-mode');
    if (actions) actions.style.display = '';
    if (ratingSection) ratingSection.style.display = '';
    if (interactiveToggle) interactiveToggle.style.display = '';
    if (progressBar) progressBar.style.display = '';
    checkboxes.forEach(cb => cb.style.display = '');
  };

  const handleShare = async () => {
    const shareText = `${parsed.title}\n\n🧾 מרכיבים:\n${parsed.ingredients.map(i => `• ${i}`).join('\n')}\n\n👩‍🍳 שלבי הכנה:\n${parsed.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}${parsed.tip ? `\n\n💡 טיפ: ${parsed.tip}` : ''}\n\nנוצר באפליקציית "מה יש בבית?"`;

    if (navigator.share) {
      try {
        await navigator.share({ title: parsed.title, text: shareText });
      } catch (e) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('המתכון הועתק ללוח!');
    }
  };

  const kosherLabel = kosherType === 'meat' ? 'בשרי' : kosherType === 'dairy' ? 'חלבי' : 'פרווה';

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercent = parsed.steps.length > 0 ? Math.round((completedCount / parsed.steps.length) * 100) : 0;

  return (
    <div className={`recipe-result ${interactiveMode ? 'interactive-mode' : ''}`} ref={recipeRef}>
      <div className="recipe-header">
        <h2 className="playfair recipe-title">{parsed.title || 'המתכון שלך'}</h2>
        <div className="recipe-meta">
          <span className="recipe-badge kosher-badge">{kosherLabel}</span>
          {parsed.timePrep && <span className="recipe-badge">הכנה: {parsed.timePrep}</span>}
          {parsed.timeCook && <span className="recipe-badge">בישול: {parsed.timeCook}</span>}
          {parsed.difficulty && <span className="recipe-badge">{parsed.difficulty}</span>}
        </div>
      </div>

      {/* Interactive mode toggle */}
      <button
        className={`btn btn-interactive ${interactiveMode ? 'active' : ''}`}
        onClick={() => setInteractiveMode(!interactiveMode)}
      >
        <CookingPot size={18} />
        {interactiveMode ? 'יציאה ממצב בישול' : 'מצב בישול אינטראקטיבי'}
      </button>

      {/* Ingredients */}
      <div className="recipe-section">
        <h3 className="playfair"><ListChecks size={18} /> מרכיבים</h3>
        <ul className="recipe-ingredients">
          {parsed.ingredients.map((ing, i) => (
            <li
              key={i}
              className={interactiveMode && checkedIngredients[i] ? 'checked' : ''}
              onClick={() => interactiveMode && toggleIngredient(i)}
            >
              <span className="ing-checkbox">
                {checkedIngredients[i] ? <Check size={16} /> : <span style={{width:16, height:16, display:'inline-block', borderRadius:4, border:'1.5px solid var(--text-30)'}} />}
              </span>
              <span className="ing-dot" />
              <span className={interactiveMode && checkedIngredients[i] ? 'line-through' : ''}>{ing}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="recipe-section">
        <h3 className="playfair"><ChefHat size={18} /> שלבי הכנה</h3>
        <div className="steps-progress">
          <div className="steps-progress-bar">
            <div className="steps-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="steps-progress-text">{completedCount}/{parsed.steps.length}</span>
        </div>
        <ol className={interactiveMode ? 'recipe-steps interactive-steps' : 'recipe-steps'}>
          {parsed.steps.map((step, i) => (
            interactiveMode ? (
              <li key={i} className={`interactive-step ${checkedSteps[i] ? 'step-done' : ''}`} onClick={() => toggleStep(i)}>
                <span className="step-checkbox">
                  {checkedSteps[i] ? <Check size={18} style={{color:'var(--teal)'}} /> : <span style={{width:18, height:18, display:'inline-block', borderRadius:5, border:'1.5px solid var(--text-30)'}} />}
                </span>
                <span className={checkedSteps[i] ? 'step-text-done' : ''}>{step}</span>
              </li>
            ) : (
              <li key={i}>{step}</li>
            )
          ))}
        </ol>
        {interactiveMode && allStepsDone && (
          <div className="all-done-banner">
            {useGenderText('סיימת!', 'סיימת!')} בתיאבון!
          </div>
        )}
      </div>

      {parsed.tip && (
        <div className="recipe-tip">
          <span className="tip-icon"><Lightbulb size={16} /></span>
          <span>{parsed.tip}</span>
        </div>
      )}

      {/* Star Rating */}
      <div className="recipe-rating">
        <h3 className="playfair">איך היה? דרגו את המתכון</h3>
        <div className="stars-row">
          {[1, 2, 3, 4, 5].map(s => (
            <span
              key={s}
              className={`star ${s <= (ratingHover || rating) ? 'star-filled' : ''}`}
              onClick={() => !ratedDone && handleRating(s)}
              onMouseEnter={() => !ratedDone && setRatingHover(s)}
              onMouseLeave={() => !ratedDone && setRatingHover(0)}
            >
              <Star size={28} fill={s <= (ratingHover || rating) ? 'currentColor' : 'none'} />
            </span>
          ))}
        </div>
        {ratedDone && <p className="rating-thanks">תודה על הדירוג!</p>}
      </div>

      {/* Action buttons */}
      <div className="recipe-actions">
        {onAnotherRecipe && (
          <button className="btn btn-another" onClick={onAnotherRecipe}>
            <RefreshCw size={15} /> מתכון אחר
          </button>
        )}
        <button className="btn btn-pdf" onClick={handleDownloadPDF}>
          <FileDown size={15} /> הורדה כ-PDF
        </button>
        <button className="btn btn-share" onClick={handleShare}>
          <Share2 size={15} /> שיתוף
        </button>
        {user && !user.isAnonymous && (
          <button
            className={`btn btn-save ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={saving || saved}
          >
            {saved ? <><Check size={15} /> נשמר!</> : saving ? <><BookmarkPlus size={15} /> שומר...</> : <><BookmarkPlus size={15} /> שמור</>}
          </button>
        )}
        <button className="btn btn-restart" onClick={onRestart}>
          <RotateCcw size={15} /> {restartText}
        </button>
      </div>
    </div>
  );
}
