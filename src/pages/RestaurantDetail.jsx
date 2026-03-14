import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import restaurants, { getRestaurantById } from '../data/restaurants';
import { useUser } from '../context/UserContext';
import { computeStats, getUnlockedAchievements } from '../data/achievements';
import { ArrowLeft, Star, MapPin, Clock, Share2, Store, Bike, Send, MapPinCheck, Loader2 } from 'lucide-react';

function StarRating({ rating, onRate, size = 20, interactive = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          onClick={() => interactive && onRate?.(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`transition-transform ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <Star
            size={size}
            className={`transition-colors ${
              i <= (hovered || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { prefs, toggleFavorite, checkIn, getVisitCount, updatePrefs } = useUser();
  const r = getRestaurantById(id);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [myReview, setMyReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [quickRating, setQuickRating] = useState(0);
  const [checkInState, setCheckInState] = useState('idle');
  const [checkInMsg, setCheckInMsg] = useState('');
  const [newAchievement, setNewAchievement] = useState(null);
  const enterTime = useRef(Date.now());

  const visitCount = r ? getVisitCount(r.id) : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!prefs.browseTimeOver3min) {
        updatePrefs({ browseTimeOver3min: true });
      }
    }, 180000);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckIn = async () => {
    if (!r) return;
    setCheckInState('locating');
    setCheckInMsg('正在获取位置...');

    const doCheckIn = (loc) => {
      const elapsed = Date.now() - enterTime.current;
      if (elapsed < 10000 && !prefs.speedCheckIn) {
        updatePrefs({ speedCheckIn: true });
      }

      const result = checkIn(r.id, loc);
      if (result.success) {
        setCheckInState('success');
        setCheckInMsg('打卡成功！');

        const newCheckIns = [...(prefs.checkIns || []), { restaurantId: r.id, timestamp: Date.now(), location: loc }];
        const stats = computeStats(newCheckIns, restaurants, {
          favCount: prefs.favorites?.length || 0,
          textReviews: prefs.textReviews || 0,
          browseTimeOver3min: prefs.browseTimeOver3min || false,
          speedCheckIn: elapsed < 10000 || prefs.speedCheckIn,
        });
        const unlocked = getUnlockedAchievements(stats);
        const prev = prefs.unlockedAchievements || [];
        const newOnes = unlocked.filter(a => !prev.includes(a.id));
        if (newOnes.length > 0) {
          updatePrefs({ unlockedAchievements: [...prev, ...newOnes.map(a => a.id)] });
          setNewAchievement(newOnes[0]);
          setTimeout(() => setNewAchievement(null), 3000);
        }

        setTimeout(() => setCheckInState('idle'), 2000);
      } else {
        setCheckInState('cooldown');
        setCheckInMsg(`同一家店每 3 小时可打卡一次，还需等待 ${result.remaining} 分钟`);
        setTimeout(() => setCheckInState('idle'), 3000);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => doCheckIn({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => doCheckIn({ lat: 39.9920 + Math.random() * 0.005, lng: 116.3490 + Math.random() * 0.005 }),
        { timeout: 5000 }
      );
    } else {
      doCheckIn({ lat: 39.9920, lng: 116.3490 });
    }
  };

  const handleQuickRate = (rating) => {
    setQuickRating(rating);
    const review = { user: prefs.bio || '匿名用户', avatar: '🙋', rating, text: myReview?.text || '', date: '刚刚', ratingOnly: !myReview?.text };
    setMyReview(review);
  };

  const submitReview = () => {
    if (userRating > 0) {
      const review = { user: prefs.bio || '匿名用户', avatar: '🙋', rating: userRating, text: userReview.trim(), date: '刚刚', ratingOnly: !userReview.trim() };
      setMyReview(review);
      setQuickRating(userRating);
      setUserRating(0);
      setUserReview('');
      setShowReviewForm(false);
    }
  };

  if (!r) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <p>餐厅不存在</p>
      </div>
    );
  }

  const isFav = prefs.favorites?.includes(r.id);

  return (
    <div className="pb-24">
      <div className="relative h-56 overflow-hidden">
        <img src={r.photos[0]} alt={r.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-14 left-4 w-9 h-9 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="absolute top-14 right-4 flex gap-2">
          <button
            onClick={() => toggleFavorite(r.id)}
            className={`w-9 h-9 backdrop-blur-md rounded-full flex items-center justify-center transition-all ${
              isFav ? 'bg-amber-400 text-white' : 'bg-black/30 text-white'
            }`}
          >
            <Star size={18} fill={isFav ? 'white' : 'none'} />
          </button>
          <button className="w-9 h-9 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <Share2 size={18} />
          </button>
        </div>
        {r.photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {r.photos.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 -mt-4 relative">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{r.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{r.categoryTag}</span>
                <div className="flex items-center gap-0.5">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-gray-800">{r.rating}</span>
                </div>
                <span className="text-xs text-gray-400">月售{r.monthlySales}</span>
              </div>
            </div>
            <span className="text-lg font-bold text-brand-500">¥{r.avgPrice}<span className="text-xs font-normal text-gray-400">/人</span></span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><MapPin size={12} /> {r.distance}m · {r.nearestGate}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {r.hours}</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {r.dineIn && (
              <span className="flex items-center gap-1 text-[11px] text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">
                <Store size={11} /> 可堂食
              </span>
            )}
            {r.delivery && (
              <span className="flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                <Bike size={11} /> 外卖 {r.deliveryTime}min
              </span>
            )}
            {r.delivery && r.deliveryFee === 0 && (
              <span className="text-[11px] text-red-500 font-semibold bg-red-50 px-2 py-1 rounded-lg">免配送费</span>
            )}
            {r.delivery && r.minOrder && (
              <span className="text-[11px] text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">¥{r.minOrder}起送</span>
            )}
          </div>
        </div>
      </div>

      {r.studentDeal && r.coupon && (
        <div className="px-5 mt-3">
          <div className="bg-gradient-to-r from-brand-50 to-orange-50 rounded-2xl p-3.5 flex items-center justify-between border border-brand-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎫</span>
              <div>
                <p className="text-sm font-semibold text-brand-600">{r.coupon}</p>
                <p className="text-[10px] text-brand-400">学生专享优惠</p>
              </div>
            </div>
            <button className="text-xs text-white bg-brand-500 px-3 py-1.5 rounded-full font-medium">领取</button>
          </div>
        </div>
      )}

      {/* Check-in Section */}
      <div className="px-5 mt-4">
        <div className="bg-gradient-to-r from-violet-50 to-brand-50 rounded-2xl p-4 border border-violet-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <MapPinCheck size={20} className="text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">用餐打卡</p>
                <p className="text-[10px] text-gray-400">
                  {visitCount > 0 ? `你已来过 ${visitCount} 次` : '记录你的每一次用餐'}
                </p>
              </div>
            </div>
            <button
              onClick={handleCheckIn}
              disabled={checkInState !== 'idle'}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                checkInState === 'success'
                  ? 'bg-green-500 text-white'
                  : checkInState === 'cooldown'
                    ? 'bg-gray-100 text-gray-400'
                    : checkInState === 'locating'
                      ? 'bg-violet-100 text-violet-500'
                      : 'bg-violet-500 hover:bg-violet-600 text-white active:scale-95'
              }`}
            >
              {checkInState === 'locating' && <Loader2 size={14} className="animate-spin" />}
              {checkInState === 'success' ? '✓ 已打卡' : checkInState === 'cooldown' ? '冷却中' : checkInState === 'locating' ? '定位中' : '打卡'}
            </button>
          </div>
          {checkInMsg && checkInState !== 'idle' && (
            <p className={`text-[11px] mt-2 ${checkInState === 'cooldown' ? 'text-amber-500' : 'text-green-500'}`}>
              {checkInMsg}
            </p>
          )}
          {visitCount >= 3 && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[10px] text-violet-500 bg-violet-100 px-2 py-0.5 rounded-full font-medium">
                💕 常客
              </span>
              {visitCount >= 10 && (
                <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                  👑 VIP
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Achievement Unlock Toast */}
      {newAchievement && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-2xl">{newAchievement.icon}</span>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">成就解锁</p>
              <p className="text-sm font-bold">{newAchievement.name}</p>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 mt-5">
        <h2 className="text-base font-bold text-gray-900 mb-3">招牌推荐</h2>
        <div className="space-y-2">
          {r.signatures.map((dish, i) => (
            <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-brand-500 bg-brand-50 px-1.5 py-0.5 rounded font-medium">{dish.tag}</span>
                <span className="text-sm font-medium text-gray-700">{dish.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-brand-600">¥{dish.price}</span>
                {dish.originalPrice && (
                  <span className="text-xs text-gray-300 line-through">¥{dish.originalPrice}</span>
                )}
                {i === 0 && <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full ml-1">🔥 No.1</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="flex flex-wrap gap-2">
          {r.tags.map(tag => (
            <span key={tag} className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">#{tag}</span>
          ))}
          {r.mealTimes.map(t => (
            <span key={t} className="text-xs text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Quick Rating Bar */}
      <div className="px-5 mt-5">
        <div className="bg-gradient-to-r from-brand-50 to-orange-50 rounded-2xl p-4 border border-brand-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">{myReview ? '我的评分' : '给这家店打分'}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{myReview ? '点击星星可修改评分' : '点击星星即可评分，评价选填'}</p>
            </div>
            {!showReviewForm && (
              <button
                onClick={() => { setShowReviewForm(true); setUserRating(myReview?.rating || 0); setUserReview(myReview?.text || ''); }}
                className="text-xs text-brand-500 font-medium bg-white px-3 py-1.5 rounded-full flex items-center gap-1 border border-brand-200 hover:bg-brand-50 transition-colors"
              >
                <Send size={12} /> {myReview ? '修改评价' : '写评价'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <StarRating rating={quickRating} onRate={handleQuickRate} size={32} interactive />
            {quickRating > 0 && (
              <span className="text-sm font-semibold text-brand-500 animate-fade-in">
                {['', '😕 不太满意', '🤔 一般般', '😊 还不错', '😋 很满意', '🤩 超级棒！'][quickRating]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="px-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">用户评价</h2>
        </div>

        {showReviewForm && (
          <div className="bg-white rounded-2xl p-4 mb-4 animate-fade-in border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-2">{myReview ? '修改评价' : '你的评分'}</p>
            <StarRating rating={userRating} onRate={setUserRating} size={28} interactive />
            {userRating > 0 && (
              <span className="text-xs text-brand-500 mt-1 inline-block">
                {['', '不太满意', '一般般', '还不错', '很满意', '超级棒！'][userRating]}
              </span>
            )}
            <textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="分享你的用餐体验（选填）..."
              className="w-full mt-3 p-3 bg-gray-50 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-brand-200 h-20"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { setShowReviewForm(false); setUserRating(0); setUserReview(''); }}
                className="flex-1 h-9 text-sm text-gray-500 bg-gray-50 rounded-xl border border-gray-200"
              >
                取消
              </button>
              <button
                onClick={submitReview}
                disabled={userRating === 0}
                className="flex-1 h-9 text-sm text-white font-medium bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-400 rounded-xl transition-all"
              >
                {myReview ? '保存修改' : (userReview.trim() ? '发布评价' : '仅提交评分')}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {myReview && (
            <div className="bg-brand-50/50 rounded-xl p-3.5 border border-brand-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{myReview.avatar}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-700">{myReview.user}</p>
                    <span className="text-[9px] text-brand-500 bg-brand-100 px-1.5 py-0.5 rounded-full">我的评价</span>
                    {visitCount > 0 && (
                      <span className="text-[9px] text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded-full">已就餐{visitCount}次</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <StarRating rating={myReview.rating} size={10} />
                    <span className="text-[10px] text-gray-400 ml-1">{myReview.date}</span>
                  </div>
                </div>
              </div>
              {myReview.text ? (
                <p className="text-sm text-gray-600 leading-relaxed">{myReview.text}</p>
              ) : (
                <p className="text-xs text-gray-400 italic">仅评分</p>
              )}
            </div>
          )}
          {r.reviews.map((review, i) => {
            const mockVisits = [5, 3, 12, 8, 2, 1][i] || 1;
            const mockBuddyId = [1, 3, 2, 4, 5, 7, 6, 8][i] || 1;
            return (
              <div key={i} className="bg-white rounded-xl p-3.5 border border-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={() => navigate(`/buddy-profile/${mockBuddyId}`)}
                    className="text-lg hover:scale-110 transition-transform">{review.avatar}</button>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => navigate(`/buddy-profile/${mockBuddyId}`)}
                        className="text-sm font-medium text-gray-700 hover:text-brand-500 transition-colors">{review.user}</button>
                      <span className="text-[9px] text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded-full">已就餐{mockVisits}次</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StarRating rating={review.rating} size={10} />
                      <span className="text-[10px] text-gray-400 ml-1">{review.date}</span>
                    </div>
                  </div>
                </div>
                {review.text && <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="bg-gray-50 rounded-xl p-3.5">
          <p className="text-xs text-gray-400 flex items-center gap-1">✨ 口味相似的人还喜欢...</p>
          <div className="flex gap-2 mt-2 overflow-x-auto hide-scrollbar">
            {restaurants.filter(x => x.id !== r.id).slice(0, 3).map(rec => (
              <button
                key={rec.id}
                onClick={() => navigate(`/restaurant/${rec.id}`)}
                className="flex-shrink-0 text-xs text-brand-600 bg-white px-3 py-1.5 rounded-full border border-brand-100 hover:bg-brand-50 hover:border-brand-300 active:scale-95 transition-all"
              >
                {rec.name.split('·')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
