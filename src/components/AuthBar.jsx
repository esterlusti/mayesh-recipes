import React from 'react';

// Set to image path when logo is ready, e.g. '/logo.png'
const LOGO_URL = null;

export default function AuthBar({ user, onAvatarClick, useGenderText }) {
  const emoji = useGenderText('👨‍🍳', '👩‍🍳');

  const displayName = user
    ? user.isAnonymous
      ? useGenderText('אורח', 'אורחת')
      : (user.displayName || user.email?.split('@')[0] || '')
    : '';

  return (
    <div className="auth-bar">
      <div className="auth-bar-right">
        {LOGO_URL
          ? <img src={LOGO_URL} alt="מה יש" className="auth-logo-img" />
          : <span className="auth-logo">מה יש</span>
        }
      </div>
      <div className="auth-bar-left">
        {displayName && (
          <span className="auth-greeting">{displayName}</span>
        )}
        <button className="avatar-btn" onClick={onAvatarClick}>
          {user?.photoURL
            ? <img src={user.photoURL} alt="avatar" className="avatar-img" />
            : <span className="avatar-placeholder">{emoji}</span>
          }
        </button>
      </div>
    </div>
  );
}
