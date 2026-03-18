import React, { useState } from 'react';
import { ChefHat, Utensils, BookmarkPlus, X } from 'lucide-react';

const STEPS = [
  {
    icon: <ChefHat size={36} strokeWidth={1.5} />,
    title: null, // filled dynamically
    body: 'כאן תוכלי לקבל מתכון מותאם אישית לפי מה שיש לך בבית.',
  },
  {
    icon: <Utensils size={36} strokeWidth={1.5} />,
    title: 'איך זה עובד?',
    body: 'בחרי סוג מנה, ציוד, קטגוריה ומרכיבים — ובתוך שניות תקבלי מתכון שמתאים בדיוק לך.',
  },
  {
    icon: <BookmarkPlus size={36} strokeWidth={1.5} />,
    title: 'שמרי מתכונים',
    body: 'התחברי עם Google כדי לשמור מתכונים אהובים ולגשת אליהם מכל מכשיר.',
  },
];

export default function OnboardingTour({ onClose, useGenderText }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const welcomeTitle = useGenderText ? useGenderText('ברוך הבא!', 'ברוכה הבאה!') : 'ברוכים הבאים!';

  const title = step === 0 ? welcomeTitle : current.title;

  const isLast = step === STEPS.length - 1;

  return (
    <div className="onboarding-overlay" onClick={onClose}>
      <div className="onboarding-card" onClick={e => e.stopPropagation()}>
        <button className="onboarding-close" onClick={onClose}><X size={16} /></button>

        <div className="onboarding-icon">{current.icon}</div>
        <h2 className="onboarding-title playfair">{title}</h2>
        <p className="onboarding-body">{current.body}</p>

        <div className="onboarding-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`} onClick={() => setStep(i)} />
          ))}
        </div>

        <div className="onboarding-actions">
          {!isLast ? (
            <>
              <button className="onboarding-btn-skip" onClick={onClose}>דלגי</button>
              <button className="onboarding-btn-next" onClick={() => setStep(s => s + 1)}>הבא ←</button>
            </>
          ) : (
            <button className="onboarding-btn-next onboarding-btn-done" onClick={onClose}>
              בואי נתחיל! ✦
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
