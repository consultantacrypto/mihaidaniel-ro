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
  const [roVoice, setRoVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        
        // Căutare mai relaxată pentru orice voce care pare a fi românească
        const romanian = availableVoices.find(v => v.lang.includes('ro') || v.name.toLowerCase().includes('romanian'));
        
        if (romanian) {
          setRoVoice(romanian);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handlePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    if (window.speechSynthesis.paused && window.speechSynthesis.speaking) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    // Curățăm textul
    const cleanText = text
      .replace(/<[^>]*>/g, '') 
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const fullText = `${title}. ... ${cleanText}`;

    const utterance = new SpeechSynthesisUtterance(fullText);
    
    // Setări esențiale: Forțăm limba chiar dacă nu am găsit obiectul voice
    utterance.lang = 'ro-RO'; 
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Dacă am găsit o voce specifică, o folosim. Dacă nu, lăsăm browserul să se descurce cu 'ro-RO'
    if (roVoice) {
      utterance.voice = roVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      console.error("Audio Error:", e);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  if (!isSupported) return null;

  return (
    <div className="my-8 bg-[#0f172a] border border-blue-900/30 rounded-xl p-4 flex items-center gap-4 shadow-lg group hover:border-blue-500/50 transition-all relative overflow-hidden">
      
      {/* Indicator fundal */}
      {isPlaying && (
        <div className="absolute inset-0 bg-blue-500/5 z-0 animate-pulse"></div>
      )}

      {/* Butonul este ACUM MEREU ACTIV */}
      <button 
        onClick={handlePlay}
        className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full hover:scale-105 transition-transform shadow-lg shrink-0 z-10"
      >
        {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-1" />}
      </button>

      <div className="flex-1 z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-200 flex items-center gap-2">
            <Volume2 size={14} className="text-blue-400"/> Ascultă Articolul
          </span>
          
          {isPlaying && (
            <span className="text-xs text-green-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live
            </span>
          )}
        </div>
        
        {/* Vizualizator */}
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden w-full relative">
           {isPlaying ? (
             <div className="absolute top-0 left-0 h-full w-2/3 bg-blue-500 rounded-full animate-[shimmer_1.5s_infinite_linear]" 
                  style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }}
             ></div>
           ) : (
             <div className="h-full bg-blue-600/20 w-full"></div>
           )}
        </div>
      </div>

      {isPlaying && (
        <button onClick={handleStop} className="text-gray-500 hover:text-red-400 transition-colors shrink-0 p-2 z-10">
          <StopCircle size={24} />
        </button>
      )}
    </div>
  );
}