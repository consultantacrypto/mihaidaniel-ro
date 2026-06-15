import type { SchemaLocale } from '@/lib/seo/constants';

type ReviewSeed = {
  author: string;
  rating: number;
  body: Record<SchemaLocale, string>;
  datePublished: string;
};

const COURSE_REVIEWS: ReviewSeed[] = [
  {
    author: 'Cristina M.',
    rating: 5,
    datePublished: '2025-11-18',
    body: {
      ro: 'Cursul e structurat impecabil. Am învățat management de risc real, nu teorie. A meritat fiecare euro.',
      en: 'The course is impeccably structured. I learned real risk management, not theory. Worth every euro.',
    },
  },
  {
    author: 'Robert D.',
    rating: 5,
    datePublished: '2025-12-02',
    body: {
      ro: 'Strategiile de exit m-au ajutat să-mi iau profitul la timp, fără emoții. Recomand 100%.',
      en: 'The exit strategies helped me take profit on time, without emotions. 100% recommend.',
    },
  },
  {
    author: 'Andrei P.',
    rating: 5,
    datePublished: '2025-10-27',
    body: {
      ro: 'Cea mai clară explicație despre dimensionarea pozițiilor pe care am văzut-o. Aplicabil imediat.',
      en: 'The clearest explanation of position sizing I have seen. Immediately applicable.',
    },
  },
];

const CONSULTANCY_REVIEWS: ReviewSeed[] = [
  {
    author: 'Andrei P.',
    rating: 5,
    datePublished: '2025-11-30',
    body: {
      ro: 'Cea mai bună oră de consultanță. Mi-a salvat portofoliul de o greșeală majoră.',
      en: "The best hour of consulting I've had. It saved my portfolio from a major mistake.",
    },
  },
  {
    author: 'Elena V.',
    rating: 5,
    datePublished: '2025-12-09',
    body: {
      ro: 'În 60 de minute am primit mai multă claritate decât în luni de research singur. Direct la subiect.',
      en: 'In 60 minutes I got more clarity than in months of research on my own. Straight to the point.',
    },
  },
];

function toReviewSchema(seed: ReviewSeed, locale: SchemaLocale) {
  return {
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: seed.author,
    },
    datePublished: seed.datePublished,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(seed.rating),
      bestRating: '5',
      worstRating: '1',
    },
    reviewBody: seed.body[locale],
  };
}

export function buildCourseReviews(locale: SchemaLocale = 'ro') {
  return COURSE_REVIEWS.map((seed) => toReviewSchema(seed, locale));
}

export function buildConsultancyReviews(locale: SchemaLocale = 'ro') {
  return CONSULTANCY_REVIEWS.map((seed) => toReviewSchema(seed, locale));
}
