"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, StopCircle, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
  title: string;
}

export default function AudioPlayer({ text, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [roVoice, setRoVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 1. Încărcăm vocile sistemului
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        
        // Căutăm o voce de Română
        // Prioritizăm "Google" că sună mai bine, sau orice are 'ro-RO'
        const romanian = availableVoices.find(v => v.lang === 'ro-RO' && v.name.includes('Google')) 
                      || availableVoices.find(v => v.lang === 'ro-RO');
        
        if (romanian) {
          setRoVoice(romanian);
        }
        setVoicesLoaded(true);
      };

      loadVoices();
      
      // Chrome încarcă vocile asincron, trebuie să ascultăm evenimentul
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handlePlay = () => {
    if (!isSupported) return;

    // Dacă redă deja, punem pauză
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    // Dacă e pe pauză, continuăm
    if (window.speechSynthesis.paused && window.speechSynthesis.speaking) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    // START NOU
    window.speechSynthesis.cancel(); // Oprim orice altceva

    // Curățăm textul de HTML și caractere ciudate
    const cleanText = text
      .replace(/<[^>]*>/g, '') // Scoate tag-uri HTML
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')    // Scoate spații duble
      .trim();

    const fullText = `${title}. ... ${cleanText}`; // Pauză după titlu

    const utterance = new SpeechSynthesisUtterance(fullText);
    
    // Setări critice pentru calitate
    if (roVoice) {
      utterance.voice = roVoice; // Setăm explicit vocea românească
      utterance.lang = 'ro-RO';
    } else {
      // Fallback extrem: Încercăm să forțăm lang, deși s-ar putea să nu sune bine
      utterance.lang = 'ro-RO'; 
    }

    utterance.rate = 0.9; // Viteza (0.9 e mai natural pentru știri)
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      console.error("Eroare redare audio:", e);
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
      
      {/* Indicator Vizual Background */}
      {isPlaying && (
        <div className="absolute inset-0 bg-blue-500/5 z-0 animate-pulse"></div>
      )}

      <button 
        onClick={handlePlay}
        disabled={!roVoice && voicesLoaded} // Dezactivăm dacă nu avem voce RO
        className={`flex items-center justify-center w-12 h-12 rounded-full hover:scale-105 transition-transform shadow-lg shrink-0 z-10 ${
          !roVoice && voicesLoaded 
            ? 'bg-gray-700 cursor-not-allowed text-gray-500' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
        }`}
      >
        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
      </button>

      <div className="flex-1 z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-200 flex items-center gap-2">
            <Volume2 size={14} className="text-blue-400"/> Ascultă Articolul
          </span>
          
          {/* Status Indicator */}
          {isPlaying ? (
            <span className="text-xs text-green-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Redare
            </span>
          ) : (
            !roVoice && voicesLoaded && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={12}/> Lipsă voce RO
              </span>
            )
          )}
        </div>
        
        {/* Bara Progres Vizual */}
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden w-full relative">
           {isPlaying ? (
             <div className="absolute top-0 left-0 h-full w-2/3 bg-blue-500 rounded-full animate-[shimmer_1.5s_infinite_linear]" 
                  style={{
                    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)'
                  }}
             ></div>
           ) : (
             <div className="h-full bg-blue-600/20 w-full"></div>
           )}
        </div>
        
        {/* Mesaj de eroare discret dacă nu găsim voce */}
        {!roVoice && voicesLoaded && (
          <p className="text-[10px] text-gray-500 mt-1">
            Browserul tău nu are pachetul de voce "Română" instalat.
          </p>
        )}
      </div>

      {isPlaying && (
        <button onClick={handleStop} className="text-gray-500 hover:text-red-400 transition-colors shrink-0 p-2 z-10">
          <StopCircle size={24} />
        </button>
      )}
    </div>
  );
}