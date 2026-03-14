import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ChevronRight, ChevronLeft, Sparkles, ChevronDown, Search } from 'lucide-react';

const cuisineOptions = ['川湘菜', '粤菜', '东北菜', '江浙菜', '日料', '韩餐', '西餐', '东南亚', '清真', '面食', '烧烤', '轻食健康', '饮品甜点', '快餐'];
const spiceOptions = ['不吃辣', '微辣', '中辣', '无辣不欢'];
const allergyOptions = ['花生', '海鲜', '乳制品', '麸质', '素食', '清真', '无'];
const dietModeOptions = ['日常干饭', '减脂中', '增肌中'];
const dietPlanOptions = { '减脂中': ['生酮', '低碳水', '地中海', '16:8轻断食', '其他'], '增肌中': ['高蛋白', '碳水循环', '其他'] };
const mealPrefOptions = ['堂食为主', '外卖为主', '我全都要'];
const priorityOptions = ['口味', '价格', '距离', '出餐速度', '环境'];
const universityOptions = ['北京航空航天大学', '北京大学', '清华大学', '北京科技大学', '中国地质大学（北京）', '北京师范大学', '中国人民大学', '北京理工大学', '中央财经大学', '北京林业大学'];
const gradeOptions = ['本科', '硕士', '博士'];
const genderOptions = ['男', '女', '不愿透露'];
const photoOptions = ['吃前必拍', '偶尔拍拍', '从不拍照'];
const socialOptions = ['安静吃饭', '边吃边聊', '氛围感很重要'];

const mbtiDimensions = [
  { id: 'ei', label: '能量来源', options: [{ value: 'E', label: 'E 外向', desc: '从社交获取能量' }, { value: 'I', label: 'I 内向', desc: '从独处获取能量' }] },
  { id: 'sn', label: '信息获取', options: [{ value: 'S', label: 'S 实感', desc: '关注具体事实' }, { value: 'N', label: 'N 直觉', desc: '关注可能性' }] },
  { id: 'tf', label: '决策方式', options: [{ value: 'T', label: 'T 思考', desc: '逻辑分析优先' }, { value: 'F', label: 'F 情感', desc: '价值感受优先' }] },
  { id: 'jp', label: '生活方式', options: [{ value: 'J', label: 'J 判断', desc: '喜欢计划和秩序' }, { value: 'P', label: 'P 知觉', desc: '喜欢灵活随性' }] },
];

function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 border ${
        selected
          ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
      }`}
    >
      {label}
    </button>
  );
}

function SelectChip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 border ${
        selected
          ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
      }`}
    >
      {label}
    </button>
  );
}

function UniversityDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = universityOptions.filter(u => u.includes(query));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${
          value ? 'border-brand-300 bg-brand-50 text-gray-800' : 'border-gray-200 bg-white text-gray-400'
        }`}
      >
        <span>{value || '选择或搜索大学...'}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-20 max-h-56 overflow-hidden animate-fade-in">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索大学..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 rounded-lg outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-40">
            {filtered.map(u => (
              <button
                key={u}
                onClick={() => { onChange(u); setOpen(false); setQuery(''); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50 transition-colors ${
                  value === u ? 'text-brand-500 font-medium bg-brand-50' : 'text-gray-700'
                }`}
              >
                {u}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-xs text-gray-400 text-center">未找到，可直接输入</p>
            )}
          </div>
          {query && !universityOptions.includes(query) && (
            <button
              onClick={() => { onChange(query); setOpen(false); setQuery(''); }}
              className="w-full text-left px-4 py-2.5 text-sm text-brand-500 border-t border-gray-100 hover:bg-brand-50"
            >
              使用 "{query}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function MBTIPicker({ value, onChange }) {
  const [dims, setDims] = useState(() => {
    if (value && value.length === 4) {
      return { ei: value[0], sn: value[1], tf: value[2], jp: value[3] };
    }
    return { ei: '', sn: '', tf: '', jp: '' };
  });

  const handleSelect = (dimId, val) => {
    const next = { ...dims, [dimId]: val };
    setDims(next);
    const result = next.ei + next.sn + next.tf + next.jp;
    onChange(result.length === 4 ? result : '');
  };

  return (
    <div className="space-y-3">
      {mbtiDimensions.map(dim => (
        <div key={dim.id}>
          <p className="text-[11px] text-gray-400 mb-1.5">{dim.label}</p>
          <div className="grid grid-cols-2 gap-2">
            {dim.options.map(opt => {
              const isSelected = dims[dim.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(dim.id, opt.value)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-brand-200'
                  }`}
                >
                  <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-brand-600' : 'text-gray-700'}`}>
                    {opt.label}
                  </span>
                  <span className="block text-[10px] text-gray-400 mt-0.5">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {value && value.length === 4 && (
        <div className="bg-brand-50 rounded-xl p-2.5 text-center animate-fade-in">
          <span className="text-sm font-bold text-brand-600">你的 MBTI：{value}</span>
        </div>
      )}
    </div>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(-1);
  const { prefs, updatePrefs } = useUser();
  const navigate = useNavigate();

  const [local, setLocal] = useState({
    cuisines: prefs.cuisines || [],
    spiceLevel: prefs.spiceLevel || '',
    allergies: prefs.allergies || [],
    dietMode: prefs.dietMode || '',
    dietPlan: prefs.dietPlan || '',
    mealPreference: prefs.mealPreference || '',
    priorities: prefs.priorities || [],
    university: prefs.university || '',
    grade: prefs.grade || '',
    gender: prefs.gender || '',
    mbti: prefs.mbti || '',
    photo: prefs.photo || '',
    social: prefs.social || '',
    bio: prefs.bio || '',
  });

  const toggle = (field, value) => {
    setLocal(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  const set = (field, value) => {
    setLocal(prev => ({ ...prev, [field]: value }));
  };

  const finish = () => {
    updatePrefs({ ...local, onboarded: true });
    navigate('/');
  };

  const skip = () => {
    updatePrefs({ onboarded: true });
    navigate('/');
  };

  const steps = [
    {
      title: '你的口味偏好',
      subtitle: '告诉我们你喜欢什么，推荐更精准',
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2.5">偏好菜系（可多选）</p>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map(c => (
                <Chip key={c} label={c} selected={local.cuisines.includes(c)} onClick={() => toggle('cuisines', c)} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2.5">辣度偏好</p>
            <div className="flex flex-wrap gap-2">
              {spiceOptions.map(s => (
                <SelectChip key={s} label={s} selected={local.spiceLevel === s} onClick={() => set('spiceLevel', s)} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2.5">饮食禁忌/过敏原</p>
            <div className="flex flex-wrap gap-2">
              {allergyOptions.map(a => (
                <Chip key={a} label={a} selected={local.allergies.includes(a)} onClick={() => toggle('allergies', a)} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '你的饮食目标',
      subtitle: '帮你匹配最合适的餐厅和菜品',
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2.5">饮食模式</p>
            <div className="flex flex-wrap gap-2">
              {dietModeOptions.map(d => (
                <SelectChip key={d} label={d} selected={local.dietMode === d} onClick={() => set('dietMode', d)} />
              ))}
            </div>
            {local.dietMode && dietPlanOptions[local.dietMode] && (
              <div className="mt-3 pl-2 border-l-2 border-brand-200">
                <p className="text-xs text-gray-500 mb-2">细分计划（选填）</p>
                <div className="flex flex-wrap gap-2">
                  {dietPlanOptions[local.dietMode].map(p => (
                    <Chip key={p} label={p} selected={local.dietPlan === p} onClick={() => set('dietPlan', p)} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2.5">用餐偏好</p>
            <div className="flex flex-wrap gap-2">
              {mealPrefOptions.map(m => (
                <SelectChip key={m} label={m} selected={local.mealPreference === m} onClick={() => set('mealPreference', m)} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2.5">最看重什么（可多选）</p>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map(p => (
                <Chip key={p} label={p} selected={local.priorities.includes(p)} onClick={() => toggle('priorities', p)} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '关于你',
      subtitle: '以下全部选填，让推荐更懂你',
      content: (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">所在大学</p>
            <UniversityDropdown value={local.university} onChange={(v) => set('university', v)} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">学历</p>
            <div className="flex flex-wrap gap-2">
              {gradeOptions.map(g => (
                <SelectChip key={g} label={g} selected={local.grade === g} onClick={() => set('grade', g)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">性别</p>
            <div className="flex flex-wrap gap-2">
              {genderOptions.map(g => (
                <SelectChip key={g} label={g} selected={local.gender === g} onClick={() => set('gender', g)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">MBTI</p>
            <MBTIPicker value={local.mbti} onChange={(v) => set('mbti', v)} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">拍照习惯</p>
            <div className="flex flex-wrap gap-2">
              {photoOptions.map(p => (
                <SelectChip key={p} label={p} selected={local.photo === p} onClick={() => set('photo', p)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">用餐社交风格</p>
            <div className="flex flex-wrap gap-2">
              {socialOptions.map(s => (
                <SelectChip key={s} label={s} selected={local.social === s} onClick={() => set('social', s)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">一句话美食宣言</p>
            <input
              type="text"
              value={local.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="如：无辣不欢的川菜胃"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-200"
              maxLength={30}
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 leading-relaxed">
              🔒 你的信息仅用于个性化推荐，不会公开展示。你可以随时在"我的 → 设置"中修改或删除全部数据。
            </p>
          </div>
        </div>
      ),
    },
  ];

  if (step === -1) {
    return (
      <div className="min-h-screen bg-warm-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-8 pt-12 text-center">
          <div className="text-6xl mb-6 animate-fade-in">🍽️</div>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug animate-fade-in">
            吃什么？<br />我们帮你想好了。
          </h1>
          <p className="text-sm text-gray-400 mt-3 mb-10 leading-relaxed animate-fade-in max-w-[280px]">
            五道口 · 学院路大学城的专属美食指南<br />
            从此告别「今天吃什么」的世纪难题
          </p>

          <div className="w-full space-y-4 mb-8">
            {[
              { icon: '🎯', title: '越吃越懂你', desc: '基于你的口味、预算和饮食目标，智能推荐最合拍的餐厅' },
              { icon: '🏆', title: '真实榜单，拒绝水军', desc: '学生打卡数据驱动的排行榜，好不好吃同学说了算' },
              { icon: '🤝', title: '找个人一起吃', desc: '匹配口味相投的饭搭子，干饭不孤单' },
              { icon: '✨', title: '打卡集成就', desc: '记录每一顿，解锁「夜行觅食家」「选择困难症」等趣味成就' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-left bg-white rounded-2xl p-4 border border-gray-50 shadow-sm animate-fade-in"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 pb-8 space-y-3">
          <button
            onClick={() => setStep(0)}
            className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-lg shadow-brand-200"
          >
            花 1 分钟告诉我你的口味 <ChevronRight size={18} />
          </button>
          <button onClick={skip} className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2">
            先逛逛再说
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div>
          {step === 0 ? (
            <button onClick={() => setStep(-1)} className="flex items-center gap-1 text-gray-400 text-sm">
              <ChevronLeft size={18} /> 返回
            </button>
          ) : (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-gray-400 text-sm">
              <ChevronLeft size={18} /> 上一步
            </button>
          )}
        </div>
        <button onClick={skip} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          跳过
        </button>
      </div>

      <div className="flex gap-1.5 px-5 mb-6">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-brand-400' : 'bg-gray-200'}`} />
        ))}
      </div>

      <div className="px-5 mb-4">
        <h1 className="text-xl font-bold text-gray-900">{steps[step].title}</h1>
        <p className="text-sm text-gray-400 mt-1">{steps[step].subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {steps[step].content}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 bg-white/80 backdrop-blur-xl border-t border-gray-100">
        {step < 2 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
          >
            下一步 <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={finish}
            className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
          >
            <Sparkles size={18} /> 开始探索美食
          </button>
        )}
      </div>
    </div>
  );
}
