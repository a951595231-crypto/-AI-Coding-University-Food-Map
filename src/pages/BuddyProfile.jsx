import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import buddies from '../data/buddies';
import { ArrowLeft, BadgeCheck, Flag, Ban, MoreHorizontal } from 'lucide-react';
import GreetButton from '../components/GreetButton';

export default function BuddyProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const buddy = buddies.find(b => b.id === Number(userId));
  const [showActions, setShowActions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [blocked, setBlocked] = useState(false);

  if (!buddy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">用户不存在</p>
      </div>
    );
  }

  const reportReasons = ['发布不当内容', '虚假身份', '骚扰行为', '广告/营销', '其他'];

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 pt-12">
        <div className="flex items-center justify-between px-4 h-11">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="text-sm font-semibold text-gray-800">个人资料</span>
          <button onClick={() => setShowActions(!showActions)} className="w-8 h-8 flex items-center justify-center relative">
            <MoreHorizontal size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {showActions && (
        <div className="fixed inset-0 z-50" onClick={() => setShowActions(false)}>
          <div className="absolute top-12 right-4 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-36 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setBlocked(!blocked); setShowActions(false); }}
              className="w-full px-4 py-3 text-sm text-left flex items-center gap-2 hover:bg-gray-50 text-gray-700"
            >
              <Ban size={14} className="text-gray-400" />
              {blocked ? '取消拉黑' : '拉黑'}
            </button>
            <button
              onClick={() => { setShowReportModal(true); setShowActions(false); }}
              className="w-full px-4 py-3 text-sm text-left flex items-center gap-2 hover:bg-gray-50 text-red-500 border-t border-gray-50"
            >
              <Flag size={14} /> 举报
            </button>
          </div>
        </div>
      )}

      {blocked && (
        <div className="mx-5 mt-3 bg-red-50 rounded-xl p-3 flex items-center gap-2">
          <Ban size={14} className="text-red-400" />
          <span className="text-xs text-red-500">你已拉黑该用户，对方将无法查看你的信息</span>
        </div>
      )}

      <div className="flex flex-col items-center pt-8 pb-4">
        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-4xl mb-3 ring-4 ring-brand-100">
          {buddy.avatar}
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-gray-900">{buddy.nickname}</h1>
          <span className="flex items-center gap-0.5 text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
            <BadgeCheck size={11} /> 学生认证
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {buddy.university} · {buddy.major} · {buddy.grade}
        </p>
        {buddy.mbti && (
          <span className="text-[11px] text-brand-500 bg-brand-50 px-2.5 py-0.5 rounded-full mt-2 font-medium">
            {buddy.mbti}
          </span>
        )}
      </div>

      <div className="px-5 mt-2">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-sm text-gray-600 leading-relaxed">{buddy.bio}</p>
        </div>
      </div>

      <div className="px-5 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">饮食偏好</h3>
        <div className="grid grid-cols-2 gap-3">
          <InfoItem label="饮食模式" value={buddy.dietMode} />
          <InfoItem label="辣度" value={buddy.spiceLevel} />
          <InfoItem label="预算范围" value={`¥${buddy.budget}`} />
          <InfoItem label="用餐方式" value={buddy.mealPreference} />
          <InfoItem label="探店频率" value={buddy.exploFreq} />
        </div>
      </div>

      <div className="px-5 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">偏好菜系</h3>
        <div className="flex flex-wrap gap-2">
          {buddy.favCuisines.map(c => (
            <span key={c} className="text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">{c}</span>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">匹配标签</h3>
        <div className="flex flex-wrap gap-2">
          {buddy.matchTags.map(tag => (
            <span key={tag} className="text-xs text-brand-500 bg-brand-50 px-3 py-1.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <div className="px-5 mt-8">
        <GreetButton buddyId={buddy.id} variant="full" blocked={blocked} />
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setShowReportModal(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">举报用户</h3>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400">
                <span className="text-xl">×</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">请选择举报原因</p>
            <div className="space-y-2 mb-4">
              {reportReasons.map(reason => (
                <button
                  key={reason}
                  onClick={() => setReportReason(reason)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                    reportReason === reason
                      ? 'bg-brand-50 text-brand-600 border border-brand-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setShowReportModal(false); setReportReason(''); }}
              disabled={!reportReason}
              className="w-full h-11 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold rounded-xl transition-all"
            >
              提交举报
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-50">
      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value}</p>
    </div>
  );
}
