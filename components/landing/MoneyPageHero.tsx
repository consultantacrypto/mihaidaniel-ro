type MoneyPageHeroProps = {
  badge: string;
  title: string;
  highlight?: string;
  description: string;
  accent?: 'yellow' | 'blue' | 'green';
};

const accentStyles = {
  yellow: {
    badge: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    highlight: 'from-yellow-400 to-amber-500',
    glow: 'bg-yellow-600/10',
  },
  blue: {
    badge: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    highlight: 'from-blue-400 to-cyan-400',
    glow: 'bg-blue-600/10',
  },
  green: {
    badge: 'text-green-400 border-green-500/30 bg-green-500/10',
    highlight: 'from-green-400 to-emerald-500',
    glow: 'bg-green-600/10',
  },
};

export default function MoneyPageHero({
  badge,
  title,
  highlight,
  description,
  accent = 'yellow',
}: MoneyPageHeroProps) {
  const styles = accentStyles[accent];

  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-[500px] h-[500px] ${styles.glow} rounded-full blur-[120px] pointer-events-none`}
      />
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <span
          className={`inline-flex items-center px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-6 ${styles.badge}`}
        >
          {badge}
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
          {title}
          {highlight && (
            <>
              <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${styles.highlight}`}
              >
                {highlight}
              </span>
            </>
          )}
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed max-w-3xl border-l-4 border-white/20 pl-6">
          {description}
        </p>
      </div>
    </section>
  );
}
