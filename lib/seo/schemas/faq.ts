import { inLanguageFor, type SchemaLocale } from '@/lib/seo/constants';

export type FaqItem = {
  question: string;
  answer: string;
};

export function buildFaqPageSchema(
  items: FaqItem[],
  pageUrl: string,
  locale: SchemaLocale = 'ro'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    inLanguage: inLanguageFor(locale),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2'],
    },
  };
}

const CONSULTANCY_FAQ_BY_LOCALE: Record<SchemaLocale, FaqItem[]> = {
  ro: [
    {
      question: 'Ce include sesiunea de consultanță crypto de 1 oră?',
      answer:
        'O sesiune privată online de 60 de minute, 1 la 1 cu Mihai Daniel, dedicată întrebărilor tale despre portofoliu, riscuri și deciziile pe care le ai de luat. Conversația se adaptează situației tale — nu este un audit exhaustiv scris și nu include un raport livrat ulterior.',
    },
    {
      question: 'Pentru cine este această sesiune?',
      answer:
        'În primul rând pentru persoane care au deja un portofoliu crypto. Poți veni și dacă ai capital disponibil sau pierderi pe care vrei să le înțelegi mai bine. Nu este un curs pentru începători fără nicio expunere la crypto.',
    },
    {
      question: 'Cum se desfășoară sesiunea după plată?',
      answer:
        'După checkout primești un email de confirmare. Ne contactezi pe WhatsApp sau email pentru a stabili data. Sesiunea durează 60 de minute, online. Poți pregăti dinainte lista de întrebări pe care vrei să le acoperim.',
    },
    {
      question: 'Pot plăti cu cardul sau există cod promoțional?',
      answer:
        'Plata se face securizat prin Stripe (card), în euro. În pagina de checkout poți aplica un cod promoțional dacă ai unul activ.',
    },
    {
      question: 'Consultanța înlocuiește sfaturile financiare reglementate?',
      answer:
        'Nu. Sesiunea are caracter educativ și strategic. Nu constituie recomandare de investiții reglementată. Deciziile finale îți aparțin.',
    },
  ],
  en: [
    {
      question: 'What does the one-hour crypto consulting session include?',
      answer:
        'A private 60-minute online session, one-on-one with Mihai Daniel, focused on your questions about portfolio, risks, and the decisions you need to make. The conversation adapts to your situation — it is not an exhaustive written audit and does not include a follow-up report.',
    },
    {
      question: 'Who is this session for?',
      answer:
        'Primarily for people who already hold a crypto portfolio. You can also come if you have available capital or losses you want to understand better. It is not a beginner course for people with no crypto exposure.',
    },
    {
      question: 'What happens after payment?',
      answer:
        'After checkout you receive a confirmation email. Contact us on WhatsApp or email to set a date. The session lasts 60 minutes online. You can prepare a list of questions in advance.',
    },
    {
      question: 'Can I pay by card, and are promo codes accepted?',
      answer:
        'Payment is secured through Stripe (card), in euro. On the checkout page you can apply a promo code if you have an active one.',
    },
    {
      question: 'Does consulting replace regulated financial advice?',
      answer:
        'No. The session is educational and strategic. It does not constitute regulated investment advice. Final decisions remain yours.',
    },
  ],
};

/** @deprecated Prefer getConsultancyFaq(locale) for locale-aware copy */
export const CONSULTANCY_FAQ: FaqItem[] = CONSULTANCY_FAQ_BY_LOCALE.ro;

export function getConsultancyFaq(locale: SchemaLocale = 'ro'): FaqItem[] {
  return CONSULTANCY_FAQ_BY_LOCALE[locale];
}
