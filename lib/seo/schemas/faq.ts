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
      question: 'Ce variante există?',
      answer:
        'Trei. Sesiune 1:1: 60 de minute, 200 €, cu 2 analize tehnice premium. Pachet 3 sesiuni: 540 €, 3 × 60 min, cu 3 analize tehnice. Mentorat 6 săptămâni: 6 × 60 min, chat între sesiuni și 5 analize tehnice, 1.500 €. Plata se face în euro, prin Stripe.',
    },
    {
      question: 'Pentru cine este?',
      answer:
        'Pentru începători și pentru traderi. La începători, focusul este să nu pierzi bani: securitate, exchange, primii pași. La traderi, un plan de trading și managementul riscului. Lucrez cu plăcere cu oricine, de la începători la traderi.',
    },
    {
      question: 'Ce include sesiunea de 200 €?',
      answer:
        'O sesiune privată online de 60 de minute, 1 la 1, plus 2 analize tehnice premium (șapte grafice și secțiunea Risc token, pentru fiecare activ ales de tine). Analizele pleacă pe email, de regulă în 24 de ore lucrătoare. Pachetul de 3 sesiuni include 3 analize, iar mentoratul de 6 săptămâni include 5, plus chat între sesiuni.',
    },
    {
      question: 'Cum rezerv?',
      answer:
        'Alegi varianta de pe pagină și plătești prin Stripe, sau îmi scrii pe contact@stirilecrypto.ro. Stabilim datele împreună, după plată.',
    },
    {
      question: 'Ce se întâmplă după plată?',
      answer:
        'Rămâi pe pagină și primești un email. De acolo îmi scrii pe WhatsApp sau pe email ca să stabilim datele. Poți pregăti o listă scurtă de întrebări.',
    },
    {
      question: 'Pot plăti cu cardul sau există cod promoțional?',
      answer:
        'Plata se face securizat prin Stripe (card), în euro. În pagina de checkout poți aplica un cod promoțional dacă ai unul activ.',
    },
    {
      question: 'Este sfat financiar?',
      answer:
        'Nu. Discuția are caracter educativ. Nu este o recomandare de investiții și nu îți garantează profit. Deciziile finale îți aparțin.',
    },
  ],
  en: [
    {
      question: 'What are the options?',
      answer:
        'Three. 1:1 session: 60 minutes, €200, with 2 premium technical analyses. 3-session pack: €540, 3 × 60 min, with 3 technical analyses. 6-week mentoring: 6 × 60 min, chat between sessions, and 5 technical analyses, €1,500. You pay in euro, through Stripe.',
    },
    {
      question: 'Who is it for?',
      answer:
        'Beginners and traders. For beginners, the focus is not losing money: security, the exchange, and the first steps. For traders, a trading plan and risk management. I enjoy working with anyone, from beginners to traders.',
    },
    {
      question: 'What does the €200 session include?',
      answer:
        'A private 60-minute online session, one-on-one, plus 2 premium technical analyses (seven charts and the token-risk section, for each asset you choose). The analyses are sent by email, usually within 24 working hours. The 3-session pack includes 3 analyses, and the 6-week mentoring includes 5, plus chat between sessions.',
    },
    {
      question: 'How do I book?',
      answer:
        'Pick an option on this page and pay with Stripe, or email me at contact@stirilecrypto.ro. We set the dates together after payment.',
    },
    {
      question: 'What happens after payment?',
      answer:
        'You stay on the page and you receive an email. From there you message me on WhatsApp or email to set the dates. You can prepare a short list of questions.',
    },
    {
      question: 'Can I pay by card, and are promo codes accepted?',
      answer:
        'Payment is secured through Stripe (card), in euro. On the checkout page you can apply a promo code if you have an active one.',
    },
    {
      question: 'Is this financial advice?',
      answer:
        'No. The conversation is educational. It is not an investment recommendation and it does not guarantee a profit. Final decisions remain yours.',
    },
  ],
};

/** @deprecated Prefer getConsultancyFaq(locale) for locale-aware copy */
export const CONSULTANCY_FAQ: FaqItem[] = CONSULTANCY_FAQ_BY_LOCALE.ro;

export function getConsultancyFaq(locale: SchemaLocale = 'ro'): FaqItem[] {
  return CONSULTANCY_FAQ_BY_LOCALE[locale];
}
