import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ShieldCheck, MapPin, Zap, MessageSquare, CheckCheck } from 'lucide-react';
import { Listing, Message } from '../types';

interface InAppChatModalProps {
  listing: Listing | null;
  onClose: () => void;
}

interface QuickReplyOption {
  id: string;
  label: string;
  category: string;
}

const QUICK_REPLIES: QuickReplyOption[] = [
  { id: 'qr-avail', label: 'Is this still available?', category: 'Availability' },
  { id: 'qr-meet', label: 'Where can we meet?', category: 'Meetup' },
  { id: 'qr-price', label: 'What is your final price?', category: 'Negotiation' },
  { id: 'qr-today', label: 'Can we meet today on campus?', category: 'Timing' },
  { id: 'qr-mpesa', label: 'Can I pay via M-Pesa at meetup?', category: 'Payment' },
  { id: 'qr-details', label: 'Can you share more details or photos?', category: 'Details' }
];

export const InAppChatModal: React.FC<InAppChatModalProps> = ({ listing, onClose }) => {
  if (!listing) return null;

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'other',
      text: `Habari! Thanks for checking out "${listing.title}". I'm available for safe campus meetup at ${listing.seller.safeSpot || listing.campusName + ' Safe Spot'}. Feel free to ask any questions!`,
      timestamp: 'Just now'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (textToSend === undefined) {
      setInput('');
    }

    // Set seller typing simulation
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();
      let replyText = '';

      if (lower.includes('available')) {
        replyText = `Yes comrade, it's 100% still available! Are you free for a physical inspection on campus today?`;
      } else if (lower.includes('where') || lower.includes('meet')) {
        const spot = listing.seller.safeSpot || `${listing.campusName} Student Center / Library Gate`;
        replyText = `We can safely meet at ${spot}. It's open and safe for both of us. What time works best for you?`;
      } else if (lower.includes('final price') || lower.includes('price') || lower.includes('negotiable')) {
        const discounted = Math.max(100, Math.round(listing.price * 0.9));
        replyText = `The listed price is KES ${new Intl.NumberFormat('en-KE').format(listing.price)}, but since you're a fellow comrade, I can do KES ${new Intl.NumberFormat('en-KE').format(discounted)} if you take it today!`;
      } else if (lower.includes('m-pesa') || lower.includes('pay')) {
        replyText = `Yes, M-Pesa is preferred! You can inspect the item thoroughly first at our meetup, then send payment directly to my M-Pesa.`;
      } else if (lower.includes('today') || lower.includes('time')) {
        replyText = `I am around ${listing.campusName} between 2:00 PM and 5:30 PM today. Let me know what time suits your class schedule!`;
      } else {
        replyText = `Sounds great comrade! Let's arrange a quick meetup at ${listing.seller.safeSpot || listing.campusName}. You can also reach me on WhatsApp at ${listing.seller.whatsapp} for instant coordination.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'other',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1100);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-md bg-white sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-full sm:h-[640px] max-h-[96vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-inner">
              {listing.seller.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm">{listing.seller.name}</span>
                {listing.seller.isVerifiedStudent && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[200px]">{listing.campusName}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Listing preview banner */}
        <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="truncate pr-2">
            <div className="font-semibold text-slate-800 truncate">{listing.title}</div>
            <div className="text-[10px] text-emerald-700 font-bold font-mono">
              KES {new Intl.NumberFormat('en-KE').format(listing.price)} {listing.priceLabel}
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md shrink-0">
            {listing.category}
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
          {messages.map((m) => {
            const isMe = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[9px] text-slate-400 font-mono">{m.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-xs pl-1 animate-pulse">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                {listing.seller.name.charAt(0)}
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-3 py-1.5 text-[11px] text-slate-600 flex items-center gap-1.5 shadow-xs">
                <span>{listing.seller.name} is typing</span>
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Section */}
        <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px]">
                <Zap className="w-2.5 h-2.5 fill-current" />
              </span>
              <span className="text-[11px] font-bold text-slate-800 tracking-tight">Quick Reply</span>
            </div>
            <span className="text-[10px] text-slate-500">Tap to send instantly</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5 pt-0.5">
            {QUICK_REPLIES.map((qr) => (
              <button
                key={qr.id}
                type="button"
                onClick={() => handleSend(qr.label)}
                className="group text-[11px] whitespace-nowrap bg-white hover:bg-emerald-50 active:bg-emerald-100 border border-slate-200 hover:border-emerald-500 px-3 py-1.5 rounded-full text-slate-700 hover:text-emerald-800 font-medium transition-all shadow-2xs shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title={`Send: "${qr.label}"`}
              >
                <MessageSquare className="w-3 h-3 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                <span>{qr.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a custom message to comrade..."
            className="flex-1 px-3.5 py-2 text-xs bg-slate-100 rounded-xl border border-transparent focus:bg-white focus:border-emerald-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
