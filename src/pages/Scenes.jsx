import { useState, useMemo } from 'react';
import { scenarioGroups } from '../data/scenarios';
import restaurants from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import { Sparkles, RefreshCw, X } from 'lucide-react';

export default function Scenes() {
  const [activeScenarios, setActiveScenarios] = useState([]);
  const [recommended, setRecommended] = useState(null);
  const [recSeed, setRecSeed] = useState(0);

  const toggleScenario = (id) => {
    setActiveScenarios(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    setRecommended(null);
  };

  const clearAll = () => {
    setActiveScenarios([]);
    setRecommended(null);
  };

  const filtered = useMemo(() => {
    if (activeScenarios.length === 0) return restaurants;
    return restaurants.filter(r =>
      activeScenarios.some(s => r.scenarios.includes(s))
    );
  }, [activeScenarios]);

  const handleRecommend = () => {
    const pool = filtered.length > 0 ? filtered : restaurants;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setRecommended(shuffled.slice(0, 3));
    setRecSeed(prev => prev + 1);
  };

  return (
    <div className="pb-4">
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-xl font-bold text-gray-900">场景选餐</h1>
        <p className="text-xs text-gray-400 mt-0.5">选择偏好，找到最合适的餐厅</p>
      </div>

      {activeScenarios.length > 0 && (
        <div className="px-5 mb-2 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">已选 {activeScenarios.length} 个条件 · {filtered.length} 家匹配</span>
          <button onClick={clearAll} className="text-[11px] text-brand-500 flex items-center gap-0.5"><X size={12} /> 清除</button>
        </div>
      )}

      <div className="px-4 pb-2">
        {scenarioGroups.map(group => (
          <div key={group.id} className="mb-3">
            <p className="text-[12px] text-gray-500 font-medium mb-2 flex items-center gap-1">
              {group.icon} {group.title}
            </p>
            <div className="flex gap-2 flex-wrap">
              {group.scenarios.map(s => {
                const active = activeScenarios.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleScenario(s.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] transition-all border ${
                      active
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-150 hover:border-brand-200'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span className="font-medium">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Recommend Button */}
      <div className="px-5 mb-4">
        <button
          onClick={handleRecommend}
          className="w-full h-11 bg-gradient-to-r from-brand-500 to-orange-400 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md"
        >
          <Sparkles size={18} /> 帮我推荐
        </button>
      </div>

      {/* Recommendation Result */}
      {recommended && (
        <div className="px-4 mb-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-sm font-semibold text-gray-800">✨ 为你推荐</p>
            <button
              onClick={handleRecommend}
              className="text-xs text-brand-500 flex items-center gap-1 bg-brand-50 px-2.5 py-1 rounded-full hover:bg-brand-100 transition-colors"
            >
              <RefreshCw size={12} /> 换一批
            </button>
          </div>
          <div className="space-y-3">
            {recommended.map((r, i) => (
              <RestaurantCard key={`${r.id}-${recSeed}`} restaurant={r} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Full filtered list */}
      {!recommended && (
        <div className="px-4 space-y-3">
          <p className="text-xs text-gray-400 px-1">
            {activeScenarios.length > 0 ? '符合条件的餐厅' : '全部餐厅'}
          </p>
          {filtered.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-300">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm">没找到符合条件的餐厅</p>
              <button onClick={clearAll} className="text-xs text-brand-500 mt-2">清除筛选</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
