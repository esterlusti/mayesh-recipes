import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { saveContactMessage } from '../firebase';
import { Mail } from 'lucide-react';

export default function ContactPage({ user }) {
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
      toast.error('שליחת ההודעה נכשלה, נסו שוב');
    }
    setSending(false);
  };

  return (
    <div className="steps-container" style={{ paddingTop: 80 }}>
      <div className="step-card contact-page">
        <h2 className="playfair step-title">
          <Mail size={24} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 8 }} />
          צרו קשר
        </h2>
        <p className="step-sub">שאלה? הצעה לייעול? נשמח לשמוע!</p>

        {sent ? (
          <div className="contact-success-card">
            <p className="contact-success">ההודעה נשלחה בהצלחה! תודה רבה.</p>
            <button className="btn btn-next" onClick={() => setSent(false)}>שליחת הודעה נוספת</button>
          </div>
        ) : (
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
              rows={5}
            />
            <button className="btn btn-next" type="submit" disabled={sending || !message.trim()}>
              {sending ? 'שולח...' : 'שליחה'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
