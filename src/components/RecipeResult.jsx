import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { saveRecipe, saveRating } from '../firebase';
import { FileDown, Share2, BookmarkPlus, Check, RotateCcw, RefreshCw, ChefHat, ListChecks, Lightbulb, ShoppingCart, Utensils, Star, CookingPot, Mail, MessageCircle, Copy, X, Link, Printer } from 'lucide-react';

export default function RecipeResult({ recipe, user, kosherType, category, servings, difficulty, onRestart, onSelectOption, onAnotherRecipe, useGenderText }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [rating, setRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratedDone, setRatedDone] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
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
    let title = '', timePrep = '', timeCook = '', diff = '', tip = '', serving = '';
    const ingredients = [];
    const steps = [];
    let section = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('TITLE:')) { title = trimmed.replace('TITLE:', '').trim(); continue; }
      if (trimmed.startsWith('TIME_PREP:')) { timePrep = trimmed.replace('TIME_PREP:', '').trim(); continue; }
      if (trimmed.startsWith('TIME_COOK:')) { timeCook = trimmed.replace('TIME_COOK:', '').trim(); continue; }
      if (trimmed.startsWith('DIFFICULTY:')) { diff = trimmed.replace('DIFFICULTY:', '').trim(); continue; }
      if (trimmed.startsWith('SERVING:')) { serving = trimmed.replace('SERVING:', '').trim(); continue; }
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
    return { title, timePrep, timeCook, difficulty: diff, ingredients, steps, serving, tip };
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
        title: parsed.title || 'מתכון ללא שם',
        category,
        kosher: kosherType,
        servings,
        difficulty: parsed.difficulty,
        fullText: recipe
      });
      setSaved(true);
      toast.success('המתכון נשמר!');
    } catch (e) {
      console.error('Failed to save recipe:', e.code, e.message, e);
      toast.error('שמירה נכשלה — בדקי הרשאות Firestore');
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
    const kosherLbl = kosherType === 'meat' ? 'בשרי' : kosherType === 'dairy' ? 'חלבי' : 'פרווה';

    const badge = (text, color = '#555') =>
      `<span style="display:inline-block;background:#f5f5f5;border:1px solid #ddd;color:${color};padding:3px 10px;font-size:12px;font-weight:700;border-radius:3px;margin:2px 3px;">${text}</span>`;

    const htmlContent = `
      <div dir="rtl" style="font-family:'Arial',sans-serif;color:#111;padding:28px 32px;direction:rtl;line-height:1.6;">

        <div style="text-align:center;border-bottom:3px solid #111;padding-bottom:18px;margin-bottom:24px;">
          <div style="font-size:11px;color:#aaa;letter-spacing:1px;margin-bottom:8px;">מה יש בבית?</div>
          <h1 style="font-size:26px;font-weight:900;margin:0 0 12px;">${parsed.title || 'מתכון'}</h1>
          <div>
            ${badge(kosherLbl, '#e85d04')}
            ${parsed.timePrep ? badge('הכנה: ' + parsed.timePrep) : ''}
            ${parsed.timeCook ? badge('בישול: ' + parsed.timeCook) : ''}
            ${parsed.difficulty ? badge(parsed.difficulty) : ''}
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <h2 style="font-size:15px;font-weight:900;border-bottom:2px solid #111;padding-bottom:6px;margin-bottom:14px;">מרכיבים</h2>
          <table style="width:100%;border-collapse:collapse;">
            ${parsed.ingredients.map((ing, i) => `
              <tr style="border-bottom:1px solid #eee;">
                <td style="padding:6px 0;font-size:14px;vertical-align:middle;">
                  <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#e85d04;margin-left:10px;vertical-align:middle;"></span>${ing}
                </td>
              </tr>`).join('')}
          </table>
        </div>

        <div style="margin-bottom:24px;">
          <h2 style="font-size:15px;font-weight:900;border-bottom:2px solid #111;padding-bottom:6px;margin-bottom:14px;">שלבי הכנה</h2>
          <table style="width:100%;border-collapse:collapse;">
            ${parsed.steps.map((step, i) => `
              <tr style="border-bottom:1px solid #eee;">
                <td style="padding:8px 0;vertical-align:top;font-weight:900;font-size:16px;color:#e85d04;width:28px;text-align:right;">${i + 1}</td>
                <td style="padding:8px 0 8px 8px;font-size:14px;line-height:1.75;">${step}</td>
              </tr>`).join('')}
          </table>
        </div>

        ${parsed.serving ? `
          <div style="background:#f0f7ff;border:1px solid #c0d9f0;border-right:4px solid #5b9bd5;padding:12px 14px;margin-bottom:12px;">
            <strong style="font-size:13px;">🍽️ הצעת הגשה: </strong><span style="font-size:13px;">${parsed.serving}</span>
          </div>` : ''}

        ${parsed.tip ? `
          <div style="background:#fffbf0;border:1px solid #e8d9a0;border-right:4px solid #f5b731;padding:12px 14px;margin-bottom:20px;">
            <strong style="font-size:13px;">💡 טיפ: </strong><span style="font-size:13px;">${parsed.tip}</span>
          </div>` : ''}

        <div style="text-align:center;color:#bbb;font-size:10px;margin-top:24px;padding-top:12px;border-top:1px solid #eee;">
          נוצר באפליקציית "מה יש בבית?"
        </div>
      </div>`;

    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.cssText = 'position:fixed;top:0;left:-9999px;width:794px;background:white;';
    document.body.appendChild(container);
    await new Promise(r => setTimeout(r, 300));

    await html2pdf().set({
      margin: [0, 0, 0, 0],
      filename: `${parsed.title || 'מתכון'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff', windowWidth: 794, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(container).save();

    document.body.removeChild(container);
  };

  const getShareText = () => {
    return `${parsed.title}\n\n🧾 מרכיבים:\n${parsed.ingredients.map(i => `• ${i}`).join('\n')}\n\n👩‍🍳 שלבי הכנה:\n${parsed.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}${parsed.serving ? `\n\n🍽️ הצעת הגשה: ${parsed.serving}` : ''}${parsed.tip ? `\n\n💡 טיפ: ${parsed.tip}` : ''}\n\nנוצר באפליקציית "מה יש בבית?"`;
  };

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(getShareText());
    setCopied(true);
    toast.success('הועתק ללוח!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(getShareText())}`, '_blank');
  };

  const handleShareGmail = () => {
    window.open(`https://mail.google.com/mail/?view=cm&su=${encodeURIComponent(parsed.title)}&body=${encodeURIComponent(getShareText())}`, '_blank');
  };

  const handleShareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(parsed.title)}&body=${encodeURIComponent(getShareText())}`;
  };

  const handleShareTelegram = () => {
    window.open(`https://t.me/share/url?text=${encodeURIComponent(getShareText())}`, '_blank');
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
          <>
            <Confetti recycle={false} numberOfPieces={220} gravity={0.25} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }} />
            <div className="all-done-banner">
              {useGenderText('סיימת!', 'סיימת!')} בתיאבון!
            </div>
          </>
        )}
      </div>

      {parsed.serving && (
        <div className="recipe-tip recipe-serving">
          <span className="tip-icon">🍽️</span>
          <span><strong>הצעת הגשה:</strong> {parsed.serving}</span>
        </div>
      )}

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
        <button className="btn btn-print" onClick={() => window.print()}>
          <Printer size={15} /> הדפסה
        </button>
        <button className="btn btn-share" onClick={() => setShowShareModal(true)}>
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-card share-modal" onClick={e => e.stopPropagation()}>
            <button className="share-modal-close" onClick={() => setShowShareModal(false)}>
              <X size={18} />
            </button>
            <h2 className="modal-title playfair">שיתוף המתכון</h2>
            <p className="modal-sub">שתפו את &quot;{parsed.title}&quot;</p>

            <div className="share-options">
              <button className="share-option whatsapp" onClick={handleShareWhatsApp}>
                <span className="share-option-icon">
                  <MessageCircle size={22} />
                </span>
                <span className="share-option-label">וואטסאפ</span>
              </button>

              <button className="share-option gmail" onClick={handleShareGmail}>
                <span className="share-option-icon">
                  <Mail size={22} />
                </span>
                <span className="share-option-label">Gmail</span>
              </button>

              <button className="share-option email" onClick={handleShareEmail}>
                <span className="share-option-icon">
                  <Mail size={22} />
                </span>
                <span className="share-option-label">אימייל</span>
              </button>

              <button className="share-option telegram" onClick={handleShareTelegram}>
                <span className="share-option-icon">
                  <Link size={22} />
                </span>
                <span className="share-option-label">טלגרם</span>
              </button>
            </div>

            <button className={`btn btn-copy-share ${copied ? 'copied' : ''}`} onClick={handleCopyToClipboard}>
              {copied ? <><Check size={15} /> הועתק!</> : <><Copy size={15} /> העתקת המתכון</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
