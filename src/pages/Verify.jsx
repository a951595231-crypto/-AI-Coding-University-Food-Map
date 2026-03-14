import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CreditCard, FileCheck, BadgeCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';

const methods = [
  {
    id: 'email',
    icon: Mail,
    title: 'edu 邮箱验证',
    desc: '使用学校邮箱接收验证码完成认证',
    tag: '推荐',
  },
  {
    id: 'card',
    icon: CreditCard,
    title: '学生证上传',
    desc: '上传学生证照片，人工审核（1-3个工作日）',
    tag: null,
  },
  {
    id: 'xuexin',
    icon: FileCheck,
    title: '学信网验证报告',
    desc: '上传学信网在线验证报告截图',
    tag: '快速',
  },
];

export default function Verify() {
  const navigate = useNavigate();
  const { prefs } = useUser();

  if (prefs.verified) {
    return (
      <div className="min-h-screen bg-warm-50 pb-10">
        <div className="px-5 pt-12 pb-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-500">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-gray-900">学历认证</h1>
        </div>
        <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4">
            <BadgeCheck size={40} className="text-teal-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">认证已通过</h2>
          <p className="text-sm text-gray-400">你的学生身份已验证，享有专属标识和福利</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 pb-10">
      <div className="px-5 pt-12 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">学历认证</h1>
      </div>

      <div className="px-5">
        <div className="bg-gradient-to-br from-teal-50 to-brand-50 rounded-2xl p-4 mb-4">
          <p className="text-sm font-semibold text-gray-700">完成认证后你将获得：</p>
          <ul className="mt-2 space-y-1.5 text-xs text-gray-500">
            <li className="flex items-center gap-2">✅ 饭搭子页面专属认证标识</li>
            <li className="flex items-center gap-2">✅ 优先匹配已认证用户</li>
            <li className="flex items-center gap-2">✅ 解锁学生专属福利和优惠</li>
          </ul>
        </div>

        <p className="text-sm font-semibold text-gray-700 mb-3">选择认证方式</p>
        <div className="space-y-3">
          {methods.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                className="w-full bg-white rounded-2xl p-4 border border-gray-100 flex items-start gap-3 hover:border-brand-200 hover:shadow-sm transition-all active:scale-[0.98] text-left"
              >
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-brand-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{m.title}</p>
                    {m.tag && (
                      <span className="text-[9px] text-brand-500 bg-brand-50 px-1.5 py-0.5 rounded font-medium">{m.tag}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 bg-gray-50 rounded-xl p-3">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            🔒 你提交的认证材料仅用于身份验证，验证通过后立即删除原始文件。我们严格遵守《个人信息保护法》保护你的隐私。
          </p>
        </div>
      </div>
    </div>
  );
}
