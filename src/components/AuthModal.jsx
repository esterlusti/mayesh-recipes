import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { signInGoogle, signInMicrosoft, signInGuest, signUpWithEmail, signInWithEmail } from '../firebase';
import { ArrowRight } from 'lucide-react';

export default function AuthModal({ onClose, useGenderText, isAnonymous }) {
  const [view, setView] = useState('main'); // main | login | register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const title = view === 'login'
    ? 'התחברות עם מייל'
    : view === 'register'
    ? 'הרשמה עם מייל'
    : isAnonymous
    ? 'התחברות לחשבון'
    : useGenderText ? useGenderText('ברוך הבא!', 'ברוכה הבאה!') : 'ברוכים הבאים!';

  const subtitle = view === 'login'
    ? 'הזינו מייל וסיסמה'
    : view === 'register'
    ? 'צרו חשבון חדש'
    : isAnonymous
    ? 'התחבר/י כדי לשמור מתכונים ולסנכרן בין מכשירים'
    : 'התחברו כדי לשמור מתכונים וציוד';

  const handleGoogle = async () => {
    try { await signInGoogle(); onClose(); }
    catch (e) {
      console.error(e);
      toast.error('כניסה עם Google נכשלה — בדקי שהפופ-אפ לא נחסם');
    }
  };

  const handleMicrosoft = async () => {
    try { await signInMicrosoft(); onClose(); }
    catch (e) {
      console.error(e);
      toast.error('כניסה עם Microsoft נכשלה');
    }
  };

  const handleGuest = async () => {
    try { await signInGuest(); onClose(); }
    catch (e) { console.error(e); }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('נא למלא מייל וסיסמה'); return; }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      onClose();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        toast.error('מייל או סיסמה שגויים');
      } else if (err.code === 'auth/invalid-email') {
        toast.error('כתובת מייל לא תקינה');
      } else {
        toast.error('שגיאה בהתחברות');
      }
    }
    setLoading(false);
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) { toast.error('נא להזין שם'); return; }
    if (!email || !password) { toast.error('נא למלא מייל וסיסמה'); return; }
    if (password.length < 6) { toast.error('סיסמה חייבת להכיל לפחות 6 תווים'); return; }
    if (password !== confirmPassword) { toast.error('הסיסמאות לא תואמות'); return; }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, displayName.trim());
      onClose();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        toast.error('כתובת מייל כבר רשומה — נסו להתחבר');
      } else if (err.code === 'auth/invalid-email') {
        toast.error('כתובת מייל לא תקינה');
      } else if (err.code === 'auth/weak-password') {
        toast.error('סיסמה חלשה מדי');
      } else {
        toast.error('שגיאה בהרשמה');
      }
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        {view !== 'main' && (
          <button className="auth-back-btn" onClick={() => setView('main')}>
            <ArrowRight size={18} />
          </button>
        )}
        <h2 className="modal-title playfair">{title}</h2>
        <p className="modal-sub">{subtitle}</p>

        {view === 'main' && (
          <>
            <button className="auth-btn google-btn" onClick={handleGoogle}>
              <span className="auth-btn-icon">G</span>
              התחברות עם Google
            </button>

            <button className="auth-btn microsoft-btn" onClick={handleMicrosoft}>
              <span className="auth-btn-icon">M</span>
              התחברות עם Microsoft
            </button>

            <button className="auth-btn email-btn" onClick={() => setView('login')}>
              <span className="auth-btn-icon">@</span>
              התחברות עם מייל
            </button>

            {!isAnonymous && (
              <>
                <div className="auth-divider"><span>או</span></div>
                <button className="auth-btn guest-btn" onClick={handleGuest}>
                  המשיכו כאורחים
                </button>
              </>
            )}
          </>
        )}

        {view === 'login' && (
          <form className="auth-form" onSubmit={handleEmailLogin}>
            <input
              className="auth-input"
              type="email"
              placeholder="כתובת מייל"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              dir="ltr"
            />
            <input
              className="auth-input"
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              dir="ltr"
            />
            <button className="auth-btn auth-submit-btn" type="submit" disabled={loading}>
              {loading ? 'מתחבר...' : 'התחברות'}
            </button>
            <p className="auth-switch">
              אין לך חשבון?{' '}
              <button type="button" className="auth-link" onClick={() => setView('register')}>
                הרשמה
              </button>
            </p>
          </form>
        )}

        {view === 'register' && (
          <form className="auth-form" onSubmit={handleEmailRegister}>
            <input
              className="auth-input"
              type="text"
              placeholder="שם תצוגה"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              autoComplete="name"
            />
            <input
              className="auth-input"
              type="email"
              placeholder="כתובת מייל"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              dir="ltr"
            />
            <input
              className="auth-input"
              type="password"
              placeholder="סיסמה (לפחות 6 תווים)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              dir="ltr"
            />
            <input
              className="auth-input"
              type="password"
              placeholder="אימות סיסמה"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              dir="ltr"
            />
            <button className="auth-btn auth-submit-btn" type="submit" disabled={loading}>
              {loading ? 'נרשם...' : 'הרשמה'}
            </button>
            <p className="auth-switch">
              יש לך חשבון?{' '}
              <button type="button" className="auth-link" onClick={() => setView('login')}>
                התחברות
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
