import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Ticket, SlidersHorizontal } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import foodCategories from '../data/categories';
import restaurants from '../data/restaurants';
import { useUser } from '../context/UserContext';

const sortOptions = [
  { id: 'smart', label: '综合' },
  { id: 'distance', label: '距离' },
  { id: 'rating', label: '评分' },
  { id: 'price', label: '价格' },
  { id: 'sales', label: '销量' },
];

export default function Home() {
  const navigate = useNavigate();
  const { prefs } = useUser();
  const [sortBy, setSortBy] = useState('smart');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = useMemo(() => {
    let list = [...restaurants];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.categoryTag.includes(q) ||
        r.signatures.some(s => s.name.includes(q)) ||
        r.tags.some(t => t.includes(q))
      );
    }

    if (activeCategory) {
      const cat = foodCategories.find(c => c.id === activeCategory);
      if (cat) {
        list = list.filter(r => cat.tags.some(t => r.categoryTag.includes(t)));
      }
    }

    switch (sortBy) {
      case 'distance': return list.sort((a, b) => a.distance - b.distance);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'price': return list.sort((a, b) => a.avgPrice - b.avgPrice);
      case 'sales': return list.sort((a, b) => b.monthlySales - a.monthlySales);
      default: return list.sort((a, b) => (b.rating * 0.4 + b.monthlySales * 0.0003) - (a.rating * 0.4 + a.monthlySales * 0.0003));
    }
  }, [sortBy, searchQuery, activeCategory]);

  return (
    <div className="pb-4">
      {/* Search */}
      <div className="bg-gradient-to-b from-brand-50 to-warm-50 px-4 pt-11 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="麻辣香锅、拉面、轻食..."
              className="w-full h-10 pl-9 pr-3 bg-white rounded-xl text-sm text-gray-700 placeholder:text-gray-400 outline-none border border-gray-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
          <button className="h-10 px-4 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl flex-shrink-0 active:scale-95 transition-all">
            搜索
          </button>
        </div>

        <div className="h-0.5" />

        {/* Benefits entry */}
        <button
          onClick={() => navigate('/coupons')}
          className="w-full mt-2 bg-gradient-to-r from-brand-500 to-orange-400 rounded-xl px-3.5 py-2 flex items-center justify-between active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-2 text-white">
            <Ticket size={16} />
            <span className="text-[12px] font-medium">学生福利 · 专属优惠券 · 满减活动</span>
          </div>
          <span className="text-[11px] text-white bg-white/25 px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0">
            立即领券
          </span>
        </button>
      </div>

      {/* Food Categories */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {foodCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`flex flex-col items-center gap-1 flex-shrink-0 w-[60px] py-2 rounded-xl transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-50 border border-brand-200'
                  : 'bg-white border border-gray-100 hover:border-brand-100'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className={`text-[10px] font-medium whitespace-nowrap ${
                activeCategory === cat.id ? 'text-brand-600' : 'text-gray-600'
              }`}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort Bar */}
      <div className="px-4 mt-2 mb-2 flex items-center justify-between">
        <div className="flex gap-1 overflow-x-auto hide-scrollbar">
          {sortOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs transition-all ${
                sortBy === opt.id ? 'bg-gray-800 text-white' : 'text-gray-500 bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {prefs.onboarded && sortBy === 'smart' && (
          <span className="text-[10px] text-brand-500 flex-shrink-0 ml-2 flex items-center gap-0.5">
            <SlidersHorizontal size={10} /> 偏好排序
          </span>
        )}
      </div>

      {/* Restaurant List */}
      <div className="px-4 space-y-3">
        {filtered.map((r, i) => (
          <RestaurantCard key={r.id} restaurant={r} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-300">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">没找到相关餐厅</p>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)} className="text-xs text-brand-500 mt-2">清除分类筛选</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
