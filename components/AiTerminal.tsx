'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Activity, Shield, Zap, TrendingUp, Sparkles, BrainCircuit, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiTerminal() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Salutare! Sunt Mihai Daniel Intelligence 🟢.\n\nSunt conectat la piață. Nu paria, investește informat.\n\nCe analizăm astăzi?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true); // Ref pentru a detecta prima încărcare

  // FIX SCROLL: Scroll doar când apar mesaje NOI, ignorând prima randare
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Nu facem scroll la prima încărcare
    }
    
    // Scroll fin doar dacă userul a interacționat deja
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      
      if (!response.ok) {
        throw new Error(data.error || 'Eroare la server');
      }

      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ Tati, verifică setările API Key în Vercel (Settings -> Environment Variables).' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai" className="py-24 relative bg-[#020617] overflow-hidden min-h-[900px] flex items-center">
        {/* Background Fix - Static */}
        <div className="absolute inset-0 bg-[#020617] z-0"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
            
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-bold tracking-widest mb-4 uppercase shadow-lg shadow-blue-500/20">
                    <Activity size={14} className="animate-pulse"/> Neural Network v2.0
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                    Mihai Daniel <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">AI CORE</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                    Sistem neural antrenat pe strategiile mele.
                </p>
            </div>

            {/* INTERFACE CONTAINER */}
            <div className="max-w-6xl mx-auto bg-[#0a0f1e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[700px] ring-1 ring-white/5">
                
                {/* LEFT PANEL */}
                <div className="w-full md:w-[320px] bg-[#050810] border-r border-white/5 p-6 flex flex-col shrink-0">
                    <div className="relative w-40 h-40 mx-auto mb-6 rounded-full border-2 border-blue-500/20 p-1 group">
                        <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-spin-slow"></div>
                        <img src="/hero-mihai.jpg" alt="AI Avatar" className="w-full h-full object-cover rounded-full grayscale opacity-80 group-hover:grayscale-0 transition-all"/>
                        <div className="absolute bottom-1 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] text-green-400 border border-green-500/30 font-mono">ONLINE</div>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                        <button onClick={() => handleSend("Analizează Bitcoin")} className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-blue-900/20 border border-white/5 hover:border-blue-500/30 transition-all text-xs text-gray-300 flex items-center gap-3 group">
                            <TrendingUp size={16} className="text-blue-500"/> Analiză Tehnică
                        </button>
                        <button onClick={() => handleSend("Managementul Riscului")} className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-green-900/20 border border-white/5 hover:border-green-500/30 transition-all text-xs text-gray-300 flex items-center gap-3 group">
                            <Shield size={16} className="text-green-500"/> Risk Management
                        </button>
                        <button onClick={() => handleSend("Ce este DCA?")} className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-purple-900/20 border border-white/5 hover:border-purple-500/30 transition-all text-xs text-gray-300 flex items-center gap-3 group">
                            <Zap size={16} className="text-purple-500"/> Strategia DCA
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex-1 flex flex-col bg-[#0a0f1e] relative min-w-0">
                    <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0f1e]">
                        <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                            <BrainCircuit size={14}/> NEURAL_LINK_ESTABLISHED
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-blue-900/30 scrollbar-track-transparent">
                        <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                                    msg.role === 'ai' 
                                    ? 'bg-[#151b2e] text-gray-200 rounded-tl-none border border-white/5' 
                                    : 'bg-blue-600 text-white rounded-tr-none'
                                }`}>
                                    {msg.role === 'ai' && <div className="text-[10px] font-bold text-blue-400 mb-1 flex items-center gap-1"><Sparkles size={10}/> MIHAI AI</div>}
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                        
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[#151b2e] p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-2 items-center text-gray-400">
                                    <Loader2 size={16} className="animate-spin text-blue-500"/>
                                    <span className="text-xs">Gândesc...</span>
                                </div>
                            </div>
                        )}
                        {/* AICI ESTE PUNCTUL DE SCROLL */}
                        <div ref={messagesEndRef} className="h-1" />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/5 bg-[#0a0f1e] z-20">
                        <div className="flex gap-2 relative">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                                placeholder="Scrie întrebarea ta..."
                                className="w-full bg-[#050810] text-white rounded-xl pl-4 pr-12 py-3 border border-white/10 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-mono text-sm shadow-inner"
                            />
                            <button 
                                onClick={() => handleSend(input)}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all disabled:opacity-50 hover:scale-105 active:scale-95 flex items-center justify-center"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}