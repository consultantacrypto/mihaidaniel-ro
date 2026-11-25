import {
  CONSULTANCY_PACKAGES,
  isConsultancyPackageId,
  type ConsultancyPackage,
  type ConsultancyPackageId,
} from './consultancy-packages';
import {
  buildCheckoutLineItem,
  type CheckoutLineItem,
  type CheckoutProductType,
} from './stripe';

export type CheckoutResolution =
  | {
      ok: true;
      type: CheckoutProductType;
      packageId: ConsultancyPackageId | null;
      lineItem: CheckoutLineItem;
    }
  | { ok: false; status: 400; error: string };

const INVALID_TYPE = 'Tip de produs invalid.';
const INVALID_PACKAGE = 'Pachet invalid.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function inlinePackageLineItem(pkg: ConsultancyPackage): CheckoutLineItem {
  return {
    quantity: 1,
    price_data: {
      currency: pkg.currency,
      unit_amount: pkg.unitAmount,
      product_data: {
        name: pkg.checkoutName,
        metadata: {
          checkout_type: 'consultancy',
          package_id: pkg.id,
        },
      },
    },
  };
}

/**
 * Resolves a checkout body to a server-side line item.
 * `amount`, `unit_amount`, `price`, `currency`, and `quantity` on the body are ignored.
 * An unknown package id is rejected. A missing package id keeps today's 200 € session.
 */
export function resolveCheckoutSelection(
  body: unknown,
  env: Record<string, string | undefined> = process.env
): CheckoutResolution {
  if (!isRecord(body)) {
    return { ok: false, status: 400, error: INVALID_TYPE };
  }

  const type = body.type;
  const rawPackageId = body.packageId;
  let packageId: ConsultancyPackageId | null = null;

  if (rawPackageId !== undefined && rawPackageId !== null && rawPackageId !== '') {
    if (typeof rawPackageId !== 'string') {
      return { ok: false, status: 400, error: INVALID_PACKAGE };
    }
    const trimmed = rawPackageId.trim();
    if (!trimmed) {
      packageId = null;
    } else if (!isConsultancyPackageId(trimmed)) {
      return { ok: false, status: 400, error: INVALID_PACKAGE };
    } else {
      packageId = trimmed;
    }
  }

  if (packageId && type !== undefined && type !== 'consultancy') {
    return { ok: false, status: 400, error: INVALID_PACKAGE };
  }

  if (packageId) {
    const pkg = CONSULTANCY_PACKAGES[packageId];
    return {
      ok: true,
      type: 'consultancy',
      packageId: pkg.id,
      lineItem: pkg.useCatalogPrice
        ? buildCheckoutLineItem('consultancy', env)
        : inlinePackageLineItem(pkg),
    };
  }

  if (type === 'consultancy') {
    return {
      ok: true,
      type: 'consultancy',
      packageId: null,
      lineItem: buildCheckoutLineItem('consultancy', env),
    };
  }

  if (type === 'course') {
    return {
      ok: true,
      type: 'course',
      packageId: null,
      lineItem: buildCheckoutLineItem('course', env),
    };
  }

  return { ok: false, status: 400, error: INVALID_TYPE };
}
