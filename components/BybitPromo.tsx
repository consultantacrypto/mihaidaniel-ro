import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function BybitPromo() {
  const AFFILIATE_LINK = "https://partner.bybit.eu/b/STIRICRYPTO"; 

  return (
    <div className="w-full my-12 relative overflow-hidden rounded-2xl group">
      {/* Background Dark Premium */}
      <div className="absolute inset-0 bg-[#121212] border border-[#F7A600]/20 group-hover:border-[#F7A600]/50 transition-colors duration-500"></div>
      
      <div className="relative z-10 p-8 flex flex-col items-center text-center gap-6">
        
        {/* Logo Area & Badge */}
        <div className="flex flex-col items-center gap-2">
            {/* Logo Stilizat (Text) */}
            <div className="text-3xl font-black text-white tracking-tighter flex items-center gap-1">
                BYBIT <span className="text-[#F7A600] text-lg align-top">★</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-green-400 bg-green-900/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                <ShieldCheck size={12} /> Reglementat MiCA
            </div>
        </div>

        {/* Text Area */}
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-[var(--font-space)]">
            Cea mai sigură platformă europeană
          </h3>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            Nu îți risca banii pe platforme obscure. Alege partenerul reglementat pe care îl folosesc și eu pentru siguranță și lichiditate.
          </p>
        </div>

        {/* Action Area */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            href={AFFILIATE_LINK} 
            target="_blank"
            className="flex items-center justify-center gap-2 bg-[#F7A600] hover:bg-[#ffb300] text-black font-black px-8 py-3.5 rounded-xl transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(247,166,0,0.2)] w-full sm:w-auto"
          >
            Deschide Cont <ArrowRight size={18} />
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle2 size={12} className="text-[#F7A600]"/> Bonus de Bun Venit Activ
          </div>
        </div>

      </div>
    </div>
  );
}