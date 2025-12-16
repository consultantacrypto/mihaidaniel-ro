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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [progress, setProgress] = useState(0); 
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
        // Start fresh
        window.speechSynthesis.cancel();
        
        // Curățăm textul de HTML tags pentru citire
        const cleanText = text.replace(/<[^>]*>/g, '');
        const fullText = `${title}. . ${cleanText}`;

        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'ro-RO'; // Setăm limba română
        utterance.rate = 0.9; // Puțin mai lent pentru claritate
        utterance.pitch = 1;

        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(0);
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
    <div className="my-8 bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-lg group hover:border-blue-500/30 transition-all">
      <button 
        onClick={handlePlay}
        className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)] shrink-0"
      >
        {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
      </button>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
            <Volume2 size={12} /> Ascultă Articolul (Audio)
          </span>
          {isPlaying && (
            <span className="text-xs text-green-400 animate-pulse font-bold">Redare în curs...</span>
          )}
        </div>
        
        {/* Bară de progres vizuală (Indeterminate state când redă) */}
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
        <button onClick={handleStop} className="text-gray-500 hover:text-red-400 transition-colors shrink-0">
          <StopCircle size={20} />
        </button>
      )}
    </div>
  );
}