import React from 'react';

export default function ContactFooter({ user, onContactClick }) {
  return (
    <footer className="app-footer">
      <p>
        Ester Lustig &nbsp;|&nbsp; כל הזכויות שמורות &copy; {new Date().getFullYear()} &nbsp;|&nbsp; כשר
        &nbsp;|&nbsp;
        <button className="footer-link" onClick={onContactClick}>
          צרו קשר
        </button>
      </p>
    </footer>
  );
}
