import { useState, useEffect } from 'react';
import { getUserDoc } from '../firebase';

export function useAdmin(user) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user || user.isAnonymous) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    getUserDoc(user.uid).then(snap => {
      if (!cancelled) {
        setIsAdmin(snap.exists() && snap.data()?.isAdmin === true);
      }
    }).catch(() => {
      if (!cancelled) setIsAdmin(false);
    });
    return () => { cancelled = true; };
  }, [user?.uid]);

  return { isAdmin };
}
