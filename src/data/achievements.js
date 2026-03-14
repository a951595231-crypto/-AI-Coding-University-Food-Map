const achievements = [
  // ===== 打卡里程碑 =====
  { id: 'first-bite', name: '第一口', icon: '🍴', desc: '完成首次打卡', category: '打卡', hidden: false, check: (s) => s.totalCheckIns >= 1 },
  { id: 'regular', name: '常客养成中', icon: '🏠', desc: '累计打卡 10 次', category: '打卡', hidden: false, check: (s) => s.totalCheckIns >= 10 },
  { id: 'foodie-50', name: '半百食神', icon: '👨‍🍳', desc: '累计打卡 50 次', category: '打卡', hidden: false, check: (s) => s.totalCheckIns >= 50 },
  { id: 'centurion', name: '百次朝圣', icon: '💯', desc: '累计打卡 100 次', category: '打卡', hidden: false, check: (s) => s.totalCheckIns >= 100 },

  // ===== 探店广度 =====
  { id: 'explorer-3', name: '美食新手村', icon: '🗺️', desc: '解锁 3 家不同餐厅', category: '探店', hidden: false, check: (s) => s.uniqueRestaurants >= 3 },
  { id: 'explorer-10', name: '学院路活地图', icon: '🧭', desc: '解锁 10 家不同餐厅', category: '探店', hidden: false, check: (s) => s.uniqueRestaurants >= 10 },
  { id: 'explorer-all', name: '全图鉴收集者', icon: '📖', desc: '打卡所有已收录餐厅', category: '探店', hidden: false, check: (s) => s.uniqueRestaurants >= 20 },

  // ===== 专一/复购 =====
  { id: 'loyal-3', name: '真爱粉', icon: '💕', desc: '同一家店打卡 3 次', category: '专一', hidden: false, check: (s) => s.maxSingleRestaurant >= 3 },
  { id: 'loyal-10', name: '最专一食客', icon: '💎', desc: '同一家店打卡 10 次', category: '专一', hidden: false, check: (s) => s.maxSingleRestaurant >= 10 },
  { id: 'loyal-20', name: '铁杆VIP', icon: '👑', desc: '同一家店打卡 20 次', category: '专一', hidden: false, check: (s) => s.maxSingleRestaurant >= 20 },

  // ===== 品类达人 =====
  { id: 'coffee-3', name: '咖啡因依赖', icon: '☕', desc: '奶茶/咖啡类打卡 3 次', category: '品类', hidden: false, check: (s) => (s.categoryCount['奶茶咖啡'] || 0) >= 3 },
  { id: 'coffee-10', name: '续命大师', icon: '🏆', desc: '奶茶/咖啡类打卡 10 次', category: '品类', hidden: false, check: (s) => (s.categoryCount['奶茶咖啡'] || 0) >= 10 },
  { id: 'bbq-5', name: '烧烤战士', icon: '🔥', desc: '烧烤类打卡 5 次', category: '品类', hidden: false, check: (s) => (s.categoryCount['龙虾烧烤'] || 0) >= 5 },
  { id: 'healthy-5', name: '自律之星', icon: '💪', desc: '轻食/健康餐打卡 5 次', category: '品类', hidden: false, check: (s) => (s.categoryCount['轻食沙拉'] || 0) >= 5 },
  { id: 'dessert-5', name: '甜蜜星人', icon: '🧁', desc: '烘焙甜点打卡 5 次', category: '品类', hidden: false, check: (s) => (s.categoryCount['烘焙甜点'] || 0) >= 5 },

  // ===== 时间相关 =====
  { id: 'night-owl', name: '夜行觅食家', icon: '🦉', desc: '22:00 后打卡 3 次', category: '时间', hidden: false, check: (s) => s.lateNightCheckIns >= 3 },
  { id: 'early-bird', name: '早起的鸟儿', icon: '🐦', desc: '8:00 前打卡 3 次', category: '时间', hidden: false, check: (s) => s.earlyCheckIns >= 3 },
  { id: 'streak-3', name: '连续签到', icon: '📅', desc: '连续 3 天打卡', category: '时间', hidden: false, check: (s) => s.maxStreak >= 3 },
  { id: 'streak-7', name: '一周全勤', icon: '🌟', desc: '连续 7 天打卡', category: '时间', hidden: false, check: (s) => s.maxStreak >= 7 },

  // ===== 趣味/行为成就 =====
  { id: 'indecisive', name: '超高校级的选择困难症', icon: '🤯', desc: '在选择页面停留超过 3 分钟', category: '隐藏', hidden: true, check: (s) => s.browseTimeOver3min },
  { id: 'speed-run', name: '饿到模糊', icon: '⚡', desc: '进入页面 10 秒内就打卡了', category: '隐藏', hidden: true, check: (s) => s.speedCheckIn },
  { id: 'social-butterfly', name: '社交蝴蝶', icon: '🦋', desc: '向 5 位不同饭搭子打招呼', category: '隐藏', hidden: true, check: (s) => s.greetedBuddies >= 5 },
  { id: 'collector', name: '收藏癖晚期', icon: '⭐', desc: '收藏超过 15 家餐厅', category: '隐藏', hidden: true, check: (s) => s.favCount >= 15 },
  { id: 'reviewer', name: '大众点评附体', icon: '📝', desc: '写了 5 条带文字的评价', category: '隐藏', hidden: true, check: (s) => s.textReviews >= 5 },
  { id: 'variety-king', name: '雨露均沾', icon: '🎰', desc: '一周内打卡 5 家不同类型餐厅', category: '隐藏', hidden: true, check: (s) => s.weeklyVariety >= 5 },
  { id: 'midnight-feast', name: '凌晨の美食猎人', icon: '🌙', desc: '0:00-5:00 打卡', category: '隐藏', hidden: true, check: (s) => s.midnightCheckIn },
  { id: 'same-day-3', name: '干饭机器', icon: '🤖', desc: '同一天打卡 3 家不同餐厅', category: '隐藏', hidden: true, check: (s) => s.sameDayMax >= 3 },
  { id: 'budget-master', name: '人间省钱精', icon: '🪙', desc: '打卡的餐厅平均人均 ≤15 元', category: '隐藏', hidden: true, check: (s) => s.avgBudget > 0 && s.avgBudget <= 15 },
  { id: 'big-spender', name: '学生中的贵族', icon: '💸', desc: '打卡人均 ≥80 元的餐厅', category: '隐藏', hidden: true, check: (s) => s.hasExpensiveCheckIn },
];

