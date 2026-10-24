/**
 * Official public sanctions files.
 * OFAC SDN is a U.S. government work (public domain).
 * The EU token is the Commission's published public download token
 * (base64 of "token-2017"), not a credential.
 */

export const OFAC_SDN_ZIP_URL = 'https://www.treasury.gov/ofac/downloads/sdn_xml.zip';
export const OFAC_SDN_XML_URL = 'https://www.treasury.gov/ofac/downloads/sdn.xml';
export const OFAC_SDN_INFO_URL = 'https://sanctionslist.ofac.treas.gov/Home/SdnList';

export const EU_FSD_PUBLIC_TOKEN = 'dG9rZW4tMjAxNw';
export const EU_FSD_XML_URL = `https://webgate.ec.europa.eu/fsd/fsf/public/files/xmlFullSanctionsList_1_1/content?token=${EU_FSD_PUBLIC_TOKEN}`;
export const EU_FSD_INFO_URL = 'https://data.europa.eu/data/datasets/consolidated-list-of-persons-groups-and-entities-subject-to-eu-financial-sanctions';

export const SOURCE_SITE = 'mihaidaniel.ro';
export const PRODUCT_CODE = 'address_checker' as const;

export const OPERATOR = {
  legalName: 'QuickExit, LLC',
  jurisdiction: 'Delaware',
  street: '131 Continental Dr, Suite 305',
  city: 'Newark',
  region: 'DE',
  postalCode: '19713',
  country: 'US',
} as const;

/** Exact postal line shown in the disclaimer. */
export const OPERATOR_LINE =
  'QuickExit, LLC (Delaware), 131 Continental Dr, Suite 305, Newark, DE 19713, US';

export type SanctionsSourceId = 'ofac-sdn' | 'eu-fsd';

export const SANCTION_SOURCE_META: Record<
  SanctionsSourceId,
  { name: string; publisher: string; infoUrl: string }
> = {
  'ofac-sdn': {
    name: 'OFAC SDN (Trezoreria SUA)',
    publisher: 'U.S. Department of the Treasury, Office of Foreign Assets Control',
    infoUrl: OFAC_SDN_INFO_URL,
  },
  'eu-fsd': {
    name: 'Lista consolidată de sancțiuni financiare a UE',
    publisher: 'European Commission, Financial Sanctions Database',
    infoUrl: EU_FSD_INFO_URL,
  },
};
