import React, { useState, useEffect } from 'react';
import { getAboutContent } from '../firebase';

const DEFAULT_ABOUT = `ברוכים הבאים ל"מה יש"!

אנחנו כאן כדי לעזור לכם להכין ארוחות טעימות מהמרכיבים שכבר יש לכם בבית.

איך זה עובד?
1. בחרו קטגוריה (בשרי, חלבי או פרווה)
2. סמנו את הציוד והמרכיבים שיש לכם
3. קבלו מתכון מותאם אישית תוך שניות

המתכונים נכתבים בסגנון ביתי ישראלי — פשוט, טעים, ונגיש לכולם.

בתיאבון! 🍳`;

export default function AboutPage() {
  const [content, setContent] = useState(DEFAULT_ABOUT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAboutContent().then(data => {
      if (data?.content) setContent(data.content);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  return (
    <div className="steps-container" style={{ paddingTop: 80 }}>
      <div className="step-card about-page">
        <h2 className="playfair step-title">אודות</h2>
        <div className="about-content">
          {content.split('\n').map((line, i) => (
            line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
