import { useState, useEffect } from 'react';
import { onAISettingsChange } from '../firebase';

export function useAISettings() {
  const [activeModel, setActiveModel] = useState('openai');

  useEffect(() => {
    const unsub = onAISettingsChange((data) => {
      setActiveModel(data.activeModel || 'openai');
    });
    return unsub;
  }, []);

  return { activeModel };
}
