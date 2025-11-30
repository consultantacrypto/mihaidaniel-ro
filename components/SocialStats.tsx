'use client';

import { Youtube, Video, Twitter, Linkedin } from 'lucide-react';

export default function SocialStats() {
  return (
    <section className="py-10 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
      <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              
              <a href="https://www.youtube.com/@DanielMihaiCrypto" target="_blank" className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-all group">
                  <div className="p-3 bg-red-500/10 rounded-full group-hover:bg-red-500/20 transition-colors">
                    <Youtube size={24} className="text-red-500"/>
                  </div>
                  <div>
                    <span className="text-xl font-bold block leading-none">96.6K</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subscribers</span>
                  </div>
              </a>

              <a href="https://www.tiktok.com/@mihaidanielmarius" target="_blank" className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-all group">
                  <div className="p-3 bg-pink-500/10 rounded-full group-hover:bg-pink-500/20 transition-colors">
                    <Video size={24} className="text-pink-500"/>
                  </div>
                  <div>
                    <span className="text-xl font-bold block leading-none">118K</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Followers</span>
                  </div>
              </a>

              <a href="https://x.com/MIhaiDanielWeb3" target="_blank" className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-all group">
                  <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                    <Twitter size={24} className="text-white"/>
                  </div>
                  <div>
                    <span className="text-xl font-bold block leading-none">56.7K</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Twitter (X)</span>
                  </div>
              </a>

              <a href="https://www.linkedin.com/in/mihaidanielmarius/" target="_blank" className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-all group">
                  <div className="p-3 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                    <Linkedin size={24} className="text-blue-500"/>
                  </div>
                  <div>
                    <span className="text-xl font-bold block leading-none">13.2K</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LinkedIn</span>
                  </div>
              </a>

          </div>
      </div>
    </section>
  );
}