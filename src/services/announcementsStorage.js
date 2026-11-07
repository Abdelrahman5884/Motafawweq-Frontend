/**
 * Motafawweq — Announcements Storage Service
 * Handles persistence and live syncing of platform announcements.
 */

import { MOCK_ANNOUNCEMENTS } from '../data/mockAdminData';

const STORAGE_KEY = 'motafawweq_announcements_v2';

export const getAnnouncements = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ANNOUNCEMENTS));
      return MOCK_ANNOUNCEMENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ANNOUNCEMENTS));
      return MOCK_ANNOUNCEMENTS;
    }

    // Ensure all items have bilingual fields
    const upgraded = parsed.map(item => {
      if (item.titleEn && item.contentEn) return item;
      const match = MOCK_ANNOUNCEMENTS.find(m => m.id === item.id);
      return {
        ...item,
        titleAr: item.titleAr || item.title || (match ? match.titleAr : ''),
        titleEn: item.titleEn || (match ? match.titleEn : item.title),
        contentAr: item.contentAr || item.content || (match ? match.contentAr : ''),
        contentEn: item.contentEn || (match ? match.contentEn : item.content)
      };
    });

    return upgraded;
  } catch (e) {
    console.error('Failed to read announcements from localStorage:', e);
    return MOCK_ANNOUNCEMENTS;
  }
};

export const saveAnnouncements = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('announcements-updated', { detail: list }));
    }
  } catch (e) {
    console.error('Failed to save announcements:', e);
  }
};

export const addAnnouncement = (item) => {
  const current = getAnnouncements();
  const created = {
    ...item,
    id: item.id || `ann-${Date.now()}`,
    titleAr: item.titleAr || item.title,
    titleEn: item.titleEn || item.title,
    contentAr: item.contentAr || item.content,
    contentEn: item.contentEn || item.content,
    createdDate: new Date().toISOString().split('T')[0]
  };
  const updated = [created, ...current];
  saveAnnouncements(updated);
  return updated;
};

export const toggleAnnouncementActive = (id) => {
  const current = getAnnouncements();
  const updated = current.map(item => item.id === id ? { ...item, active: !item.active } : item);
  saveAnnouncements(updated);
  return updated;
};

export const deleteAnnouncement = (id) => {
  const current = getAnnouncements();
  const updated = current.filter(item => item.id !== id);
  saveAnnouncements(updated);
  return updated;
};
