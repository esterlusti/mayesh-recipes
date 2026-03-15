import { useState, useEffect, useCallback } from 'react';
import { getUserDoc, saveUserDoc } from '../firebase';

export function useUserData(user) {
  const [savedEquipment, setSavedEquipment] = useState([]);
  const [savedEquipmentType, setSavedEquipmentType] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (user && !user.isAnonymous) {
        try {
          const snap = await getUserDoc(user.uid);
          if (!cancelled && snap.exists()) {
            const data = snap.data();
            if (data.equipment) setSavedEquipment(data.equipment);
            if (data.equipmentType) setSavedEquipmentType(data.equipmentType);
          }
        } catch (e) {
          console.error('Failed to load user data:', e);
        }
      }
      if (!cancelled) setLoaded(true);
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  const saveEquipment = useCallback(async (equipList, equipType) => {
    setSavedEquipment(equipList);
    setSavedEquipmentType(equipType);
    if (user && !user.isAnonymous) {
      try {
        await saveUserDoc(user.uid, { equipment: equipList, equipmentType: equipType });
      } catch (e) {
        console.error('Failed to save equipment:', e);
      }
    }
  }, [user]);

  return { savedEquipment, savedEquipmentType, loaded, saveEquipment };
}
