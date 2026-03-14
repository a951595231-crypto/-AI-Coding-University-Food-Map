import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Trophy, Users, User } from 'lucide-react';

const tabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/scenes', label: '场景', icon: Compass },
  { path: '/rankings', label: '榜单', icon: Trophy },
  { path: '/buddy', label: '饭搭子', icon: Users },
  { path: '/profile', label: '我的', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50">
      <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(tab => {
          const active = isActive(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-all duration-200 ${
                active ? 'text-brand-500' : 'text-gray-400'
              }`}
            >
              <Icon size={21} strokeWidth={active ? 2.2 : 1.6} />
              <span className={`text-[10px] ${active ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
