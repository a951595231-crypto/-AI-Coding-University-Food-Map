import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import BottomNav from './components/BottomNav';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Scenes from './pages/Scenes';
import Rankings from './pages/Rankings';
import DiningBuddy from './pages/DiningBuddy';
import Profile from './pages/Profile';
import RestaurantDetail from './pages/RestaurantDetail';
import SceneRestaurants from './pages/SceneRestaurants';
import Coupons from './pages/Coupons';
import Favorites from './pages/Favorites';
import PreferenceSettings from './pages/PreferenceSettings';
import PrivacySettings from './pages/PrivacySettings';
import Verify from './pages/Verify';
import BuddyProfile from './pages/BuddyProfile';
import Achievements from './pages/Achievements';
import Chat from './pages/Chat';

const hideNavPaths = ['/onboarding', '/restaurant/', '/favorites', '/preferences', '/privacy', '/verify', '/buddy-profile/', '/achievements', '/chat/'];

function AppContent() {
  const location = useLocation();
  const { prefs } = useUser();

  const showNav = !hideNavPaths.some(p => location.pathname.startsWith(p));

  if (!prefs.onboarded && location.pathname === '/') {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/scenes" element={<Scenes />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/buddy" element={<DiningBuddy />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/scene/:sceneId" element={<SceneRestaurants />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/preferences" element={<PreferenceSettings />} />
        <Route path="/privacy" element={<PrivacySettings />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/buddy-profile/:userId" element={<BuddyProfile />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/chat/:buddyId" element={<Chat />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </BrowserRouter>
  );
}
