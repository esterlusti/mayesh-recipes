import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import { signInGoogle, signInMicrosoft, signInGuest } from '../firebase';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function AuthModal({ onClose, useGenderText, isAnonymous }) {
  const modalRef = useRef(null);
  useFocusTrap(modalRef, true, onClose);
  const title = isAnonymous
    ? 'התחברות לחשבון'
    : useGenderText ? useGenderText('ברוך הבא!', 'ברוכה הבאה!') : 'ברוכים הבאים!';

  const subtitle = isAnonymous
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
    catch (e) { console.error(e); toast.error('כניסה כאורח נכשלה, נסו שוב'); }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="modal-card" ref={modalRef} onClick={e => e.stopPropagation()}>
        <h2 id="auth-modal-title" className="modal-title playfair">{title}</h2>
        <p className="modal-sub">{subtitle}</p>

        <button className="auth-btn google-btn" onClick={handleGoogle}>
          <span className="auth-btn-icon">G</span>
          התחברות עם Google
        </button>

        <button className="auth-btn microsoft-btn" onClick={handleMicrosoft}>
          <span className="auth-btn-icon">M</span>
          התחברות עם Microsoft
        </button>

        {!isAnonymous && (
          <>
            <div className="auth-divider"><span>או</span></div>
            <button className="auth-btn guest-btn" onClick={handleGuest}>
              המשיכו כאורחים
            </button>
          </>
        )}
      </div>
    </div>
  );
}
