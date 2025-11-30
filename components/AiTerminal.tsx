'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Activity, Shield, Zap, TrendingUp, Cpu, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiTerminal() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Salutare! Sunt Mihai Daniel Intelligence 2.0 🟢.\n\nAnalizez piața în timp real. Nu paria, investește informat.\n\nCe analizăm astăzi?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll fin
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
        {/* === BACKGROUND AGI QUANTUM === */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
            
            <div className="text-center mb-16">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-xl text-blue-300 text-xs font-bold tracking-[0.2em] mb-6 uppercase shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                >
                    <Cpu size={14} className="animate-pulse"/> Artificial General Intelligence
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tighter">
                    Mihai Daniel <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">AI CORE</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                    Un sistem neural antrenat să gândească în probabilități, nu în certitudini.
                </p>
            </div>

            {/* === INTERFACE CONTAINER (THE HUD) === */}
            <div className="max-w-7xl mx-auto bg-[#050810]/60 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[800px] ring-1 ring-white/5">
                
                {/* 1. LEFT PANEL - HOLOGRAM AVATAR (Static & Stable) */}
                <div className="w-full lg:w-[400px] bg-[#02040a]/80 border-r border-white/5 p-8 flex flex-col relative">
                    {/* Background Tech Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

                    {/* Avatar Hologram */}
                    <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-8 rounded-full border-2 border-blue-500/20 p-2 group">
                        <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-[spin_10s_linear_infinite]"></div>
                        <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.15)]">
                            <img 
                                src="/hero-mihai.jpg" 
                                alt="Mihai Daniel AI" 
                                className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000 grayscale hover:grayscale-0"
                            />
                            {/* Blue Tint Overlay */}
                            <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
                        </div>
                        {/* Status Light */}
                        <div className="absolute bottom-4 right-8 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/30">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                            <span className="text-[10px] font-mono text-green-400 tracking-widest">ONLINE</span>
                        </div>
                    </div>

                    {/* Quick Actions (Fixed Position) */}
                    <div className="flex-1 flex flex-col justify-end gap-3 z-10">
                        <p className="text-[10px] text-blue-500 font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Network size={12}/> Protocol Inițializare
                        </p>
                        
                        <button onClick={() => handleSend("Analizează Bitcoin pe termen scurt")} className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-blue-600/10 border border-white/5 hover:border-blue-500/50 transition-all text-sm text-gray-300 flex items-center gap-3 group">
                            <TrendingUp size={18} className="text-blue-500"/>
                            <div>
                                <div className="font-bold text-white group-hover:text-blue-400">Analiză Tehnică</div>
                                <div className="text-[10px] text-gray-500">Structura pieței & Trend</div>
                            </div>
                        </button>
                        
                        <button onClick={() => handleSend("Cum îmi gestionez riscul?")} className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-green-600/10 border border-white/5 hover:border-green-500/50 transition-all text-sm text-gray-300 flex items-center gap-3 group">
                            <Shield size={18} className="text-green-500"/>
                            <div>
                                <div className="font-bold text-white group-hover:text-green-400">Risk Management</div>
                                <div className="text-[10px] text-gray-500">Protejarea capitalului</div>
                            </div>
                        </button>
                        
                        <button onClick={() => handleSend("Explică-mi DCA (Dollar Cost Averaging)")} className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-purple-600/10 border border-white/5 hover:border-purple-500/50 transition-all text-sm text-gray-300 flex items-center gap-3 group">
                            <Zap size={18} className="text-purple-500"/>
                            <div>
                                <div className="font-bold text-white group-hover:text-purple-400">Strategie DCA</div>
                                <div className="text-[10px] text-gray-500">Acumulare inteligentă</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* 2. RIGHT PANEL - CHAT INTERFACE (60%) */}
                <div className="flex-1 flex flex-col bg-[#050810]/30 relative">
                    
                    {/* Header Chat */}
                    <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#050810]/50 backdrop-blur-sm">
                        <div className="text-xs font-mono text-gray-500 flex gap-4">
                            <span>CPU: <span className="text-blue-400">OPTIMAL</span></span>
                            <span>LATENCY: <span className="text-green-400">12ms</span></span>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-white/10"></div>
                            <div className="w-2 h-2 rounded-full bg-white/10"></div>
                            <div className="w-2 h-2 rounded-full bg-white/10"></div>
                        </div>
                    </div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-blue-900/20 scrollbar-track-transparent">
                        <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`max-w-[85%] relative group ${
                                    msg.role === 'ai' ? 'pl-4' : 'pr-4'
                                }`}>
                                    {/* Bubble */}
                                    <div className={`p-5 rounded-2xl text-sm md:text-[15px] leading-relaxed shadow-lg backdrop-blur-sm border ${
                                        msg.role === 'ai' 
                                        ? 'bg-[#0f1623] text-gray-200 rounded-tl-none border-blue-500/20 shadow-blue-900/10' 
                                        : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none border-transparent'
                                    }`}>
                                        {/* AI Label */}
                                        {msg.role === 'ai' && (
                                            <div className="text-[10px] font-bold text-blue-400 mb-2 flex items-center gap-1 opacity-70">
                                                <Sparkles size={10}/> MIHAI AI
                                            </div>
                                        )}
                                        {msg.text.split('\n').map((line, i) => (
                                            <p key={i} className="mb-2 last:mb-0">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                        
                        {isLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start pl-4">
                                <div className="bg-[#0f1623] p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-3 items-center text-gray-400">
                                    <Loader2 size={18} className="animate-spin text-blue-500"/>
                                    <span className="text-xs font-mono text-blue-400 animate-pulse">GENERATING RESPONSE...</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area (Fixed Bottom) */}
                    <div className="p-6 border-t border-white/5 bg-[#050810]/80 backdrop-blur-xl">
                        <div className="flex gap-4 relative items-center">
                            <div className="flex-1 relative">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                                    placeholder="Scrie întrebarea ta aici..."
                                    className="w-full bg-[#0a0f1e] text-white rounded-xl pl-5 pr-4 py-4 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-mono text-sm"
                                />
                                {/* Decor */}
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0f1e] to-transparent pointer-events-none"></div>
                            </div>
                            
                            <button 
                                onClick={() => handleSend(input)}
                                disabled={isLoading || !input.trim()}
                                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-105 active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <div className="text-center mt-3">
                            <span className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">
                                Powered by Google Gemini 1.5 • Secure Connection
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
}