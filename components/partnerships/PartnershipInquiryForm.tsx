'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, Send } from 'lucide-react';

export default function PartnershipInquiryForm() {
  const [agencyName, setAgencyName] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/partnership-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyName, budget, timeline, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not send inquiry.');
      }

      setIsSuccess(true);
      setAgencyName('');
      setBudget('');
      setTimeline('');
      setEmail('');
    } catch (err) {
      console.error('[PartnershipInquiryForm]', err);
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-10 text-center">
        <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
        <p className="text-xl font-bold text-white mb-2">Inquiry received</p>
        <p className="text-gray-300">
          Thank you. Our team will review your brief and reply within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-[#0a0f1e]/80 backdrop-blur-md p-8 md:p-10 space-y-5"
    >
      <div>
        <label htmlFor="agencyName" className="block text-sm font-medium text-gray-300 mb-2">
          Agency name
        </label>
        <input
          id="agencyName"
          type="text"
          required
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
          placeholder="Your agency or brand"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
            Budget (USD)
          </label>
          <input
            id="budget"
            type="text"
            required
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="e.g. $15,000 – $30,000"
          />
        </div>
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">
            Timeline
          </label>
          <input
            id="timeline"
            type="text"
            required
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="e.g. Q3 2026 launch"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Work email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
          placeholder="you@agency.com"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-70 text-white font-bold flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Submit partnership inquiry
            <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
}

