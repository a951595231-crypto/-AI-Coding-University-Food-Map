import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import buddies, { getMatchedBuddies } from '../data/buddies';
import { Shield, UserCheck, AlertTriangle, ChevronRight, X, Eye, EyeOff, BadgeCheck, Heart, MessageCircle, Image, Send } from 'lucide-react';
import GreetButton from '../components/GreetButton';

const buddyTitles = {
  1: { icon: '🔥', name: '烧烤战士' },
  2: { icon: '💪', name: '自律之星' },
  3: { icon: '🦉', name: '夜行觅食家' },
  4: { icon: '☕', name: '续命大师' },
  5: { icon: '🪙', name: '人间省钱精' },
  6: { icon: '💎', name: '最专一食客' },
  7: { icon: '🧭', name: '学院路活地图' },
  8: { icon: '👨‍🍳', name: '半百食神' },
};

const ugcPosts = [
  { id: 1, userId: 1, avatar: '🧑‍🎓', nickname: '碳水星人🍚', images: ['🍜'], title: '学院路这家麻辣香锅绝了！', content: '量大实惠，两个人吃花了不到50，辣度可以自选，强烈推荐招牌麻辣香锅！', likes: 42, comments: 8, time: '2小时前' },
  { id: 2, userId: 4, avatar: '👩‍🎨', nickname: '下午茶续命☕', images: ['☕', '🍰'], title: '五道口新开的咖啡店好绝', content: '装修超适合拍照！拿铁拉花巨好看，甜品也不踩雷，和闺蜜去的。', likes: 128, comments: 23, time: '3小时前' },
  { id: 3, userId: 7, avatar: '💅', nickname: '韩料小公主👑', images: ['🥘'], title: '石锅拌饭测评｜这家最正宗', content: '试了五道口周边6家韩料店的石锅拌饭，这家的锅巴脆度和酱料比例简直完美！', likes: 87, comments: 15, time: '5小时前' },
  { id: 4, userId: 3, avatar: '🦉', nickname: '深夜觅食家🌙', images: ['🍢'], title: '凌晨2点还在营业的宝藏串串', content: '考研期间的深夜慰藉，牛肉串必点，老板人超好会送小菜。', likes: 56, comments: 11, time: '昨天' },
  { id: 5, userId: 6, avatar: '🏅', nickname: '增肌干饭人🥩', images: ['🥗'], title: '健身党的平价高蛋白餐推荐', content: '鸡胸肉沙拉+糙米饭，蛋白质含量标得很清楚，一份才18块！', likes: 73, comments: 9, time: '昨天' },
  { id: 6, userId: 2, avatar: '🏋️', nickname: '减脂打卡er💪', images: ['📊'], title: 'Day90打卡！分享我的减脂餐地图', content: '总结了学院路周边所有适合减脂的餐厅，附热量对比表。', likes: 201, comments: 34, time: '2天前' },
];

function ConsentScreen({ onConsent }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 text-center">
      <div className="text-6xl mb-6">🍽️</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">找个饭搭子</h2>
      <p className="text-sm text-gray-400 mb-8 leading-relaxed">
        基于你的口味偏好、饮食习惯，<br />为你匹配志同道合的饭搭子
      </p>
      <div className="w-full bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-3">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-brand-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">隐私保护</p>
            <p className="text-xs text-gray-400">仅展示你选择公开的信息，真实姓名不会显示</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <UserCheck size={18} className="text-brand-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">学生认证</p>
            <p className="text-xs text-gray-400">所有用户均需 edu 邮箱或学生证认证</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-brand-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">安全提示</p>
            <p className="text-xs text-gray-400">建议选择公共场所见面，告知朋友你的行程</p>
          </div>
        </div>
      </div>
      <div className="w-full space-y-3">
        <button onClick={() => onConsent(true)} className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl transition-all active:scale-[0.98]">
          同意并开启
        </button>
        <button onClick={() => onConsent(false)} className="w-full h-10 text-gray-400 text-sm hover:text-gray-600 transition-colors">
          暂不开启
        </button>
      </div>
      <p className="text-[10px] text-gray-300 mt-4 leading-relaxed">
        点击"同意并开启"即表示你已阅读并同意<br />
        <span className="text-brand-400 underline">《用户协议》</span>、
        <span className="text-brand-400 underline">《隐私政策》</span>和
        <span className="text-brand-400 underline">《饭搭子信息使用说明》</span>
      </p>
    </div>
  );
}

