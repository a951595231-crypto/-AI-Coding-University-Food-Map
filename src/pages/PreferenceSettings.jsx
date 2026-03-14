import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Check, X, ChevronRight } from 'lucide-react';

const cuisineOptions = ['川湘菜', '粤菜', '东北菜', '江浙菜', '日料', '韩餐', '西餐', '东南亚', '清真', '面食', '烧烤', '轻食健康', '饮品甜点', '快餐'];
const spiceOptions = ['不吃辣', '微辣', '中辣', '无辣不欢'];
const allergyOptions = ['花生', '海鲜', '乳制品', '麸质', '素食', '清真', '无'];
const dietModeOptions = ['日常干饭', '减脂中', '增肌中'];
const dietPlanOptions = { '减脂中': ['生酮', '低碳水', '地中海', '16:8轻断食', '其他'], '增肌中': ['高蛋白', '碳水循环', '其他'] };
const mealPrefOptions = ['堂食为主', '外卖为主', '我全都要'];
const priorityOptions = ['口味', '价格', '距离', '出餐速度', '环境'];
const gradeOptions = ['本科', '硕士', '博士'];
const genderOptions = ['男', '女', '不愿透露'];
const socialOptions = ['安静吃饭', '边吃边聊', '氛围感很重要'];
const photoOptions = ['吃前必拍', '偶尔拍拍', '从不拍照'];

function Row({ label, value, options, onSave, type = 'select' }) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const save = () => { onSave(temp); setEditing(false); };
  const cancel = () => { setTemp(value); setEditing(false); };

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} className="w-full flex items-center justify-between py-3.5 border-b border-gray-50 px-1">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm text-gray-800 flex items-center gap-1 max-w-[60%] text-right">
          <span className="line-clamp-1">{Array.isArray(value) ? value.join('、') : value || '未设置'}</span>
          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
        </span>
      </button>
    );
  }

  return (
    <div className="py-3 border-b border-gray-50 px-1 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex gap-2">
          <button onClick={cancel} className="text-xs text-gray-400 flex items-center gap-0.5"><X size={12} /> 取消</button>
          <button onClick={save} className="text-xs text-brand-500 font-medium flex items-center gap-0.5"><Check size={12} /> 保存</button>
        </div>
      </div>
      {(type === 'select' || type === 'multi') && options && (
        <div className="flex flex-wrap gap-1.5">
          {options.map(opt => {
            const selected = type === 'multi' ? (temp || []).includes(opt) : temp === opt;
            return (
              <button
                key={opt}
                onClick={() => {
                  if (type === 'multi') {
                    setTemp(prev => (prev || []).includes(opt) ? prev.filter(v => v !== opt) : [...(prev || []), opt]);
                  } else {
                    setTemp(opt);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  selected ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
      {type === 'text' && (
        <input type="text" value={temp || ''} onChange={(e) => setTemp(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-200" autoFocus maxLength={30} />
      )}
    </div>
  );
}

export default function PreferenceSettings() {
  const navigate = useNavigate();
  const { prefs, updatePrefs } = useUser();

  return (
    <div className="pb-10 min-h-screen bg-warm-50">
      <div className="px-5 pt-12 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">偏好设置</h1>
      </div>

      <div className="px-5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">口味与饮食</p>
          <Row label="偏好菜系" value={prefs.cuisines} options={cuisineOptions} type="multi" onSave={(v) => updatePrefs({ cuisines: v })} />
          <Row label="辣度偏好" value={prefs.spiceLevel} options={spiceOptions} onSave={(v) => updatePrefs({ spiceLevel: v })} />
          <Row label="饮食禁忌" value={prefs.allergies} options={allergyOptions} type="multi" onSave={(v) => updatePrefs({ allergies: v })} />
          <Row label="饮食模式" value={prefs.dietMode} options={dietModeOptions} onSave={(v) => updatePrefs({ dietMode: v })} />
          {prefs.dietMode && dietPlanOptions[prefs.dietMode] && (
            <Row label="细分计划" value={prefs.dietPlan} options={dietPlanOptions[prefs.dietMode]} onSave={(v) => updatePrefs({ dietPlan: v })} />
          )}
          <Row label="用餐偏好" value={prefs.mealPreference} options={mealPrefOptions} onSave={(v) => updatePrefs({ mealPreference: v })} />
          <Row label="最看重" value={prefs.priorities} options={priorityOptions} type="multi" onSave={(v) => updatePrefs({ priorities: v })} />
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 mt-3">
          <p className="text-xs text-gray-400 font-medium mb-1">个人信息</p>
          <Row label="所在大学" value={prefs.university} type="text" onSave={(v) => updatePrefs({ university: v })} />
          <Row label="学历" value={prefs.grade} options={gradeOptions} onSave={(v) => updatePrefs({ grade: v })} />
          <Row label="性别" value={prefs.gender} options={genderOptions} onSave={(v) => updatePrefs({ gender: v })} />
          <Row label="MBTI" value={prefs.mbti} type="text" onSave={(v) => updatePrefs({ mbti: v })} />
          <Row label="拍照习惯" value={prefs.photo} options={photoOptions} onSave={(v) => updatePrefs({ photo: v })} />
          <Row label="社交风格" value={prefs.social} options={socialOptions} onSave={(v) => updatePrefs({ social: v })} />
          <Row label="美食宣言" value={prefs.bio} type="text" onSave={(v) => updatePrefs({ bio: v })} />
        </div>
      </div>
    </div>
  );
}
