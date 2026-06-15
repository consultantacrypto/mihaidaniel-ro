export type FaqItem = {
  question: string;
  answer: string;
};

export function buildFaqPageSchema(items: FaqItem[], pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export const CONSULTANCY_FAQ: FaqItem[] = [
  {
    question: 'Ce include sesiunea de consultanță crypto de 1 oră?',
    answer:
      'Audit complet al portofoliului tău, identificarea riscurilor majore, corecția pozițiilor greșite și un plan concret de exit. Primești și bonusuri digitale (framework-uri PDF) în valoare de 200 €.',
  },
  {
    question: 'Pentru cine este consultanța VIP?',
    answer:
      'Pentru investitori care au deja capital în piață (minim câteva mii de dolari) și vor decizii clare, nu teorie. Nu este pentru începători absoluti fără nicio expunere la crypto.',
  },
  {
    question: 'Cum se desfășoară sesiunea după plată?',
    answer:
      'După checkout, primești email de confirmare. Ne contactezi pe WhatsApp sau email pentru a stabili data. Sesiunea se ține online (Zoom/Google Meet), 60 de minute, 1-la-1 cu Mihai Daniel.',
  },
  {
    question: 'Pot plăti cu cardul sau există cod promoțional?',
    answer:
      'Plata se face securizat prin Stripe (card). În pagina de checkout poți aplica un cod promoțional dacă ai unul activ.',
  },
  {
    question: 'Consultanța înlocuiește sfaturile financiare reglementate?',
    answer:
      'Nu. Sesiunea are caracter educativ și strategic. Nu constituie recomandare de investiții reglementată. Deciziile finale îți aparțin.',
  },
];
