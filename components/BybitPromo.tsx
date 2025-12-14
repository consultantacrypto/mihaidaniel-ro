import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function BybitPromo() {
  // ✅ LINK-UL TĂU ESTE CONFIGURAT AICI
  const AFFILIATE_LINK = "https://partner.bybit.eu/b/STIRICRYPTO"; 

  return (
    <div className="w-full my-12 relative overflow-hidden rounded-2xl group">
      {/* Background Bybit Style (Black & Yellow accents) */}
      <div className="absolute inset-0 bg-[#121212] border border-[#F7A600]/20 group-hover:border-[#F7A600]/50 transition-colors duration-500"></div>
      
      <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Text Area */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-[#F7A600] font-bold text-xs uppercase tracking-widest mb-3">
            <ShieldCheck size={14} /> Partener Oficial
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white mb-2 font-[var(--font-space)]">
            Tranzacționează Crypto Reglementat
          </h3>
          <p className="text-gray-400 text-sm md:text-base mb-6 leading-relaxed">
            Platforma pe care o folosesc eu pentru execuție rapidă și lichiditate instituțională. 
            <br className="hidden md:block" /> Înregistrează-te prin link-ul oficial <strong>StiriCrypto</strong>.
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono text-gray-500">
            <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-500"/> Execuție 0.01ms</span>
            <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-yellow-500"/> Proof of Reserves</span>
          </div>
        </div>

        {/* Button Area */}
        <div className="shrink-0">
          <Link 
            href={AFFILIATE_LINK} 
            target="_blank"
            className="flex items-center gap-3 bg-[#F7A600] hover:bg-[#ffb300] text-black font-black px-8 py-4 rounded-xl transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(247,166,0,0.2)] hover:shadow-[0_0_30px_rgba(247,166,0,0.4)]"
          >
            Deschide Cont <ArrowRight size={20} />
          </Link>
          <p className="text-[10px] text-center mt-3 text-gray-600">Bonus exclusiv prin acest link</p>
        </div>

      </div>
    </div>
  );
}