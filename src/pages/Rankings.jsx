import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import foodCategories from '../data/categories';
import { getRestaurantsByRanking, getNewRestaurants, getWeeklyTrending } from '../data/restaurants';
import { Trophy } from 'lucide-react';

const rankTabs = [
  { id: 'hot', label: '🔥 人气热门', desc: '根据销量和热度综合排名' },
  { id: 'rating', label: '⭐ 好评榜', desc: '评分最高的优质餐厅' },
  { id: 'value', label: '💰 性价比', desc: '花小钱吃好饭' },
  { id: 'new', label: '🆕 新店探鲜', desc: '新开的宝藏餐厅' },
  { id: 'weekly', label: '📅 本周飙升', desc: '本周热度上升最快' },
  { id: 'foodie', label: '🏆 美食家', desc: '打卡最多的吃货排行' },
];

const mockFoodieRanking = [
  { rank: 1, buddyId: 1, nickname: '碳水星人🍚', avatar: '🧑‍🎓', title: '学院路活地图', titleIcon: '🧭', checkIns: 87, restaurants: 23, topCategory: '川湘菜', streak: 14 },
  { rank: 2, buddyId: 3, nickname: '深夜觅食家🌙', avatar: '🦉', title: '夜行觅食家', titleIcon: '🦉', checkIns: 72, restaurants: 18, topCategory: '烧烤', streak: 9 },
  { rank: 3, buddyId: 2, nickname: '减脂打卡er💪', avatar: '🏋️', title: '自律之星', titleIcon: '💪', checkIns: 65, restaurants: 12, topCategory: '轻食沙拉', streak: 21 },
  { rank: 4, buddyId: 4, nickname: '下午茶续命☕', avatar: '👩‍🎨', title: '续命大师', titleIcon: '☕', checkIns: 58, restaurants: 15, topCategory: '奶茶咖啡', streak: 7 },
  { rank: 5, buddyId: 7, nickname: '韩料小公主👑', avatar: '💅', title: '真爱粉', titleIcon: '💕', checkIns: 45, restaurants: 8, topCategory: '韩餐', streak: 5 },
  { rank: 6, buddyId: 5, nickname: '省钱干饭王🪙', avatar: '🤓', title: '人间省钱精', titleIcon: '🪙', checkIns: 42, restaurants: 20, topCategory: '快餐', streak: 11 },
  { rank: 7, buddyId: 6, nickname: '增肌干饭人🥩', avatar: '🏅', title: '烧烤战士', titleIcon: '🔥', checkIns: 38, restaurants: 9, topCategory: '龙虾烧烤', streak: 4 },
  { rank: 8, buddyId: 8, nickname: '生酮实践者🥑', avatar: '🧬', title: '半百食神', titleIcon: '👨‍🍳', checkIns: 33, restaurants: 7, topCategory: '轻食沙拉', streak: 15 },
];

export default function Rankings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hot');
  const [activeCategory, setActiveCategory] = useState(null);
  const currentTab = rankTabs.find(t => t.id === activeTab);

  const baseList = useMemo(() => {
    if (activeTab === 'new') return getNewRestaurants();
    if (activeTab === 'weekly') return getWeeklyTrending();
    return getRestaurantsByRanking(activeTab);
  }, [activeTab]);

  const list = useMemo(() => {
    if (!activeCategory) return baseList;
    const cat = foodCategories.find(c => c.id === activeCategory);
    if (!cat) return baseList;
    return baseList.filter(r => cat.tags.some(t => r.categoryTag.includes(t)));
  }, [baseList, activeCategory]);

  return (
    <div className="pb-4">
      <div className="px-5 pt-12 pb-3">
        <h1 className="text-xl font-bold text-gray-900">美食榜单</h1>
        <p className="text-xs text-gray-400 mt-0.5">五道口 · 学院路大学城</p>
      </div>

      {/* Ranking Tabs */}
      <div className="px-5 mb-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {rankTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveCategory(null); }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Sub-filter */}
      {activeTab !== 'foodie' && <div className="px-5 mb-3">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] transition-all border ${
              !activeCategory
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            全部
          </button>
          {foodCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] transition-all border whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>}

      {activeTab === 'foodie' ? (
        <div>
          <div className="px-5 mb-3">
            <div className="bg-gradient-to-r from-violet-50 to-brand-50 rounded-xl p-3 border border-violet-100">
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Trophy size={14} className="text-violet-500" /> 美食家排行
              </p>
              <p className="text-xs text-gray-400 mt-0.5">根据打卡次数、探店广度、连续打卡天数综合排名</p>
            </div>
          </div>
          <div className="px-4 space-y-2.5">
            {mockFoodieRanking.map((u) => (
              <div key={u.rank} className={`bg-white rounded-2xl p-4 border shadow-sm ${u.rank <= 3 ? 'border-amber-100' : 'border-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                    u.rank === 1 ? 'bg-amber-400' : u.rank === 2 ? 'bg-gray-400' : u.rank === 3 ? 'bg-amber-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {u.rank}
                  </div>
                  <button
                    onClick={() => navigate(`/buddy-profile/${u.buddyId}`)}
                    className="w-11 h-11 bg-brand-50 rounded-full flex items-center justify-center text-2xl flex-shrink-0 hover:ring-2 hover:ring-brand-200 transition-all"
                  >
                    {u.avatar}
                  </button>
                  <div className="flex-1 min-w-0" onClick={() => navigate(`/buddy-profile/${u.buddyId}`)} role="button">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-gray-800 truncate hover:text-brand-500 transition-colors cursor-pointer">{u.nickname}</h3>
                      <span className="flex items-center gap-0.5 text-[9px] text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        {u.titleIcon} {u.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                      <span>{u.checkIns} 次打卡</span>
                      <span>{u.restaurants} 家探店</span>
                      <span>🔥 {u.streak}天连签</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2.5 ml-[76px]">
                  <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">最爱 {u.topCategory}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {currentTab && (
            <div className="px-5 mb-3">
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 border border-gray-100">
                <p className="text-sm font-semibold text-gray-700">{currentTab.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{currentTab.desc}</p>
              </div>
            </div>
          )}

          <div className="px-4 space-y-3">
            {list.map((r, i) => (
              <div key={r.id} className="relative">
                {i < 3 && (
                  <div className={`absolute -left-1 top-3 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${
                    i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-gray-400' : 'bg-amber-700'
                  }`}>
                    {i + 1}
                  </div>
                )}
                <RestaurantCard restaurant={r} index={i} />
              </div>
            ))}
            {list.length === 0 && (
              <div className="text-center py-16 text-gray-300">
                <p className="text-4xl mb-3">🏆</p>
                <p className="text-sm">该分类暂无上榜餐厅</p>
                {activeCategory && (
                  <button onClick={() => setActiveCategory(null)} className="text-xs text-brand-500 mt-2">查看全部</button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
