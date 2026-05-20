import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo/constants';

export const DEFAULT_OG_IMAGE = {
  url: '/mihai-daniel-consultanta.jpg',
  width: 1200,
  height: 630,
  alt: 'Mihai Daniel — Crypto Expert & Mentor',
} as const;

export const TWITTER_SITE = '@MIhaiDanielWeb3';

type OgImageInput =
  | string
  | {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    };

type BuildPageMetadataInput = {
  title: string;
  description: string;
  /** Path without domain, e.g. `/consultanta-crypto` or `/en` */
  path: string;
  locale?: 'ro_RO' | 'en_US';
  image?: OgImageInput;
  keywords?: string[];
  alternates?: Metadata['alternates'];
};

function resolveOgImage(image?: OgImageInput) {
  if (!image) {
    return [DEFAULT_OG_IMAGE];
  }
  if (typeof image === 'string') {
    return [{ ...DEFAULT_OG_IMAGE, url: image }];
  }
  return [
    {
      url: image.url,
      width: image.width ?? DEFAULT_OG_IMAGE.width,
      height: image.height ?? DEFAULT_OG_IMAGE.height,
      alt: image.alt ?? DEFAULT_OG_IMAGE.alt,
    },
  ];
}

function resolveCanonical(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized === '/' ? '' : normalized}`;
}

/** Shared Open Graph + Twitter Card metadata for premium link previews. */
export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const canonical = resolveCanonical(input.path);
  const images = resolveOgImage(input.image);
  const imageUrl = images[0].url;

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: input.alternates ?? { canonical },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: 'Mihai Daniel',
      locale: input.locale ?? 'ro_RO',
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_SITE,
      creator: TWITTER_SITE,
      title: input.title,
      description: input.description,
      images: [imageUrl],
    },
  };
}
