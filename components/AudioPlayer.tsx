"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, StopCircle } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
  title: string;
}

export default function AudioPlayer({ text, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const handlePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        window.speechSynthesis.cancel();
        
        // Curățăm textul de HTML
        const cleanText = text.replace(/<[^>]*>/g, '');
        const fullText = `${title}. . ${cleanText}`;

        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'ro-RO'; // 🇷🇴 Forțăm limba Română
        utterance.rate = 0.9; 
        utterance.pitch = 1;

        // Încercăm să găsim o voce specifică de Română (dacă există)
        const voices = window.speechSynthesis.getVoices();
        const roVoice = voices.find(v => v.lang === 'ro-RO' || v.name.includes('Romanian'));
        if (roVoice) utterance.voice = roVoice;

        utterance.onend = () => {
          setIsPlaying(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  if (!isSupported) return null;

  return (
    <div className="my-8 bg-[#0f172a] border border-blue-900/30 rounded-xl p-4 flex items-center gap-4 shadow-lg group hover:border-blue-500/50 transition-all">
      <button 
        onClick={handlePlay}
        aria-label={isPlaying ? "Pauză" : "Redă"}
        className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0"
      >
        {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-1" />}
      </button>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-200 flex items-center gap-2">
            <Volume2 size={14} className="text-blue-400"/> Ascultă Articolul
          </span>
          {isPlaying && (
            <span className="text-xs text-green-400 font-bold animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Redare în curs
            </span>
          )}
        </div>
        
        {/* Vizualizator Audio Simulat */}
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden w-full relative">
           {isPlaying && (
             <div className="absolute top-0 left-0 h-full w-1/3 bg-blue-500 rounded-full animate-[shimmer_2s_infinite_linear]" 
                  style={{
                    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
                  }}
             ></div>
           )}
           <div className={`h-full bg-blue-600/30 w-full ${!isPlaying ? 'hidden' : 'block'}`}></div>
        </div>
      </div>

      {isPlaying && (
        <button onClick={handleStop} aria-label="Oprește" className="text-gray-500 hover:text-red-400 transition-colors shrink-0 p-2">
          <StopCircle size={24} />
        </button>
      )}
    </div>
  );
}