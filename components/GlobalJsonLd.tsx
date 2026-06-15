import JsonLd from '@/components/JsonLd';
import type { SchemaLocale } from '@/lib/seo/constants';
import { buildOrganizationSchema } from '@/lib/seo/schemas/organization';
import { buildPersonSchema } from '@/lib/seo/schemas/person';
import { buildWebSiteSchema } from '@/lib/seo/schemas/website';

type GlobalJsonLdProps = {
  locale?: SchemaLocale;
};

export default function GlobalJsonLd({ locale = 'ro' }: GlobalJsonLdProps) {
  return (
    <JsonLd
      data={[
        buildPersonSchema(locale),
        buildOrganizationSchema(locale),
        buildWebSiteSchema(locale),
      ]}
    />
  );
}
