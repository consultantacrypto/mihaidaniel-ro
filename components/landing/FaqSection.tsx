import type { FaqItem } from '@/lib/seo/schemas/faq';

type FaqSectionProps = {
  title?: string;
  items: FaqItem[];
};

export default function FaqSection({
  title = 'Întrebări frecvente',
  items,
}: FaqSectionProps) {
  return (
    <section className="py-20 border-t border-white/5 bg-[#020617]">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          {title}
        </h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <details
              key={index}
              className="group rounded-xl border border-white/10 bg-[#0a0f1e] overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-6 py-5 font-bold text-white flex justify-between items-center gap-4 hover:bg-white/5 transition-colors">
                {item.question}
                <span className="text-blue-400 text-xl shrink-0 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-gray-300 leading-relaxed border-t border-white/5">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
