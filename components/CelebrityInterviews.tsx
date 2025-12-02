'use client';

import { useState } from 'react';
import { Play, Star, Tv, ExternalLink } from 'lucide-react';

// LISTA CLIPURILOR TALE (IDs extrase din link-uri)
const VIDEOS = [
  { id: 'IMNUP11X93w', title: 'Interviu Exclusiv: Rohit Wad (Binance CTO)' },
  { id: 'zcZ-SKhJhqM', title: 'Bitcoin la $5M? Dezbatere cu MMCrypto' },
  { id: 'e6fT2y3DkqI', title: 'Dialoguri Crypto la Nivel Înalt' },
  { id: '59HJsgv8lbI', title: 'Analiză de Piață & Predicții' },
  { id: 'cQx2EFPN2ZI', title: 'Secretele Investitorilor Mari' },
  { id: 'SVcy0DJEuoQ', title: 'Viitorul Tehnologiei Blockchain' },
  { id: 'BJ-qiaGsIaY', title: 'Strategii Avansate de Trading' },
  { id: 'CdBYX3NPfbA', title: 'Sesiune Specială Q&A' },
];

const VideoCard = ({ id, title }: { id: string, title: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-[#0a0f1e] shadow-lg aspect-video hover:border-purple-500/50 transition-all duration-300">
      {!isPlaying ? (
        // --- LITE MODE (Doar Poza - Se încarcă instant) ---
        <div 
          className="cursor-pointer relative w-full h-full"
          onClick={() => setIsPlaying(true)}
        >
          {/* Thumbnail High-Res de la YouTube */}
          <img 
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`} 
            alt={title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            loading="lazy"
          />
          
          {/* Buton Play Custom */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform z-10">
              <Play size={32} className="text-white fill-white ml-1"/>
            </div>
            {/* Pulsing Effect */}
            <div className="absolute w-16 h-16 bg-red-600 rounded-full animate-ping opacity-20"></div>
          </div>
          
          {/* Titlu Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 leading-tight">{title}</h3>
          </div>
        </div>
      ) : (
        // --- HEAVY MODE (Iframe real) - Se încarcă doar la click ---
        <iframe 
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`} 
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          className="w-full h-full absolute inset-0"
        ></iframe>
      )}
    </div>
  );
};

export default function CelebrityInterviews() {
  return (
    <section className="py-24 relative bg-[#020617] border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-900/5 blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold tracking-widest mb-4 uppercase shadow-lg shadow-purple-500/10">
                <Star size={14} className="text-yellow-400 fill-yellow-400"/> Hall of Fame
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Discuții cu <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Liderii Industriei</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Nu vorbesc din cărți. Dezbat viitorul crypto direct cu oamenii care îl construiesc. 
                De la CTO-ul Binance la analiști de top.
            </p>
        </div>

        {/* GRID VIDEO - Responsive Perfect (1 pe mobil, 2 tabletă, 4 pe ecrane mari) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {VIDEOS.map((video) => (
                <VideoCard key={video.id} id={video.id} title={video.title} />
            ))}
        </div>

        {/* Social Proof Footer */}
        <div className="mt-16 text-center">
            <a 
              href="https://www.youtube.com/@DanielMihaiCrypto" 
              target="_blank"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all group"
            >
                <Tv size={20} className="text-red-500"/> 
                Vezi toate cele 500+ video-uri pe YouTube
                <ExternalLink size={16} className="text-gray-500 group-hover:text-white transition-colors"/>
            </a>
        </div>

      </div>
    </section>
  );
}