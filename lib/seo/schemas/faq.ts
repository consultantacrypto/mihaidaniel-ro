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
      question: 'Ce include pachetul de consultanță?',
      answer:
        'O sesiune privată online de 60 de minute, 1 la 1 cu Mihai Daniel, plus 2 analize tehnice premium (șapte grafice și secțiunea Risc token, pentru două active alese de tine). Analizele pleacă pe email, de regulă în 24 de ore lucrătoare. Conversația se adaptează situației tale; nu este un audit scris al întregului portofoliu.',
    },
    {
      question: 'Cum rezerv sesiunea?',
      answer:
        'Poți plăti pachetul prin butonul de pe pagină (Stripe) sau îmi scrii pe contact@stirilecrypto.ro. Stabilim data împreună. Prețul pachetului este 200 €.',
    },
    {
      question: 'Pentru cine este această sesiune?',
      answer:
        'În primul rând pentru persoane care au deja un portofoliu crypto. Poți veni și dacă ai capital disponibil sau pierderi pe care vrei să le înțelegi mai bine. Nu este un curs pentru începători fără nicio expunere la crypto.',
    },
    {
      question: 'Cum se desfășoară sesiunea după plată?',
      answer:
        'După plată rămâi pe pagina de confirmare și primești un email. De acolo îmi scrii pe WhatsApp sau pe email ca să stabilim data. Sesiunea durează 60 de minute, online. Poți pregăti dinainte lista de întrebări pe care vrei să le acoperim.',
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
      question: 'What does the consulting package include?',
      answer:
        'A private 60-minute online session, one-on-one with Mihai Daniel, plus 2 premium technical analyses (seven charts and the token-risk section, for two assets you choose). The analyses are sent by email, usually within 24 working hours. The conversation adapts to your situation; it is not a written audit of the entire portfolio.',
    },
    {
      question: 'How do I book the session?',
      answer:
        'You can pay for the package with the button on this page (Stripe), or email me at contact@stirilecrypto.ro. We set the date together. The package price is €200.',
    },
    {
      question: 'Who is this session for?',
      answer:
        'Primarily for people who already hold a crypto portfolio. You can also come if you have available capital or losses you want to understand better. It is not a beginner course for people with no crypto exposure.',
    },
    {
      question: 'What happens after payment?',
      answer:
        'After payment you stay on the confirmation page and you receive an email. From there you message me on WhatsApp or email to set a date. The session lasts 60 minutes online. You can prepare a list of questions in advance.',
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
