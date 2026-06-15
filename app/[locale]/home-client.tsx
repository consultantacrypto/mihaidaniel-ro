'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import PaymentFeedback from '@/components/PaymentFeedback';
import Hero from '@/components/Hero';
// Eveniment temporar (cina VIP Sinaia) — dezactivat. Reactivează la urmatorul eveniment.
// import VipEventBanner from '@/components/VipEventBanner';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';

const SocialStats = dynamic(() => import('@/components/SocialStats'), {
  loading: () => (
    <div className="h-24 w-full bg-white/[0.02] border-y border-white/5 animate-pulse" />
  ),
});

const CelebrityInterviews = dynamic(
  () => import('@/components/CelebrityInterviews'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full bg-[#020617]/50 animate-pulse rounded-3xl" />
    ),
  }
);

const Consultancy = dynamic(() => import('@/components/Consultancy'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] w-full bg-[#050b1d] animate-pulse border-t border-white/5" />
  ),
});

const Course = dynamic(() => import('@/components/Course'), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full container mx-auto px-6 animate-pulse" />
  ),
});

export default function HomeClient() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <Suspense fallback={null}>
        <PaymentFeedback />
      </Suspense>
      <ScrollProgress />
      <Navbar />
      <Hero />
      {/* Banner eveniment temporar (cina VIP business — Restaurant PAJ, Sinaia).
          Dezactivat dupa eveniment. Decomenteaza pentru urmatorul eveniment. */}
      {/* <VipEventBanner /> */}
      <SocialStats />
      <CelebrityInterviews />
      <Consultancy />
      <Course />
      <Footer />
    </main>
  );
}
