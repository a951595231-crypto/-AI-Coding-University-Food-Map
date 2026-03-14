import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import achievements, { computeStats, getUnlockedAchievements } from '../data/achievements';
import restaurants from '../data/restaurants';
import { ArrowLeft, Lock } from 'lucide-react';

export default function Achievements() {
  const navigate = useNavigate();
  const { prefs } = useUser();

  const stats = useMemo(() => computeStats(
    prefs.checkIns || [],
    restaurants,
    {
      favCount: prefs.favorites?.length || 0,
      textReviews: prefs.textReviews || 0,
      greetedBuddies: prefs.greetedBuddies || 0,
      browseTimeOver3min: prefs.browseTimeOver3min || false,
      speedCheckIn: prefs.speedCheckIn || false,
    }
  ), [prefs]);

  const unlocked = useMemo(() => getUnlockedAchievements(stats), [stats]);
  const unlockedIds = new Set(unlocked.map(a => a.id));

  const categories = [...new Set(achievements.map(a => a.category))];
  const visibleAchievements = achievements.filter(a => !a.hidden || unlockedIds.has(a.id));
  const hiddenLocked = achievements.filter(a => a.hidden && !unlockedIds.has(a.id)).length;

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 pt-12">
        <div className="flex items-center gap-3 px-4 h-11">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="text-sm font-semibold text-gray-800">成就墙</span>
          <span className="text-[11px] text-brand-500 bg-brand-50 px-2 py-0.5 rounded-full ml-auto">
            {unlocked.length}/{achievements.length}
          </span>
        </div>
      </div>

      <div className="px-5 pt-5 pb-3">
        <div className="bg-gray-900 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{unlocked.length}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">成就已解锁</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalCheckIns}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">总打卡</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{stats.uniqueRestaurants}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">探店</p>
            </div>
          </div>
          {stats.maxStreak > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700 flex items-center gap-4 text-[11px] text-gray-400">
              <span>🔥 连续打卡 {stats.maxStreak} 天</span>
              {stats.maxSingleRestaurant > 0 && <span>💎 最专一 {stats.maxSingleRestaurant} 次</span>}
            </div>
          )}
        </div>
      </div>

      {categories.filter(cat => cat !== '隐藏').map(cat => {
        const items = visibleAchievements.filter(a => a.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="px-5 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{cat}</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {items.map(a => {
                const isUnlocked = unlockedIds.has(a.id);
                return (
                  <div key={a.id}
                    className={`rounded-2xl p-3 text-center transition-all ${
                      isUnlocked
                        ? 'bg-white border border-gray-100 shadow-sm'
                        : 'bg-gray-50/60 border border-gray-100'
                    }`}
                  >
                    <span className={`text-2xl block ${isUnlocked ? '' : 'grayscale opacity-30'}`}>{a.icon}</span>
                    <p className={`text-[11px] font-semibold mt-1.5 leading-tight ${isUnlocked ? 'text-gray-800' : 'text-gray-300'}`}>
                      {a.name}
                    </p>
                    <p className={`text-[9px] mt-0.5 leading-tight ${isUnlocked ? 'text-gray-400' : 'text-gray-300'}`}>{a.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Hidden Achievements */}
      <div className="px-5 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <Lock size={13} /> 隐藏成就
        </h3>
        <p className="text-[11px] text-gray-400 mb-3">特殊行为触发，解锁后才会显示条件</p>
        <div className="grid grid-cols-3 gap-2.5">
          {visibleAchievements.filter(a => a.category === '隐藏').map(a => (
            <div key={a.id}
              className="rounded-2xl p-3 text-center bg-white border border-gray-100 shadow-sm"
            >
              <span className="text-2xl block">{a.icon}</span>
              <p className="text-[11px] font-semibold mt-1.5 leading-tight text-gray-800">{a.name}</p>
              <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{a.desc}</p>
            </div>
          ))}
          {hiddenLocked > 0 && Array.from({ length: Math.min(hiddenLocked, 6) }).map((_, i) => (
            <div key={`hidden-${i}`}
              className="rounded-2xl p-3 text-center bg-gray-50/60 border border-dashed border-gray-200"
            >
              <span className="text-2xl block opacity-40">❓</span>
              <p className="text-[11px] font-semibold mt-1.5 text-gray-300">???</p>
              <p className="text-[9px] text-gray-300 mt-0.5">继续探索以解锁</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
