'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle2, Download } from 'lucide-react';
type LeadMagnetFormProps = {
  title?: string;
  description?: string;
};

export default function LeadMagnetForm({
  title = 'Ghid gratuit: AI-ul tău de Trading',
  description = 'Tutorial complet: cum folosești ChatGPT în investiții și trading. Primești linkul pe email instant.',
}: LeadMagnetFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Nu am putut trimite ghidul.');
      }

      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('[LeadMagnetForm]', err);
      setError(
        err instanceof Error ? err.message : 'Eroare la trimitere. Încearcă din nou.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
        <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
        <p className="text-lg font-bold text-white mb-2">
          Ghidul a fost trimis pe email!
        </p>
        <p className="text-gray-300 text-sm">
          Verifică inbox-ul (inclusiv Spam).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0f1e]/80 backdrop-blur-md p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Download className="text-blue-400" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplu.com"
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#020617] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
            disabled={isLoading}
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
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-70 text-white font-bold transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Se trimite...
            </>
          ) : (
            'Primește ghidul gratuit'
          )}
        </button>
      </form>
    </div>
  );
}
