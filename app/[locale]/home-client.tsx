'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import PaymentFeedback from '@/components/PaymentFeedback';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';

const SocialStats = dynamic(() => import('@/components/SocialStats'), {
  ssr: true,
});

const CelebrityInterviews = dynamic(() => import('@/components/CelebrityInterviews'), {
  ssr: true,
  loading: () => <div className="h-96 w-full bg-[#020617]/50 animate-pulse rounded-3xl" />,
});

const Course = dynamic(() => import('@/components/Course'), {
  ssr: true,
});

const Consultancy = dynamic(() => import('@/components/Consultancy'), {
  ssr: true,
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
      <SocialStats />
      <CelebrityInterviews />
      <Consultancy />
      <Course />
      <Footer />
    </main>
  );
}
