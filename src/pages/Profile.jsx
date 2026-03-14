import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  Ticket, Star, Settings, ChevronRight, Shield, FileText,
  Trash2, MessageSquare, Camera, X, BadgeCheck, GraduationCap, Pencil, Trophy,
} from 'lucide-react';
import restaurants from '../data/restaurants';
import achievements, { computeStats, getUnlockedAchievements } from '../data/achievements';

export default function Profile() {
  const navigate = useNavigate();
  const { prefs, updatePrefs, resetPrefs } = useUser();
  const fileInputRef = useRef(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [avatar, setAvatar] = useState(prefs.avatar || null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(prefs.bio || '');
  const [nicknameError, setNicknameError] = useState('');

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target.result);
        updatePrefs({ avatar: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      setFeedbackSent(true);
      setFeedbackText('');
      setTimeout(() => { setShowFeedback(false); setFeedbackSent(false); }, 1500);
    }
  };

  const forbiddenChars = /[<>{}\\/"'`]/;
  const validateNickname = (val) => {
    if (!val.trim()) return '昵称不能为空';
    if (val.length < 2) return '至少2个字符';
    if (val.length > 12) return '最多12个字符';
    if (forbiddenChars.test(val)) return '包含非法字符';
    return '';
  };
  const handleNicknameChange = (val) => {
    if (val.length <= 12) setNicknameInput(val);
    setNicknameError(val.length > 0 ? validateNickname(val) : '');
  };
  const handleNicknameSave = () => {
    const err = validateNickname(nicknameInput);
    if (err) { setNicknameError(err); return; }
    updatePrefs({ bio: nicknameInput.trim() });
    setShowNicknameModal(false);
  };

  const [showEquipModal, setShowEquipModal] = useState(false);
  const [pendingEquipped, setPendingEquipped] = useState([]);

  const stats = useMemo(() => computeStats(
    prefs.checkIns || [], restaurants,
    { favCount: prefs.favorites?.length || 0, textReviews: prefs.textReviews || 0, browseTimeOver3min: prefs.browseTimeOver3min || false, speedCheckIn: prefs.speedCheckIn || false }
  ), [prefs]);
  const unlockedList = useMemo(() => getUnlockedAchievements(stats), [stats]);
  const unlockedCount = unlockedList.length;
  const equipped = (prefs.equippedAchievements || []).map(id => achievements.find(a => a.id === id)).filter(Boolean);

  const openEquipModal = () => {
    setPendingEquipped(prefs.equippedAchievements || []);
    setShowEquipModal(true);
  };
  const toggleEquip = (id) => {
    setPendingEquipped(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };
  const saveEquipped = () => {
    updatePrefs({ equippedAchievements: pendingEquipped });
    setShowEquipModal(false);
  };

  const isVerified = prefs.verified;
  const tags = [
    prefs.university && prefs.university.replace('北京航空航天大学', '北航').replace('北京科技大学', '北科大').replace('中国地质大学（北京）', '地大'),
    prefs.dietMode,
    prefs.mbti,
    prefs.spiceLevel,
  ].filter(Boolean);

  function MenuItem({ icon: Icon, label, desc, onClick, danger, iconColor }) {
    return (
      <button onClick={onClick} className="w-full flex items-center gap-3 p-3.5 hover:bg-gray-50 rounded-xl transition-colors">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? 'bg-red-50' : 'bg-gray-50'}`}>
          <Icon size={18} className={danger ? 'text-red-400' : iconColor || 'text-gray-500'} />
        </div>
        <div className="flex-1 text-left">
          <p className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-gray-700'}`}>{label}</p>
          {desc && <p className="text-[11px] text-gray-400">{desc}</p>}
        </div>
        <ChevronRight size={16} className="text-gray-300" />
      </button>
    );
  }

  return (
    <div className="pb-4">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={handleAvatarClick}
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md overflow-hidden bg-gradient-to-br from-brand-200 to-brand-400">
              {avatar ? <img src={avatar} alt="头像" className="w-full h-full object-cover" /> : '😋'}
            </button>
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
              <Camera size={11} className="text-white" />
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <button onClick={() => { setNicknameInput(prefs.bio || ''); setNicknameError(''); setShowNicknameModal(true); }}
                className="flex items-center gap-1 group">
                <h1 className="text-lg font-bold text-gray-900">{prefs.bio || '美食探索者'}</h1>
                <Pencil size={12} className="text-gray-300 group-hover:text-brand-400 transition-colors" />
              </button>
              {isVerified ? (
                <span className="flex items-center gap-0.5 text-[10px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">
                  <BadgeCheck size={11} /> 学生认证
                </span>
              ) : (
                <button
                  onClick={() => navigate('/verify')}
                  className="flex items-center gap-0.5 text-[10px] text-brand-500 bg-brand-50 px-1.5 py-0.5 rounded-full hover:bg-brand-100 transition-colors"
                >
                  <GraduationCap size={11} /> 去认证
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {tags.length > 0 ? tags.map(t => (
                <span key={t} className="text-[10px] text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{t}</span>
              )) : (
                <span className="text-xs text-gray-400">完善个人信息获取更精准推荐</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Equipped Achievements */}
      <div className="px-5 mb-2">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-5">
              <button onClick={() => navigate('/achievements')} className="text-center group">
                <p className="text-lg font-bold text-gray-800">{stats.totalCheckIns}</p>
                <p className="text-[10px] text-gray-400 group-hover:text-brand-500 transition-colors">打卡</p>
              </button>
              <div className="w-px h-7 bg-gray-100" />
              <button onClick={() => navigate('/achievements')} className="text-center group">
                <p className="text-lg font-bold text-gray-800">{stats.uniqueRestaurants}</p>
                <p className="text-[10px] text-gray-400 group-hover:text-brand-500 transition-colors">探店</p>
              </button>
              <div className="w-px h-7 bg-gray-100" />
              <button onClick={() => navigate('/achievements')} className="text-center group">
                <p className="text-lg font-bold text-gray-800">{unlockedCount}</p>
                <p className="text-[10px] text-gray-400 group-hover:text-brand-500 transition-colors">成就</p>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
            <div className="flex items-center gap-2 min-w-0">
              {equipped.length > 0 ? equipped.map(a => (
                <span key={a.id} className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                  <span>{a.icon}</span> {a.name}
                </span>
              )) : (
                <span className="text-[11px] text-gray-300">还没有佩戴成就</span>
              )}
            </div>
            <button onClick={openEquipModal}
              className="flex-shrink-0 text-[11px] text-brand-500 font-medium bg-brand-50 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors flex items-center gap-1">
              <Trophy size={12} /> 佩戴成就
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-1">
        <MenuItem icon={Trophy} label="成就墙" desc={`已解锁 ${unlockedCount} 个成就`} onClick={() => navigate('/achievements')} iconColor="text-violet-500" />
        <MenuItem icon={Ticket} label="我的福利" desc="查看可用优惠券和学生专享" onClick={() => navigate('/coupons')} />
        <MenuItem icon={Star} label="我的收藏" desc={`已收藏 ${prefs.favorites?.length || 0} 家餐厅`} onClick={() => navigate('/favorites')} iconColor="text-amber-400" />
        <MenuItem icon={Settings} label="偏好设置" desc="修改口味、饮食目标、个人信息" onClick={() => navigate('/preferences')} />
        <MenuItem icon={GraduationCap} label="学历认证" desc={isVerified ? '已完成学生身份认证' : '完成认证获得专属标识'} onClick={() => navigate('/verify')} iconColor="text-teal-500" />
      </div>

      <div className="px-4 mt-6">
        <p className="text-xs text-gray-400 font-medium px-1 mb-2">隐私与安全</p>
        <div className="space-y-1">
          <MenuItem icon={Shield} label="隐私设置" desc="管理个人信息的可见范围" onClick={() => navigate('/privacy')} />
          <MenuItem icon={FileText} label="用户协议与隐私政策" onClick={() => {}} />
          <MenuItem icon={MessageSquare} label="意见反馈" desc="告诉我们你的想法和建议" onClick={() => setShowFeedback(true)} />
          <MenuItem
            icon={Trash2} label="删除个人数据" desc="清除所有个人信息和偏好数据" danger
            onClick={() => { if (confirm('确定要删除所有个人数据吗？此操作不可恢复。')) resetPrefs(); }}
          />
        </div>
      </div>

      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowFeedback(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-[430px] bg-white rounded-t-2xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            {feedbackSent ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-2">✅</p>
                <p className="text-sm font-medium text-gray-700">感谢你的反馈！</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900">意见反馈</h3>
                  <button onClick={() => setShowFeedback(false)} className="text-gray-400"><X size={20} /></button>
                </div>
                <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="请描述你的问题或建议..." className="w-full h-32 p-3 bg-gray-50 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-brand-200" autoFocus />
                <button onClick={handleFeedbackSubmit} disabled={!feedbackText.trim()}
                  className="w-full h-11 mt-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl transition-all">
                  提交反馈
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="px-5 mt-8">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-[11px] text-gray-300 leading-relaxed">
            大学城美食地图 v1.0<br />
            本应用严格遵守《个人信息保护法》<br />
            你的数据安全是我们的首要原则<br />
            ICP备xxxxxxxx号
          </p>
        </div>
      </div>

      {showEquipModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowEquipModal(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-[430px] bg-white rounded-t-2xl p-5 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-gray-900">佩戴成就</h3>
              <button onClick={() => setShowEquipModal(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">选择 1-3 个已解锁成就佩戴展示（已选 {pendingEquipped.length}/3）</p>
            {unlockedList.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">🔒</p>
                <p className="text-sm text-gray-400">还没有解锁任何成就</p>
                <button onClick={() => { setShowEquipModal(false); navigate('/achievements'); }}
                  className="text-xs text-brand-500 mt-2">去看看成就列表</button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 max-h-[50vh] overflow-y-auto pb-2">
                {unlockedList.map(a => {
                  const isSelected = pendingEquipped.includes(a.id);
                  const isFull = pendingEquipped.length >= 3 && !isSelected;
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggleEquip(a.id)}
                      disabled={isFull}
                      className={`rounded-2xl p-3 text-center transition-all border-2 ${
                        isSelected
                          ? 'border-brand-400 bg-brand-50 shadow-sm'
                          : isFull
                            ? 'border-gray-100 bg-gray-50/50 opacity-40'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <span className="text-2xl block">{a.icon}</span>
                      <p className={`text-[11px] font-semibold mt-1.5 leading-tight ${isSelected ? 'text-brand-600' : 'text-gray-700'}`}>
                        {a.name}
                      </p>
                      {isSelected && (
                        <span className="inline-block mt-1 text-[9px] text-brand-500 bg-brand-100 px-1.5 py-0.5 rounded-full">已选</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            {unlockedList.length > 0 && (
              <button onClick={saveEquipped}
                className="w-full h-11 mt-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all">
                保存佩戴
              </button>
            )}
          </div>
        </div>
      )}

      {showNicknameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8" onClick={() => setShowNicknameModal(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-900 mb-1">修改昵称</h3>
            <p className="text-[11px] text-gray-400 mb-4">2-12个字符，不支持特殊符号</p>
            <div className="relative">
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => handleNicknameChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNicknameSave()}
                maxLength={12}
                autoFocus
                className={`w-full h-11 px-4 pr-16 bg-gray-50 rounded-xl text-sm outline-none border transition-colors ${
                  nicknameError ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-brand-100 focus:border-brand-300'
                }`}
                placeholder="输入新昵称"
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] ${nicknameInput.length >= 11 ? 'text-red-400' : 'text-gray-300'}`}>
                {nicknameInput.length}/12
              </span>
            </div>
            {nicknameError && <p className="text-[11px] text-red-400 mt-1.5 px-1">{nicknameError}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowNicknameModal(false)}
                className="flex-1 h-10 text-sm text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                取消
              </button>
              <button onClick={handleNicknameSave}
                disabled={!!nicknameError || !nicknameInput.trim()}
                className="flex-1 h-10 text-sm text-white font-medium bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-400 rounded-xl transition-all">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