export default achievements;

export function computeStats(checkIns, restaurants, extras = {}) {
  const now = Date.now();
  const restMap = {};
  restaurants.forEach(r => { restMap[r.id] = r; });

  const totalCheckIns = checkIns.length;
  const restaurantCounts = {};
  const categoryCount = {};
  let lateNightCheckIns = 0;
  let earlyCheckIns = 0;
  let midnightCheckIn = false;
  let avgBudget = 0;
  let hasExpensiveCheckIn = false;
  const dayMap = {};
  let sameDayMax = 0;
  const weekAgo = now - 7 * 86400000;
  const weekCategories = new Set();

  checkIns.forEach(ci => {
    const rid = ci.restaurantId;
    restaurantCounts[rid] = (restaurantCounts[rid] || 0) + 1;
    const r = restMap[rid];
    if (r) {
      const catTag = r.categoryTag || '';
      categoryCount[catTag] = (categoryCount[catTag] || 0) + 1;
      avgBudget += r.avgPrice || 0;
      if (r.avgPrice >= 80) hasExpensiveCheckIn = true;
      if (ci.timestamp > weekAgo) weekCategories.add(catTag);
    }
    const d = new Date(ci.timestamp);
    const h = d.getHours();
    if (h >= 22) lateNightCheckIns++;
    if (h < 8) earlyCheckIns++;
    if (h >= 0 && h < 5) midnightCheckIn = true;

    const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!dayMap[dayKey]) dayMap[dayKey] = new Set();
    dayMap[dayKey].add(rid);
  });

  Object.values(dayMap).forEach(s => { if (s.size > sameDayMax) sameDayMax = s.size; });
  if (totalCheckIns > 0) avgBudget = Math.round(avgBudget / totalCheckIns);

  const sortedDays = Object.keys(dayMap).sort();
  let maxStreak = 0, streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    const curr = new Date(sortedDays[i]);
    const diff = (curr - prev) / 86400000;
    if (diff <= 1) { streak++; } else { streak = 1; }
    if (streak > maxStreak) maxStreak = streak;
  }
  if (sortedDays.length === 1) maxStreak = 1;

  return {
    totalCheckIns,
    uniqueRestaurants: Object.keys(restaurantCounts).length,
    maxSingleRestaurant: Math.max(0, ...Object.values(restaurantCounts)),
    categoryCount,
    lateNightCheckIns,
    earlyCheckIns,
    midnightCheckIn,
    maxStreak,
    sameDayMax,
    avgBudget,
    hasExpensiveCheckIn,
    weeklyVariety: weekCategories.size,
    favCount: extras.favCount || 0,
    textReviews: extras.textReviews || 0,
    greetedBuddies: extras.greetedBuddies || 0,
    browseTimeOver3min: extras.browseTimeOver3min || false,
    speedCheckIn: extras.speedCheckIn || false,
    restaurantCounts,
  };
}

export function getUnlockedAchievements(stats) {
  return achievements.filter(a => a.check(stats));
}

export function getPrimaryTitle(stats) {
  const unlocked = getUnlockedAchievements(stats);
  if (unlocked.length === 0) return null;
  const priority = ['loyal-20', 'centurion', 'coffee-10', 'explorer-all', 'foodie-50', 'loyal-10',
    'streak-7', 'bbq-5', 'healthy-5', 'coffee-3', 'explorer-10', 'night-owl', 'regular', 'explorer-3', 'first-bite'];
  for (const pid of priority) {
    const found = unlocked.find(a => a.id === pid);
    if (found) return found;
  }
  return unlocked[unlocked.length - 1];
}
