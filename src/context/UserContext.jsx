import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext(null);

const defaultPrefs = {
  cuisines: [],
  spiceLevel: '',
  allergies: [],
  dietMode: '',
  dietPlan: '',
  budget: '',
  mealPreference: '',
  priorities: [],
  university: '',
  mbti: '',
  bio: '',
  onboarded: false,
  buddyConsent: false,
  buddyEnabled: true,
  favorites: [],
  checkIns: [],
  unlockedAchievements: [],
  equippedAchievements: [],
  browseTimeOver3min: false,
  speedCheckIn: false,
  greetedBuddies: 0,
  greetedSet: [],
  readChats: [],
  textReviews: 0,
};

const CHECK_IN_COOLDOWN_MS = 3 * 60 * 60 * 1000;

export function UserProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('uni-food-prefs');
      return saved ? { ...defaultPrefs, ...JSON.parse(saved) } : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });

  useEffect(() => {
    localStorage.setItem('uni-food-prefs', JSON.stringify(prefs));
  }, [prefs]);

  const updatePrefs = (updates) => {
    setPrefs(prev => ({ ...prev, ...updates }));
  };

  const toggleFavorite = (restaurantId) => {
    setPrefs(prev => ({
      ...prev,
      favorites: prev.favorites.includes(restaurantId)
        ? prev.favorites.filter(id => id !== restaurantId)
        : [...prev.favorites, restaurantId],
    }));
  };

  const checkIn = useCallback((restaurantId, location) => {
    const now = Date.now();
    const checkIns = prefs.checkIns || [];
    const last = checkIns.filter(c => c.restaurantId === restaurantId).sort((a, b) => b.timestamp - a.timestamp)[0];
    if (last && now - last.timestamp < CHECK_IN_COOLDOWN_MS) {
      const remaining = Math.ceil((CHECK_IN_COOLDOWN_MS - (now - last.timestamp)) / 60000);
      return { success: false, remaining };
    }
    const newCheckIn = { restaurantId, timestamp: now, location };
    setPrefs(prev => ({ ...prev, checkIns: [...(prev.checkIns || []), newCheckIn] }));
    return { success: true };
  }, [prefs.checkIns]);

  const getVisitCount = useCallback((restaurantId) => {
    return (prefs.checkIns || []).filter(c => c.restaurantId === restaurantId).length;
  }, [prefs.checkIns]);

  const getLastCheckIn = useCallback((restaurantId) => {
    const visits = (prefs.checkIns || []).filter(c => c.restaurantId === restaurantId);
    if (visits.length === 0) return null;
    return visits.sort((a, b) => b.timestamp - a.timestamp)[0];
  }, [prefs.checkIns]);

  const markChatRead = useCallback((buddyId) => {
    setPrefs(prev => {
      const readChats = prev.readChats || [];
      if (readChats.includes(buddyId)) return prev;
      return { ...prev, readChats: [...readChats, buddyId] };
    });
  }, []);

  const getUnreadCount = useCallback(() => {
    const greeted = prefs.greetedSet || [];
    const read = prefs.readChats || [];
    return greeted.filter(id => !read.includes(id)).length;
  }, [prefs.greetedSet, prefs.readChats]);

  const resetPrefs = () => {
    setPrefs(defaultPrefs);
    localStorage.removeItem('uni-food-prefs');
  };

  return (
    <UserContext.Provider value={{ prefs, updatePrefs, toggleFavorite, resetPrefs, checkIn, getVisitCount, getLastCheckIn, markChatRead, getUnreadCount }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be within UserProvider');
  return ctx;
}
