/**
 * Motafawweq — Champions Storage Service
 * Handles persistence and live syncing between the Admin Dashboard
 * and the Platform Landing Page / League Champions Slider.
 */

import { INITIAL_CHAMPIONS } from '../data/mockAdminData';

const STORAGE_KEY = 'motafawweq_champions_v1';

export const getChampions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CHAMPIONS));
      return INITIAL_CHAMPIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CHAMPIONS));
      return INITIAL_CHAMPIONS;
    }

    // Ensure all items have English fields
    return parsed.map(c => {
      const match = INITIAL_CHAMPIONS.find(m => m.id === c.id);
      return {
        ...c,
        nameEn: c.nameEn || match?.nameEn || c.nameAr,
        titleEn: c.titleEn || match?.titleEn || c.titleAr,
        monthEn: c.monthEn || match?.monthEn || c.monthAr,
        schoolEn: c.schoolEn || match?.schoolEn || c.schoolAr,
        scoreEn: c.scoreEn || match?.scoreEn || c.scoreAr,
        rankEn: c.rankEn || match?.rankEn || c.rankAr,
        streakEn: c.streakEn || match?.streakEn || c.streakAr,
        badgeEn: c.badgeEn || match?.badgeEn || c.badgeAr
      };
    });
  } catch (e) {
    console.error('Failed to read champions from localStorage:', e);
    return INITIAL_CHAMPIONS;
  }
};

export const saveChampions = (champions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(champions));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('champions-updated', { detail: champions }));
    }
  } catch (e) {
    console.error('Failed to save champions:', e);
  }
};

export const addChampion = (champion) => {
  const current = getChampions();
  const newChampion = {
    ...champion,
    id: champion.id || `champ-${Date.now()}`,
    addedDate: new Date().toISOString().split('T')[0]
  };
  const updated = [newChampion, ...current];
  saveChampions(updated);
  return updated;
};

export const updateChampion = (id, fields) => {
  const current = getChampions();
  const updated = current.map(item => item.id === id ? { ...item, ...fields } : item);
  saveChampions(updated);
  return updated;
};

export const deleteChampion = (id) => {
  const current = getChampions();
  const updated = current.filter(item => item.id !== id);
  saveChampions(updated);
  return updated;
};

export const togglePinChampion = (id) => {
  const current = getChampions();
  const updated = current.map(item => item.id === id ? { ...item, isPinned: !item.isPinned } : item);
  saveChampions(updated);
  return updated;
};

