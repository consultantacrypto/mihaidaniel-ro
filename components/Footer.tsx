import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm font-[var(--font-inter)] mt-auto">
      <div className="container mx-auto px-6 flex flex-col gap-4">
        <div>© 2026 Mihai Daniel. Toate drepturile rezervate.</div>
        <div className="flex justify-center gap-6 text-xs">
            <Link href="/stiri" className="hover:text-white transition-colors">Știri</Link>
            <Link href="/#consultanta" className="hover:text-white transition-colors">Consultanță</Link>
            <Link href="/lichidari" className="hover:text-white transition-colors">Lichidări</Link>
        </div>
      </div>
    </footer>
  );
}