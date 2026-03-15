import React, { useState } from 'react';
import { saveContactMessage } from '../firebase';
import { Mail } from 'lucide-react';

export default function ContactFooter({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('contact');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await saveContactMessage({
        type,
        message: message.trim(),
        email: email.trim() || (user?.email || 'אנונימי'),
        uid: user?.uid || null
      });
      setSent(true);
      setMessage('');
      setEmail('');
    } catch (err) {
      console.error('Failed to send:', err);
    }
    setSending(false);
  };

  return (
    <footer className="app-footer">
      {showForm && !sent && (
        <div className="contact-section">
          <div className="contact-card">
            <h3 className="playfair"><Mail size={20} style={{display:'inline', verticalAlign:'middle', marginLeft:8}} />צרו קשר</h3>
            <p>שאלה? הצעה לייעול? נשמח לשמוע!</p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="contact">צור קשר</option>
                <option value="suggestion">הצעה לייעול</option>
                <option value="bug">דיווח על בעיה</option>
              </select>
              {!user?.email && (
                <input
                  type="email"
                  placeholder="כתובת מייל (אופציונלי)"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              )}
              <textarea
                placeholder="מה תרצו לספר לנו?"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
              <button className="btn btn-next" type="submit" disabled={sending || !message.trim()}>
                {sending ? 'שולח...' : 'שליחה'}
              </button>
            </form>
          </div>
        </div>
      )}

      {sent && (
        <div className="contact-section">
          <div className="contact-card">
            <p className="contact-success">✅ ההודעה נשלחה בהצלחה! תודה רבה.</p>
          </div>
        </div>
      )}

      <p>
        כל הזכויות שמורות &copy; {new Date().getFullYear()} &nbsp;|&nbsp; כשר
        &nbsp;|&nbsp;
        <button className="footer-link" onClick={() => { setShowForm(!showForm); setSent(false); }}>
          צרו קשר
        </button>
      </p>
    </footer>
  );
}
