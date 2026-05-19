import JsonLd from '@/components/JsonLd';
import { buildOrganizationSchema } from '@/lib/seo/schemas/organization';
import { buildPersonSchema } from '@/lib/seo/schemas/person';
import { buildWebSiteSchema } from '@/lib/seo/schemas/website';

export default function GlobalJsonLd() {
  return (
    <JsonLd
      data={[
        buildPersonSchema(),
        buildOrganizationSchema(),
        buildWebSiteSchema(),
      ]}
    />
  );
}
