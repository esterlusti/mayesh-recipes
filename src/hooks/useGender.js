import { useState, useEffect, useCallback } from 'react';
import { getUserDoc, saveUserDoc } from '../firebase';

const LS_KEY = 'mayesh_gender';

export function useGender(user) {
  const [gender, setGenderState] = useState(null);
  const [genderLoaded, setGenderLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (user && !user.isAnonymous) {
        try {
          const snap = await getUserDoc(user.uid);
          if (!cancelled && snap.exists() && snap.data().gender) {
            setGenderState(snap.data().gender);
          }
        } catch (e) {
          console.error('Failed to load gender:', e);
        }
      } else {
        const saved = localStorage.getItem(LS_KEY);
        if (saved) setGenderState(saved);
      }
      if (!cancelled) setGenderLoaded(true);
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  const setGender = useCallback(async (g) => {
    setGenderState(g);
    if (user && !user.isAnonymous) {
      try {
        await saveUserDoc(user.uid, { gender: g });
      } catch (e) {
        console.error('Failed to save gender:', e);
      }
    } else {
      localStorage.setItem(LS_KEY, g);
    }
  }, [user]);

  const useGenderText = useCallback((male, female) => {
    return gender === 'female' ? female : male;
  }, [gender]);

  return { gender, setGender, genderLoaded, useGenderText };
}
