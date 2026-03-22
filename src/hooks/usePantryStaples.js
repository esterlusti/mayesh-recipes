import { useState, useEffect } from 'react';
import { PANTRY_DEFAULTS } from '../data/pantryDefaults';

const LS_KEY = 'mayesh_pantry';

async function loadFromFirebase(uid) {
  try {
    const { getUserDoc } = await import('../firebase');
    const snap = await getUserDoc(uid);
    const data = snap.exists() ? snap.data() : null;
    return data?.pantryStaples ?? null;
  } catch {
    return null;
  }
}

async function saveToFirebase(uid, ids) {
  try {
    const { saveUserDoc } = await import('../firebase');
    await saveUserDoc(uid, { pantryStaples: ids });
  } catch (e) {
    console.error('Failed to save pantry to Firebase', e);
  }
}

export function usePantryStaples(user) {
  const [pantryStaples, setPantryStaplesState] = useState(PANTRY_DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (user && !user.isAnonymous) {
        const remote = await loadFromFirebase(user.uid);
        if (!cancelled) {
          setPantryStaplesState(remote ?? PANTRY_DEFAULTS);
          setLoaded(true);
        }
      } else {
        const local = localStorage.getItem(LS_KEY);
        if (!cancelled) {
          let parsed = PANTRY_DEFAULTS;
          if (local) {
            try { parsed = JSON.parse(local); } catch { /* corrupted localStorage */ }
          }
          setPantryStaplesState(parsed);
          setLoaded(true);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  const setPantryStaples = (ids) => {
    setPantryStaplesState(ids);
    if (user && !user.isAnonymous) {
      saveToFirebase(user.uid, ids);
    } else {
      localStorage.setItem(LS_KEY, JSON.stringify(ids));
    }
  };

  return { pantryStaples, setPantryStaples, loaded };
}
