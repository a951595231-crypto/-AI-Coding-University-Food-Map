export const scenarioGroups = [
  {
    id: 'people',
    title: '用餐人数',
    icon: '👥',
    scenarios: [
      { id: 'solo', name: '一人食', icon: '🎧', desc: '一个人也要好好吃' },
      { id: 'date', name: '双人桌', icon: '🍽️', desc: '两人小聚·轻松愉快' },
      { id: 'group', name: '组局开饭', icon: '🎉', desc: '三五好友一起嗨' },
    ],
  },
  {
    id: 'time',
    title: '餐品类型',
    icon: '🕐',
    scenarios: [
      { id: 'breakfast', name: '早餐', icon: '🌅', desc: '元气满满的一天' },
      { id: 'meal', name: '正餐', icon: '🍚', desc: '午餐·晚餐·正经干饭' },
      { id: 'tea', name: '下午茶', icon: '☕', desc: '甜品·饮品·续命时刻' },
      { id: 'latenight', name: '宵夜', icon: '🌙', desc: '深夜觅食不孤单' },
    ],
  },
  {
    id: 'budget',
    title: '人均预算',
    icon: '💰',
    scenarios: [
      { id: 'cheap', name: '随便吃吃', icon: '🪙', desc: '人均≤15 · 简单快速' },
      { id: 'treat', name: '犒劳一下', icon: '🎁', desc: '人均15-40 · 给自己加餐' },
      { id: 'luxury', name: '偶尔奢侈', icon: '✨', desc: '人均40+ · 请客庆祝' },
    ],
  },
  {
    id: 'diet',
    title: '饮食计划',
    icon: '🥗',
    scenarios: [
      { id: 'fatlose', name: '轻盈掉秤', icon: '🏃', desc: '减脂友好·低卡轻食' },
      { id: 'muscle', name: '蛋白补给', icon: '💪', desc: '增肌高蛋白·能量满满' },
      { id: 'normal', name: '自在干饭', icon: '😋', desc: '不管热量·吃开心就好' },
    ],
  },
];

export const allScenarios = scenarioGroups.flatMap(g => g.scenarios);
