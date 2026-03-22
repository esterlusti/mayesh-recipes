import { useState, useEffect } from 'react';
import { auth, saveUserDoc } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);

      // Sync profile info to Firestore for admin visibility
      if (u && !u.isAnonymous) {
        const profile = {};
        if (u.displayName) profile.displayName = u.displayName;
        if (u.email) profile.email = u.email;
        if (Object.keys(profile).length > 0) {
          saveUserDoc(u.uid, profile).catch(() => {});
        }
      }
    });
    return unsub;
  }, []);

  return { user, loading };
}
