import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { MessageCircle, Check, Send } from 'lucide-react';

export default function GreetButton({ buddyId, variant = 'default', blocked = false }) {
  const navigate = useNavigate();
  const { prefs, updatePrefs } = useUser();
  const greetedSet = prefs.greetedSet || [];
  const alreadyGreeted = greetedSet.includes(buddyId);
  const [justGreeted, setJustGreeted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleGreet = () => {
    if (alreadyGreeted || blocked) return;
    const newSet = [...greetedSet, buddyId];
    updatePrefs({ greetedSet: newSet, greetedBuddies: newSet.length });
    setJustGreeted(true);
    setShowToast(true);
  };

  const goChat = () => navigate(`/chat/${buddyId}`);

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  const isGreeted = alreadyGreeted || justGreeted;

  if (variant === 'full') {
    return (
      <div className="relative space-y-2">
        {!isGreeted && !blocked && (
          <button
            onClick={handleGreet}
            className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <MessageCircle size={16} /> 打个招呼
          </button>
        )}
        {isGreeted && !blocked && (
          <button
            onClick={goChat}
            className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Send size={16} /> 发消息
          </button>
        )}
        {blocked && (
          <button disabled className="w-full h-12 bg-gray-100 text-gray-300 rounded-2xl text-sm font-semibold cursor-not-allowed">
            已拉黑
          </button>
        )}
        {showToast && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-xl shadow-lg animate-fade-in whitespace-nowrap">
            👋 招呼已发送！
          </div>
        )}
      </div>
    );
  }

  if (isGreeted) {
    return (
      <button
        onClick={goChat}
        className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-full transition-all text-brand-500 bg-brand-50 hover:bg-brand-100"
      >
        <Send size={11} /> 发消息
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleGreet}
        disabled={blocked}
        className="text-xs font-medium flex items-center gap-0.5 px-3 py-1.5 rounded-full transition-all text-brand-500 bg-brand-50 hover:bg-brand-100"
      >
        <MessageCircle size={11} /> 打个招呼
      </button>
      {showToast && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg animate-fade-in whitespace-nowrap z-10">
          👋 招呼已发送！
        </div>
      )}
    </div>
  );
}