function DeclinedScreen() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 text-center">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-lg font-bold text-gray-700 mb-2">饭搭子功能未开启</h2>
      <p className="text-sm text-gray-400 leading-relaxed">
        你可以随时在「我的 → 设置」中开启此功能
      </p>
    </div>
  );
}

function BuddyCard({ buddy, onViewProfile }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-50 shadow-sm">
      <div className="flex items-start gap-3">
        <button onClick={() => onViewProfile(buddy.id)} className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-2xl flex-shrink-0 hover:ring-2 hover:ring-brand-200 transition-all">
          {buddy.avatar}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => onViewProfile(buddy.id)} className="font-semibold text-[15px] text-gray-800 hover:text-brand-500 transition-colors">{buddy.nickname}</button>
            <span className="flex items-center gap-0.5 text-[9px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
              <BadgeCheck size={10} /> 学生认证
            </span>
            {buddyTitles[buddy.id] && (
              <span className="flex items-center gap-0.5 text-[9px] text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                {buddyTitles[buddy.id].icon} {buddyTitles[buddy.id].name}
              </span>
            )}
            {buddy.matchScore > 0 && (
              <span className="text-xs font-semibold text-brand-500 bg-brand-50 px-2 py-0.5 rounded-full ml-auto">
                {buddy.matchScore}% 匹配
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {buddy.university.replace('北京航空航天大学', '北航').replace('北京科技大学', '北科大').replace('中国地质大学（北京）', '地大').replace('中国地质大学', '地大')}
            {buddy.grade && ` · ${buddy.grade}`}
            {buddy.mbti && ` · ${buddy.mbti}`}
          </p>
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{buddy.bio}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {buddy.matchTags.slice(0, 4).map(tag => (
              <span key={tag} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-50 space-y-2 animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-400">饮食模式<span className="ml-2 text-gray-600">{buddy.dietMode}</span></div>
            <div className="text-gray-400">辣度<span className="ml-2 text-gray-600">{buddy.spiceLevel}</span></div>
            <div className="text-gray-400">预算<span className="ml-2 text-gray-600">¥{buddy.budget}</span></div>
            <div className="text-gray-400">用餐偏好<span className="ml-2 text-gray-600">{buddy.mealPreference}</span></div>
            <div className="text-gray-400">探店频率<span className="ml-2 text-gray-600">{buddy.exploFreq}</span></div>
          </div>
          <div className="text-xs text-gray-400">
            偏好菜系<span className="ml-2 text-gray-600">{buddy.favCuisines.join('、')}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2">
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-gray-400 flex items-center gap-1 hover:text-gray-600">
          {expanded ? <EyeOff size={12} /> : <Eye size={12} />}
          {expanded ? '收起' : '查看更多'}
        </button>
        <GreetButton buddyId={buddy.id} />
      </div>
    </div>
  );
}

function FeedCard({ post, onViewProfile }) {
  const [liked, setLiked] = useState(false);
  const likeCount = liked ? post.likes + 1 : post.likes;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-50 shadow-sm break-inside-avoid mb-3">
      <div className="aspect-[4/3] bg-gradient-to-br from-brand-50 to-orange-50 flex items-center justify-center">
        <span className="text-5xl">{post.images[0]}</span>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">{post.title}</h3>
        <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{post.content}</p>
        <div className="flex items-center justify-between mt-3">
          <button onClick={() => onViewProfile(post.userId)} className="flex items-center gap-1.5 min-w-0 group">
            <span className="text-lg group-hover:scale-110 transition-transform">{post.avatar}</span>
            <span className="text-[11px] text-gray-500 truncate group-hover:text-brand-500 transition-colors">{post.nickname}</span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => setLiked(!liked)} className={`flex items-center gap-0.5 text-[11px] ${liked ? 'text-red-400' : 'text-gray-300'}`}>
              <Heart size={13} fill={liked ? 'currentColor' : 'none'} /> {likeCount}
            </button>
            <span className="flex items-center gap-0.5 text-[11px] text-gray-300">
              <MessageCircle size={13} /> {post.comments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FindBuddyTab({ prefs, onViewProfile }) {
  const matched = getMatchedBuddies(prefs);

  return (
    <div>
      <div className="px-5 mb-4">
        <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2">
          <Shield size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-blue-400 leading-relaxed">
            所有用户信息均已脱敏，仅展示对方选择公开的内容。如遇问题可随时举报。
          </p>
        </div>
      </div>
      <div className="px-4 space-y-3">
        {matched.map(buddy => (
          <BuddyCard key={buddy.id} buddy={buddy} onViewProfile={onViewProfile} />
        ))}
      </div>
    </div>
  );
}

function FoodCircleTab({ onViewProfile }) {
  return (
    <div className="px-4">
      <div className="columns-2 gap-3">
        {ugcPosts.map(post => (
          <FeedCard key={post.id} post={post} onViewProfile={onViewProfile} />
        ))}
      </div>
    </div>
  );
}

function MessagesTab({ greetedSet, readChats, onViewProfile, onChat }) {
  const greeted = buddies.filter(b => greetedSet.includes(b.id));
  const unreadSet = greetedSet.filter(id => !readChats.includes(id));

  if (greeted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <div className="text-5xl mb-4">💬</div>
        <p className="text-sm text-gray-400 leading-relaxed">还没有私信<br />去「找搭子」打个招呼开启对话吧</p>
      </div>
    );
  }

  const mockLastMessages = [
    '好呀好呀！你平时喜欢吃什么~',
    '可以的！最近有想去的店吗？',
    '哈哈我也是！什么时候方便约一下？',
    '学院路那边有家新开的还不错',
    '太好了，加个微信吧方便约时间~',
    '我也正想找人一起去！',
    '周末有空一起去试试吗',
    '那家店我也想去！',
  ];
  const mockTimes = ['刚刚', '5分钟前', '1小时前', '3小时前', '昨天', '昨天', '2天前', '3天前'];

  const sorted = [...greeted].sort((a, b) => {
    const aUnread = unreadSet.includes(a.id) ? 0 : 1;
    const bUnread = unreadSet.includes(b.id) ? 0 : 1;
    return aUnread - bUnread;
  });

  return (
    <div className="px-4">
      <div className="space-y-1">
        {sorted.map((buddy, idx) => {
          const isUnread = unreadSet.includes(buddy.id);
          return (
            <button
              key={buddy.id}
              onClick={() => onChat(buddy.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left ${
                isUnread ? 'bg-brand-50/40 hover:bg-brand-50/60' : 'hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-2xl">
                  {buddy.avatar}
                </div>
                {isUnread && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm truncate ${isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                    {buddy.nickname}
                  </span>
                  <span className="text-[10px] text-gray-300 flex-shrink-0 ml-2">{mockTimes[idx % mockTimes.length]}</span>
                </div>
                <p className={`text-xs mt-0.5 truncate ${isUnread ? 'text-gray-600' : 'text-gray-400'}`}>
                  {mockLastMessages[idx % mockLastMessages.length]}
                </p>
              </div>
              {isUnread ? (
                <span className="w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center flex-shrink-0">1</span>
              ) : (
                <ChevronRight size={14} className="text-gray-200 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DiningBuddy() {
  const { prefs, updatePrefs } = useUser();
  const navigate = useNavigate();
  const [localConsent, setLocalConsent] = useState(prefs.buddyConsent);
  const [activeTab, setActiveTab] = useState('find');

  const handleConsent = (agreed) => {
    if (agreed) {
      updatePrefs({ buddyConsent: true });
      setLocalConsent(true);
    } else {
      setLocalConsent('declined');
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/buddy-profile/${userId}`);
  };

  if (!localConsent) return <ConsentScreen onConsent={handleConsent} />;
  if (localConsent === 'declined') return <DeclinedScreen />;

  const handleChat = (buddyId) => {
    navigate(`/chat/${buddyId}`);
  };

  const greetedSet = prefs.greetedSet || [];
  const readChats = prefs.readChats || [];
  const unreadCount = greetedSet.filter(id => !readChats.includes(id)).length;

  const tabs = [
    { id: 'find', label: '找搭子' },
    { id: 'circle', label: '饭友圈' },
    { id: 'messages', label: '私信', badge: unreadCount },
  ];

  return (
    <div className="pb-24">
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-xl font-bold text-gray-900">饭搭子</h1>
      </div>

      <div className="px-5 mb-4">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all relative ${
                activeTab === tab.id
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
              {tab.badge > 0 && activeTab !== tab.id && (
                <span className="absolute -top-1 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'find' && <FindBuddyTab prefs={prefs} onViewProfile={handleViewProfile} />}
      {activeTab === 'circle' && <FoodCircleTab onViewProfile={handleViewProfile} />}
      {activeTab === 'messages' && <MessagesTab greetedSet={greetedSet} readChats={readChats} onViewProfile={handleViewProfile} onChat={handleChat} />}
    </div>
  );
}
