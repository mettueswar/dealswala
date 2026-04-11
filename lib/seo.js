const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'DealWala';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dealwala.in';

export function buildMeta({ title, description, path = '', noindex = false } = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Best Coupons & Deals in India`;
  const desc = description || 'Find the best coupons, deals and discount codes from top Indian brands. Save money on every purchase with verified offers.';
  const url = `${SITE_URL}${path}`;
  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    ...(noindex && { robots: { index: false, follow: false } }),
  };
}

export function buildStoreMeta(store) {
  return buildMeta({
    title: `${store.name} Coupons & Deals — Up to ${store.topDiscount || '80%'} Off`,
    description: store.shortDesc,
    path: `/stores/${store.slug}`,
  });
}
