import React from 'react';
import { signInGoogle, signInMicrosoft, signInGuest } from '../firebase';

export default function AuthModal({ onClose, useGenderText }) {
  const title = useGenderText ? useGenderText('ברוך הבא!', 'ברוכה הבאה!') : 'ברוכים הבאים!';

  const handleGoogle = async () => {
    try { await signInGoogle(); onClose(); }
    catch (e) { console.error(e); }
  };

  const handleMicrosoft = async () => {
    try { await signInMicrosoft(); onClose(); }
    catch (e) { console.error(e); }
  };

  const handleGuest = async () => {
    try { await signInGuest(); onClose(); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title playfair">{title}</h2>
        <p className="modal-sub">התחברו כדי לשמור מתכונים וציוד</p>

        <button className="auth-btn google-btn" onClick={handleGoogle}>
          <span className="auth-btn-icon">G</span>
          התחברות עם Google
        </button>

        <button className="auth-btn microsoft-btn" onClick={handleMicrosoft}>
          <span className="auth-btn-icon">M</span>
          התחברות עם Microsoft
        </button>

        <div className="auth-divider">
          <span>או</span>
        </div>

        <button className="auth-btn guest-btn" onClick={handleGuest}>
          המשיכו כאורחים
        </button>
      </div>
    </div>
  );
}
