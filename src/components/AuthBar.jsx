import React from 'react';

export default function AuthBar({ user, onAvatarClick, useGenderText }) {
  const greeting = useGenderText('שלום, שף', 'שלום, שפית');
  const emoji = useGenderText('👨‍🍳', '👩‍🍳');

  const displayName = user
    ? user.isAnonymous
      ? useGenderText('אורח', 'אורחת')
      : (user.displayName || user.email?.split('@')[0] || '')
    : '';

  return (
    <div className="auth-bar">
      <div className="auth-bar-right">
        <span className="auth-greeting">
          {greeting} {displayName} {emoji}
        </span>
      </div>
      <div className="auth-bar-left">
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
