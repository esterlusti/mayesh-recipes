import React from 'react';
import { ChefHat } from 'lucide-react';

export default function AuthBar({ user, onAvatarClick, useGenderText }) {

  const displayName = user
    ? user.isAnonymous
      ? useGenderText('אורח', 'אורחת')
      : (user.displayName || user.email?.split('@')[0] || '')
    : '';

  return (
    <div className="auth-bar">
      <div className="auth-bar-right">
        <span className="auth-logo">מה יש</span>
      </div>
      <div className="auth-bar-left">
        {displayName && (
          <span className="auth-greeting">{displayName}</span>
        )}
        <button className="avatar-btn" onClick={onAvatarClick}>
          {user?.photoURL
            ? <img src={user.photoURL} alt="avatar" className="avatar-img" />
            : <span className="avatar-placeholder"><ChefHat size={17} strokeWidth={2} /></span>
          }
        </button>
      </div>
    </div>
  );
}
