import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import buddies from '../data/buddies';
import { ArrowLeft, Send, BadgeCheck } from 'lucide-react';

const autoReplies = [
  '好呀好呀！你平时喜欢吃什么~',
  '可以的！最近有想去的店吗？',
  '哈哈我也是！什么时候方便约一下？',
  '学院路那边有家新开的还不错，要不要一起试试',
  '我也正想找人一起去！',
  '太好了，加个微信吧方便约时间~',
];

export default function Chat() {
  const { buddyId } = useParams();
  const navigate = useNavigate();
  const { markChatRead } = useUser();
  const buddy = buddies.find(b => b.id === Number(buddyId));

  useEffect(() => {
    if (buddy) markChatRead(buddy.id);
  }, [buddy, markChatRead]);
  const [messages, setMessages] = useState([
    { id: 0, from: 'me', text: '👋 Hi～看到你的资料觉得口味很合，想约个饭！', time: '刚刚' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const replyIndex = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const quickMessages = ['在吗？想约个饭', '最近有空吗~', '学院路有啥推荐的不', '一起去探店呀！'];

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), from: 'me', text: text.trim(), time: '刚刚' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    setTyping(true);
    const delay = 800 + Math.random() * 1500;
    setTimeout(() => {
      setTyping(false);
      const reply = autoReplies[replyIndex.current % autoReplies.length];
      replyIndex.current++;
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'buddy', text: reply, time: '刚刚' }]);
    }, delay);
  };

  if (!buddy) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">用户不存在</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 pt-12">
        <div className="flex items-center gap-3 px-4 h-12">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <button onClick={() => navigate(`/buddy-profile/${buddy.id}`)} className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-lg flex-shrink-0">
              {buddy.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-800 truncate">{buddy.nickname}</span>
                <BadgeCheck size={12} className="text-teal-500 flex-shrink-0" />
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="bg-amber-50 rounded-xl px-3 py-2 flex items-start gap-2">
          <span className="text-amber-500 text-xs mt-0.5">⚠️</span>
          <p className="text-[11px] text-amber-600 leading-relaxed">
            注意保护个人隐私，不要轻易透露手机号、住址等信息。线下见面请选择公共场所。
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'buddy' && (
              <div className="w-7 h-7 bg-brand-50 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1">
                {buddy.avatar}
              </div>
            )}
            <div className={`max-w-[75%] ${msg.from === 'me' ? 'order-1' : ''}`}>
              <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.from === 'me'
                  ? 'bg-brand-500 text-white rounded-tr-md'
                  : 'bg-white text-gray-700 border border-gray-100 rounded-tl-md'
              }`}>
                {msg.text}
              </div>
              <p className={`text-[10px] text-gray-300 mt-1 ${msg.from === 'me' ? 'text-right' : ''}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="w-7 h-7 bg-brand-50 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1">
              {buddy.avatar}
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-100 p-3 pb-6">
        {messages.length <= 1 && (
          <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar">
            {quickMessages.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                className="flex-shrink-0 text-xs text-brand-500 bg-brand-50 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors whitespace-nowrap">
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="说点什么..."
            className="flex-1 h-10 px-4 bg-gray-50 rounded-full text-sm outline-none border border-gray-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-10 h-10 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 rounded-full flex items-center justify-center transition-all"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
