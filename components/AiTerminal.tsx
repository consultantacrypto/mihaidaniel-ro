'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, BrainCircuit, Sparkles, GraduationCap, Briefcase, TrendingUp, Cpu, Wifi, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiTerminal() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'INITIALIZING MIHAI DANIEL CORE v3.0...\n\nSistemele sunt online. Sunt conectat la matricea pieței.\n\nSpune-mi, tati, astăzi facem bani sau doar ne uităm?' }
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ EROARE DE CONEXIUNE LA MATRICE. Reîncearcă.' }]);
    } finally { setIsLoading(false); }
  };

  return (
    <section id="ai" className="py-24 relative bg-[#01030c] overflow-hidden min-h-[950px] flex items-center justify-center">
        {/* ATMOSPHERE & PARTICLES */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/20 rounded-full blur-[200px] pointer-events-none animate-pulse-slow"></div>

        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                 {/* HEADER FUTURIST */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-xl text-cyan-300 text-sm font-bold tracking-[0.3em] mb-8 uppercase shadow-[0_0_30px_rgba(6,182,212,0.2)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
                    <Cpu size={18} className="text-cyan-400 animate-spin-slow"/> QUANTUM AI CORE ACTIVE
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-400 tracking-tight leading-none filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    Vrei Adevărul? <br/> Primești Strategie.
                </h2>
                <p className="text-blue-200/70 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                    Nu e un chatbot. E un sistem neural antrenat să gândească exact ca mine. Fără filtre, fără BS.
                </p>
            </div>

            {/* --- THE HOLOGRAPHIC TERMINAL --- */}
            <div className="max-w-7xl mx-auto relative group">
                {/* Glowing Borders & Scanlines */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-[40px] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 animate-gradient-xy"></div>
                <div className="absolute inset-0 bg-[url('/scanline.png')] bg-cover opacity-5 mix-blend-overlay pointer-events-none z-20 animate-scan-down"></div>

                <div className="bg-[#030712]/90 backdrop-blur-3xl border border-blue-500/20 rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[800px] relative z-10 ring-1 ring-blue-400/10">
                    
                    {/* LEFT PANEL: HOLOGRAPHIC CORE CONTROL */}
                    <div className="w-full lg:w-[400px] bg-[#02040a]/60 border-r border-blue-500/10 p-8 flex flex-col shrink-0 relative overflow-hidden">
                        {/* Animated Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50"></div>
                        
                        {/* --- THE ROTATING ENERGY CORE (Avatar replacement) --- */}
                        <div className="relative w-56 h-56 mx-auto mb-10 flex items-center justify-center">
                            {/* Spinning Rings */}
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30"></motion.div>
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border border-cyan-400/40"></motion.div>
                            
                            {/* Central Pulsing Core with Image */}
                            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.5)] z-10 animate-pulse-slow">
                                <img src="/hero-mihai.jpg" alt="AI Core" className="w-full h-full object-cover opacity-80 mix-blend-luminosity scale-110"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent"></div>
                            </div>
                            {/* Status Indicators */}
                            <div className="absolute bottom-0 flex gap-4 items-center justify-center w-full">
                                <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono"><Wifi size={12} className="animate-pulse"/> NET: STABLE</div>
                                <div className="flex items-center gap-1 text-[10px] text-green-400 font-mono"><Activity size={12} className="animate-bounce-slow"/> CPU: 98%</div>
                            </div>
                        </div>

                        {/* Quick Action Triggers */}
                        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar z-10">
                            <p className="text-xs text-blue-300/50 font-mono uppercase tracking-[0.2em] mb-4 pl-2">/// QUICK_ACCESS_PROTOCOLS</p>
                            
                            {[
                                { icon: GraduationCap, color: 'blue', text: 'De ce Cursul tău?', sub: 'Valoare vs. Preț' },
                                { icon: Briefcase, color: 'yellow', text: 'Consultanță VIP', sub: 'Audit Portofoliu Urgent' },
                                { icon: TrendingUp, color: 'green', text: 'Analiză Piață', sub: 'BTC / ETH Status' }
                            ].map((item, idx) => (
                                <button key={idx} onClick={() => handleSend(item.text)} className={`w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-${item.color}-500/10 border border-white/5 hover:border-${item.color}-500/50 transition-all group relative overflow-hidden`}>
                                    <div className={`absolute inset-0 bg-gradient-to-r from-${item.color}-600/0 via-${item.color}-600/10 to-${item.color}-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`}></div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`bg-${item.color}-500/20 p-2.5 rounded-xl text-${item.color}-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--tw-color-${item.color}-500),0.3)] transition-all`}><item.icon size={20}/></div>
                                        <div>
                                            <div className="font-bold text-gray-100 text-sm">{item.text}</div>
                                            <div className={`text-[10px] text-${item.color}-300/70 font-mono mt-0.5`}>Is this for me?</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT PANEL: THE DATA STREAM (Chat) */}
                    <div className="flex-1 flex flex-col bg-transparent relative min-w-0">
                        {/* HUD Header */}
                        <div className="h-20 border-b border-blue-500/10 flex items-center justify-between px-8 bg-[#030712]/50 backdrop-blur-md relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse"></div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Sparkles size={20} className="text-cyan-400 relative z-10 animate-pulse"/>
                                    <div className="absolute inset-0 bg-cyan-400 blur-md opacity-50 animate-pulse-slow"></div>
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-white tracking-widest block">NEURAL LINK ESTABLISHED</span>
                                    <span className="text-[10px] font-mono text-blue-300/70">Mode: Sales Strategist // Latency: 12ms</span>
                                </div>
                            </div>
                        </div>

                        {/* Stream Area */}
                        <div className="flex-1 p-6 lg:p-10 overflow-y-auto space-y-8 custom-scrollbar relative" style={{ overflowAnchor: 'none' }}>
                            <AnimatePresence>
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: msg.role === 'ai' ? -20 : 20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[90%] lg:max-w-[80%] p-6 rounded-3xl relative overflow-hidden group ${
                                        msg.role === 'ai' 
                                        ? 'bg-[#0a1025] text-blue-100 rounded-tl-sm border border-blue-400/20 shadow-[0_0_30px_rgba(37,99,235,0.1)]' 
                                        : 'bg-gradient-to-br from-blue-600 to-cyan-700 text-white rounded-tr-sm shadow-[0_10px_30px_rgba(6,182,212,0.3)]'
                                    }`}>
                                        {msg.role === 'ai' && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 group-hover:bg-cyan-400 transition-colors"></div>}
                                        {msg.role === 'ai' && <BrainCircuit size={16} className="text-cyan-400 mb-2 opacity-50"/>}
                                        <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                            </AnimatePresence>
                            
                            {isLoading && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                    <div className="bg-[#0a1025]/80 backdrop-blur-sm px-8 py-5 rounded-3xl rounded-tl-sm border border-blue-400/10 flex gap-4 items-center text-blue-300 shadow-lg">
                                        <Loader2 size={20} className="animate-spin text-cyan-400"/>
                                        <span className="text-xs font-mono tracking-[0.2em] animate-pulse">PROCESSING_DATA_STREAM...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} className="h-1" />
                        </div>

                        {/* Command Input */}
                        <div className="p-6 lg:p-8 border-t border-blue-500/10 bg-[#02040a]/80 backdrop-blur-xl relative z-20">
                            <div className="flex gap-4 relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                                    placeholder="Introdu comanda ta aici... (ex: Analizează ETH)"
                                    className="w-full bg-[#050810] text-white rounded-2xl pl-8 pr-20 py-5 border border-blue-500/20 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 outline-none transition-all placeholder:text-blue-500/40 font-medium text-base shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative z-10"
                                />
                                <button 
                                    onClick={() => handleSend(input)}
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-3 top-3 bottom-3 aspect-square bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white rounded-xl transition-all disabled:opacity-50 disabled:grayscale hover:scale-105 active:scale-95 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] z-20"
                                >
                                    <Send size={24} className={isLoading ? 'animate-pulse' : ''} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}