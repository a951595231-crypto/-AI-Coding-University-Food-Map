import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Eye, EyeOff, Shield, Users, MapPin, FileText } from 'lucide-react';

const visibilityItems = [
  { id: 'university', label: '所在大学', icon: '🎓' },
  { id: 'grade', label: '学历', icon: '📚' },
  { id: 'mbti', label: 'MBTI', icon: '🧠' },
  { id: 'dietMode', label: '饮食模式', icon: '🥗' },
  { id: 'cuisines', label: '偏好菜系', icon: '🍽️' },
  { id: 'bio', label: '美食宣言', icon: '💬' },
  { id: 'social', label: '社交风格', icon: '🗣️' },
  { id: 'photo', label: '拍照习惯', icon: '📸' },
];

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-10 h-6 rounded-full transition-all duration-200 flex items-center px-0.5 ${
        on ? 'bg-brand-500' : 'bg-gray-200'
      }`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
        on ? 'translate-x-4' : 'translate-x-0'
      }`} />
    </button>
  );
}

export default function PrivacySettings() {
  const navigate = useNavigate();
  const { prefs, updatePrefs } = useUser();
  const [visibility, setVisibility] = useState(prefs.visibility || {});

  const toggleVisibility = (id) => {
    const next = { ...visibility, [id]: !visibility[id] };
    setVisibility(next);
    updatePrefs({ visibility: next });
  };

  const toggleBuddy = () => {
    updatePrefs({ buddyEnabled: !prefs.buddyEnabled });
  };

  return (
    <div className="pb-10 min-h-screen bg-warm-50">
      <div className="px-5 pt-12 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">隐私设置</h1>
      </div>

      <div className="px-5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-brand-500" />
            <p className="text-sm font-semibold text-gray-700">饭搭子信息可见性</p>
          </div>
          <p className="text-xs text-gray-400 mb-3">控制在饭搭子页面中，其他用户可以看到你的哪些信息</p>

          {visibilityItems.map(item => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <Toggle on={visibility[item.id] !== false} onToggle={() => toggleVisibility(item.id)} />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 mt-3">
          <p className="text-sm font-semibold text-gray-700 mb-3">功能开关</p>
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-500" />
              <div>
                <span className="text-sm text-gray-700">饭搭子功能</span>
                <p className="text-[10px] text-gray-400">关闭后不会出现在他人的匹配列表中</p>
              </div>
            </div>
            <Toggle on={prefs.buddyEnabled !== false} onToggle={toggleBuddy} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <div>
                <span className="text-sm text-gray-700">位置信息</span>
                <p className="text-[10px] text-gray-400">仅显示所属大学，不显示精确位置</p>
              </div>
            </div>
            <span className="text-xs text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full">已模糊化</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 mt-3">
          <p className="text-sm font-semibold text-gray-700 mb-3">法律文件</p>
          <button className="w-full flex items-center justify-between py-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">用户协议</span>
            </div>
            <span className="text-xs text-gray-300">›</span>
          </button>
          <button className="w-full flex items-center justify-between py-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">隐私政策</span>
            </div>
            <span className="text-xs text-gray-300">›</span>
          </button>
          <button className="w-full flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">饭搭子信息使用说明</span>
            </div>
            <span className="text-xs text-gray-300">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
