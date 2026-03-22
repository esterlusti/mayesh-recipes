import React from 'react';
import { ChefHat, Settings } from 'lucide-react';

export default function AuthBar({ user, onAvatarClick, onAdminClick, useGenderText, isAdmin, page, onPageChange }) {

  const displayName = user
    ? user.isAnonymous
      ? useGenderText('אורח', 'אורחת')
      : (user.displayName || user.email?.split('@')[0] || '')
    : '';

  const navItems = [
    { id: 'recipe', label: 'מתכון' },
    { id: 'about', label: 'אודות' },
    { id: 'contact', label: 'צור קשר' },
  ];

  return (
    <>
    {import.meta.env.DEV && <div className="dev-banner">האתר בהרצה — ייתכנו שגיאות</div>}
    <div className="auth-bar">
      <div className="auth-bar-right">
        <span className="auth-logo">מה יש</span>
        <nav className="auth-nav" aria-label="ניווט ראשי">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`auth-nav-btn ${page === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="auth-bar-left">
        {isAdmin && (
          <button className="admin-trigger-btn" onClick={onAdminClick} title="פאנל ניהול" aria-label="פאנל ניהול">
            <Settings size={16} />
          </button>
        )}
        {displayName && (
          <span className="auth-greeting">{displayName}</span>
        )}
        <button className="avatar-btn" onClick={onAvatarClick} title="הפרופיל שלי" aria-label="הפרופיל שלי">
          {user?.photoURL
            ? <img src={user.photoURL} alt="avatar" className="avatar-img" />
            : <span className="avatar-placeholder"><ChefHat size={17} strokeWidth={2} /></span>
          }
        </button>
      </div>
    </div>
    </>
  );
}
