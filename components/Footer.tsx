import Link from 'next/link';
import { Youtube, Twitter, Linkedin, Video, Mail, MapPin, ShieldCheck, FileText } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-16 pb-8 font-[var(--font-inter)] mt-auto">
      <div className="container mx-auto px-6">
        
        {/* === GRID PRINCIPAL === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. BRAND */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">MD</div>
               <span className="text-xl font-black text-white font-[var(--font-space)]">MIHAI DANIEL</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Analiză tehnică, educație financiară și strategii crypto. Transformăm complexitatea pieței în decizii clare.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://x.com/MIhaiDanielWeb3" icon={<Twitter size={18}/>} label="X (Twitter)" />
              <SocialLink href="https://www.youtube.com/@DanielMihaiCrypto" icon={<Youtube size={18}/>} label="YouTube" />
              <SocialLink href="https://www.linkedin.com/in/mihaidanielmarius/" icon={<Linkedin size={18}/>} label="LinkedIn" />
              <SocialLink href="https://www.tiktok.com/@mihaidanielmarius?_r=1&_t=ZN-91pjNtkxoO3" icon={<Video size={18}/>} label="TikTok" />
            </div>
          </div>

          {/* 2. PLATFORMĂ - AICI AM ACTUALIZAT */}
          <div>
            <h3 className="text-white font-bold mb-6 font-[var(--font-space)] uppercase tracking-wider text-xs">Platformă</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/market" className="hover:text-cyan-400 transition-colors flex items-center gap-2">Market Terminal <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 rounded">LIVE</span></Link></li>
              <li><Link href="/stiri" className="hover:text-white transition-colors">Știri & Analize</Link></li>
              <li><Link href="/academie" className="hover:text-white transition-colors">Academia (Wiki)</Link></li>
              <li><Link href="/curs" className="hover:text-blue-400 transition-colors font-bold">Curs Crypto</Link></li>
              <li><Link href="/#consultanta" className="hover:text-yellow-400 transition-colors font-bold">Consultanță (1-on-1)</Link></li>
            </ul>
          </div>

          {/* 3. LEGAL */}
          <div>
            <h3 className="text-white font-bold mb-6 font-[var(--font-space)] uppercase tracking-wider text-xs">Legal</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/termeni" className="hover:text-white transition-colors flex items-center gap-2"><FileText size={14}/> Termeni și Condiții</Link></li>
              <li><Link href="/confidentialitate" className="hover:text-white transition-colors flex items-center gap-2"><ShieldCheck size={14}/> Confidențialitate</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Politica Cookies</Link></li>
              <li><a href="https://anpc.ro/" target="_blank" rel="nofollow noreferrer" className="hover:text-white transition-colors">ANPC</a></li>
            </ul>
          </div>

          {/* 4. CONTACT */}
          <div>
            <h3 className="text-white font-bold mb-6 font-[var(--font-space)] uppercase tracking-wider text-xs">Contact</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="p-2 bg-white/5 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Mail size={16} />
                </div>
                <span className="mt-1.5 break-all">consultantacrypto.ro@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="p-2 bg-white/5 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <MapPin size={16} />
                </div>
                <span className="mt-1.5">București, România</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/5 pt-8 mb-8">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Disclaimer Investițional</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed text-justify opacity-70 hover:opacity-100 transition-opacity">
                Informațiile de pe mihaidaniel.ro au caracter educativ și NU reprezintă sfaturi financiare. 
                Investițiile crypto implică riscuri majore. Performanțele trecute nu garantează rezultatele viitoare.
            </p>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            &copy; {currentYear} Mihai Daniel. Toate drepturile rezervate.
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 rounded-full border border-green-500/10">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] text-green-400 font-mono font-bold">SYSTEMS OPERATIONAL</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300"
        >
            {icon}
        </a>
    )
}