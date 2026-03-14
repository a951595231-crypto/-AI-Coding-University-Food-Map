import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket } from 'lucide-react';
import restaurants from '../data/restaurants';

const coupons = restaurants
  .filter(r => r.studentDeal && r.coupon)
  .map(r => ({
    id: r.id,
    restaurant: r.name,
    image: r.image,
    coupon: r.coupon,
    category: r.categoryTag,
    avgPrice: r.avgPrice,
  }));

export default function Coupons() {
  const navigate = useNavigate();

  return (
    <div className="pb-4">
      <div className="px-5 pt-10 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">🎫 学生福利专区</h1>
          <p className="text-xs text-gray-400 mt-0.5">专属优惠券 · {coupons.length}个可用</p>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-gradient-to-r from-brand-500 to-orange-400 rounded-2xl p-4 text-white">
          <p className="text-sm font-semibold">新用户专享</p>
          <p className="text-2xl font-bold mt-1">首单立减 ¥8</p>
          <p className="text-[11px] opacity-80 mt-1">注册即领 · 全场通用 · 有效期7天</p>
          <button className="mt-2 bg-white text-brand-500 text-sm font-semibold px-4 py-1.5 rounded-full">
            立即领取
          </button>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-gradient-to-r from-teal-500 to-teal-400 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm font-semibold">🎓 学生认证专享</span>
            <span className="text-[9px] bg-white/25 px-1.5 py-0.5 rounded-full">认证后解锁</span>
          </div>
          <p className="text-xl font-bold mt-1">全场再享 9 折</p>
          <p className="text-[11px] opacity-80 mt-1">完成学生认证即可使用 · 与其他优惠叠加</p>
          <button
            onClick={() => navigate('/verify')}
            className="mt-2 bg-white text-teal-600 text-sm font-semibold px-4 py-1.5 rounded-full"
          >
            立即认证
          </button>
        </div>
      </div>

      <div className="px-5 mb-3">
        <p className="text-sm font-semibold text-gray-700">商家优惠</p>
      </div>

      <div className="px-4 space-y-3">
        {coupons.map(c => (
          <div
            key={c.id}
            onClick={() => navigate(`/restaurant/${c.id}`)}
            className="flex gap-3 bg-white rounded-2xl p-3 border border-gray-50 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
          >
            <img src={c.image} alt={c.restaurant} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{c.restaurant}</h3>
                <span className="text-[10px] text-gray-400">{c.category} · ¥{c.avgPrice}/人</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-brand-500 flex items-center gap-1">
                  <Ticket size={14} /> {c.coupon}
                </span>
                <button className="text-[11px] text-white bg-brand-500 px-3 py-1 rounded-full font-medium" onClick={(e) => e.stopPropagation()}>
                  领取
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 mt-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-sm font-medium text-gray-500 mb-1">🏪 商家入驻</p>
          <p className="text-[11px] text-gray-400">想让更多学生发现你的店铺？</p>
          <button className="mt-2 text-xs text-brand-500 font-medium underline">了解商家合作方案</button>
        </div>
      </div>
    </div>
  );
}
