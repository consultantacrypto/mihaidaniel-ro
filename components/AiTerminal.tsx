'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Activity, Shield, Zap, TrendingUp, Sparkles, BrainCircuit, MessageSquare, Briefcase, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiTerminal() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Salutare, tati! 👋\nSunt aici să te ajut să nu pierzi bani.\n\nPot să îți analizez piața, dar cel mai bine te ajut să înveți sistemul meu.\n\nCe te doare azi?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages.length]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ Tati, verifică netul.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai" className="py-24 relative bg-[#020617] overflow-hidden min-h-[900px] flex items-center">
        {/* Background Premium */}
        <div className="absolute inset-0 bg-[#020617] z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-blue-900/10 blur-[120px] pointer-events-none z-0"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
            
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-blue-500/30 bg-blue-900/10 backdrop-blur-md text-blue-300 text-xs font-bold tracking-[0.2em] mb-6 uppercase shadow-lg shadow-blue-500/10">
                    <BrainCircuit size={16} className="text-blue-400"/> Mihai Daniel Intelligence
                </div>
                <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                    Ai o întrebare? <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-white">Primești Strategie.</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                    Nu e Google. E experiența mea condensată într-un algoritm care lucrează pentru tine.
                </p>
            </div>

            {/* THE QUANTUM INTERFACE */}
            <div className="max-w-6xl mx-auto bg-[#0a0f1e]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[750px] ring-1 ring-white/5">
                
                {/* 1. LEFT PANEL - AVATAR & SALES TRIGGERS */}
                <div className="w-full md:w-[360px] bg-[#050810]/80 border-r border-white/5 p-8 flex flex-col shrink-0 relative overflow-hidden">
                    {/* Tech Decor */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

                    <div className="relative w-44 h-44 mx-auto mb-8 rounded-full border border-white/10 p-2 group">
                        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin-slow"></div>
                        <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
                            <img 
                                src="/hero-mihai.jpg" 
                                alt="AI Avatar" 
                                className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <div className="absolute bottom-2 right-4 flex items-center gap-2 bg-black/90 px-3 py-1 rounded-full border border-green-500/30 shadow-lg">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                            <span className="text-[10px] font-bold text-white tracking-wide">LIVE</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar z-10">
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-3 pl-1">Întrebări Frecvente</p>
                        
                        <button onClick={() => handleSend("De ce să cumpăr Cursul tău?")} className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/40 transition-all text-sm text-gray-200 flex items-center gap-3 group">
                            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 group-hover:scale-110 transition-transform"><GraduationCap size={18}/></div>
                            <div>
                                <div className="font-bold">De ce Cursul tău?</div>
                                <div className="text-[10px] text-gray-500 group-hover:text-blue-300">Vezi valoarea reală</div>
                            </div>
                        </button>

                        <button onClick={() => handleSend("Am nevoie de ajutor urgent cu portofoliul.")} className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-yellow-600/20 border border-white/5 hover:border-yellow-500/40 transition-all text-sm text-gray-200 flex items-center gap-3 group">
                            <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400 group-hover:scale-110 transition-transform"><Briefcase size={18}/></div>
                            <div>
                                <div className="font-bold">Consultanță VIP</div>
                                <div className="text-[10px] text-gray-500 group-hover:text-yellow-300">Audit 1 la 1</div>
                            </div>
                        </button>

                        <button onClick={() => handleSend("Analizează Bitcoin acum.")} className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-green-600/20 border border-white/5 hover:border-green-500/40 transition-all text-sm text-gray-200 flex items-center gap-3 group">
                            <div className="bg-green-500/20 p-2 rounded-lg text-green-400 group-hover:scale-110 transition-transform"><TrendingUp size={18}/></div>
                            <div>
                                <div className="font-bold">Analiză Tehnică</div>
                                <div className="text-[10px] text-gray-500 group-hover:text-green-300">BTC / ETH / Alts</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* 2. RIGHT PANEL - CHAT INTERFACE */}
                <div className="flex-1 flex flex-col bg-[#0a0f1e]/50 relative min-w-0">
                    
                    {/* Header Chat */}
                    <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0f1e]/80 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-blue-400"/>
                            <span className="text-xs font-bold text-white tracking-wider">AI ASSISTANT ACTIVE</span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-600">v2.5.0 • SECURE</div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-blue-900/30 scrollbar-track-transparent" style={{ overflowAnchor: 'none' }}>
                        <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`max-w-[85%] p-5 rounded-2xl text-sm md:text-base leading-relaxed shadow-lg ${
                                    msg.role === 'ai' 
                                    ? 'bg-[#151b2e] text-gray-200 rounded-tl-none border border-blue-500/10' 
                                    : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none shadow-blue-900/20'
                                }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                        
                        {isLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="bg-[#151b2e] px-6 py-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-3 items-center text-gray-400">
                                    <Loader2 size={18} className="animate-spin text-blue-500"/>
                                    <span className="text-xs font-mono tracking-widest">ANALYZING MARKET DATA...</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} className="h-1" />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-white/5 bg-[#0a0f1e] z-20">
                        <div className="flex gap-3 relative">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                                placeholder="Scrie aici... (ex: Merită să investesc acum?)"
                                className="w-full bg-[#050810] text-white rounded-2xl pl-6 pr-14 py-4 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-medium text-sm shadow-inner"
                            />
                            <button 
                                onClick={() => handleSend(input)}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg shadow-blue-900/20"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
}