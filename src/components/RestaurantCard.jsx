import { useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Bike, Store } from 'lucide-react';

export default function RestaurantCard({ restaurant, index = 0 }) {
  const navigate = useNavigate();
  const r = restaurant;

  return (
    <div
      onClick={() => navigate(`/restaurant/${r.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-50 active:scale-[0.98] transition-all duration-200 cursor-pointer animate-fade-in overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex gap-3 p-3 pb-2">
        <div className="relative w-[100px] h-[80px] flex-shrink-0 rounded-xl overflow-hidden">
          <img src={r.image} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
          {r.isNew && (
            <span className="absolute top-1 left-1 bg-brand-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">新店</span>
          )}
          {r.rankings.length > 0 && (
            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-md">🏆 上榜</span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-[14px] text-gray-900 line-clamp-1">{r.name}</h3>
              <span className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded flex-shrink-0">{r.categoryTag}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-gray-800">{r.rating}</span>
              </div>
              <span className="text-[10px] text-gray-400">月售{r.monthlySales}</span>
              <span className="text-[10px] text-gray-400">¥{r.avgPrice}/人</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-400">
              <span className="flex items-center gap-0.5"><MapPin size={9} /> {r.distance}m · {r.nearestGate}</span>
              <span className="flex items-center gap-0.5"><Clock size={9} /> {r.hours}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {r.dineIn && (
              <span className="flex items-center gap-0.5 text-[9px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">
                <Store size={8} /> 堂食
              </span>
            )}
            {r.delivery && (
              <span className="flex items-center gap-0.5 text-[9px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                <Bike size={8} /> {r.deliveryTime}min
              </span>
            )}
            {r.deliveryFee === 0 && r.delivery && (
              <span className="text-[9px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded-full">免配送</span>
            )}
            {r.studentDeal && r.coupon && (
              <span className="text-[9px] text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full font-medium">🎫 {r.coupon}</span>
            )}
          </div>
        </div>
      </div>

      {/* Signature dishes with prices */}
      <div className="px-3 pb-2.5">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
          {r.signatures.slice(0, 3).map((dish, i) => (
            <div key={i} className="flex-shrink-0 bg-gray-50 rounded-lg px-2.5 py-1.5 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-brand-500 bg-brand-50 px-1 py-px rounded font-medium">{dish.tag}</span>
                <span className="text-[11px] text-gray-700 font-medium whitespace-nowrap">{dish.name}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[12px] text-brand-600 font-bold">¥{dish.price}</span>
                {dish.originalPrice && (
                  <span className="text-[10px] text-gray-300 line-through">¥{dish.originalPrice}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
