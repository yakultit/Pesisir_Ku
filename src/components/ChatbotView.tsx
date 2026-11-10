import React, { useState, useRef, useEffect } from 'react';
import { Destination } from '../types/destination';
import { askPesisirRAGChatbot } from '../services/aiService';
import { 
  Send, Sparkles, Bot, User, 
  Trash2, ShieldCheck 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatbotViewProps {
  destinations: Destination[];
  onSelectDestination?: (dest: Destination) => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  destinations,
  onSelectDestination: _onSelectDestination
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Halo! Salam hangat dari Sulawesi Utara! Torang asisten pintar PesisirKu siap bantu jawab apa saja seputar 33+ wisata pesisir (tiket, perahu, ombak, snorkeling) sampe info kuliner sedap (Tinutuan, Klappertaart) deng tempat hits di Sulut pake Bahasa Manado. Ada yang bisa kita bantu akang?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'Dimana tampa makan Tinutuan paling sadap di Manado?',
    'Pantai mana di Likupang yang pasirnya paling putih dan ramah anak?',
    'Berapa sewa perahu deng alat snorkeling di Bunaken?',
    'Ada rekomendasi tempat wisata di Tomohon dan Danau Linow?',
    'Kalo mo nae angkot Mikro di Manado bagaimana rutenya?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const reply = await askPesisirRAGChatbot(q, destinations);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const errorMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'assistant',
        text: 'Maaf, terjadi gangguan saat menghubungi sistem AI. Silakan coba kembali sesaat lagi.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Percakapan so direset. Silakan tanya hal lain seputar wisata pesisir, kuliner, atau tempat menarik di Sulawesi Utara!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden">
      
      {/* Chat Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">
                PesisirKu AI Assistant
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Dialek Manado Aktif
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <ShieldCheck className="w-3 h-3" />
                Anti-Halusinasi Terverifikasi
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Menjawab seputar 33+ wisata pesisir resmi dan info umum Sulawesi Utara dalam Bahasa Manado
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          title="Bersihkan percakapan"
          className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-blue-600'
                    : 'bg-indigo-600 shadow-md shadow-indigo-500/20'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span
                  className={`block text-[9px] mt-2 ${
                    msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-xs text-slate-500">Menyusun jawaban (Bahasa Manado)...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sample Question Chips */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium">Contoh Pertanyaan:</span>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-3xl mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={e => setInputQuestion(e.target.value)}
            placeholder="Tanyakan pantai, kuliner tinutuan, spot diving, rute mikro, atau wisata Tomohon..."
            className="flex-1 p-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
