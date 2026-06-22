import { CheckCircle2, Globe2 } from 'lucide-react';

const PLACEMENTS = [
  'Native SEO Advertorials (High-authority sponsored articles)',
  'Premium Display Banners (Homepage & Article placements)',
  '360° Campaigns (Integrated Video KOL + PR Portal packages)',
] as const;

export default function OwnedMediaSection() {
  return (
    <section className="py-16 border-b border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-widest">
              Owned Media · Publisher
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Globe2 className="text-cyan-400 shrink-0" size={28} />
              The Crypto News Hub of Romania
            </h2>

            <p className="text-gray-300 leading-relaxed max-w-xl">
              Owner and publisher of stirilecrypto.ro, the dedicated platform for
              crypto news, market analysis, and financial education, offering
              brands a complete communication ecosystem.
            </p>

            <ul className="space-y-3">
              {PLACEMENTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle2
                    className="text-cyan-400 shrink-0 mt-0.5"
                    size={18}
                  />
                  <span className="text-sm md:text-base leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl border border-cyan-500/20 bg-[#0a0f1e] overflow-hidden aspect-video flex items-center justify-center relative shadow-[0_0_40px_-15px_rgba(6,182,212,0.2)]"
            aria-hidden
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-[#0a0f1e] to-[#020617]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.08)_0%,_transparent_70%)]" />
            <p className="relative z-10 text-2xl md:text-3xl font-bold text-white/90 tracking-tight text-center px-6">
              www.stirilecrypto.ro
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
