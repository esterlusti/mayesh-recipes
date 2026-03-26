/**
 * Dynamic Sitemap Generator
 * Serves a sitemap.xml that includes both static dish-type pages
 * and dynamic user-generated SEO pages from Firestore.
 *
 * Route: /sitemap.xml → this function (via netlify.toml redirect)
 */

const SITE_URL = 'https://mayeshrecipes.com';
const PROJECT_ID = 'mayeshrecipes';

// דפי המנות הסטטיים (מיובאים ידנית כי הפונקציה רצה בצד שרת)
// הרשימה הזו מסונכרנת עם generate-seo-pages.mjs
async function fetchStaticDishes() {
  // קוראים את הקטגוריות ישירות — אותם 78 דפים שנבנים בזמן build
  const { readFileSync } = await import('fs');
  const { join, dirname } = await import('path');
  const { fileURLToPath } = await import('url');

  try {
    const ROOT = join(__dirname, '..', '..');
    let text = readFileSync(join(ROOT, 'src', 'data', 'categories.js'), 'utf8');
    text = text.replace(/export\s+const\s+/g, 'const ');
    const fn = new Function(`${text}\nreturn CATEGORIES;`);
    const CATEGORIES = fn();

    const dishes = new Set();
    for (const categories of Object.values(CATEGORIES)) {
      for (const cat of categories) {
        for (const dish of cat.dishes) {
          dishes.add(dish.replace(/\s+/g, '-'));
        }
      }
    }
    return Array.from(dishes);
  } catch (e) {
    console.error('Failed to read static dishes:', e);
    return [];
  }
}

async function fetchDynamicSeoPages() {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/seoPages?pageSize=500`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents) return [];

    return data.documents.map(doc => {
      const slug = doc.name.split('/').pop();
      return slug;
    });
  } catch (e) {
    console.error('Failed to fetch seoPages:', e);
    return [];
  }
}

exports.handler = async () => {
  const today = new Date().toISOString().split('T')[0];

  const [staticDishes, dynamicSlugs] = await Promise.all([
    fetchStaticDishes(),
    fetchDynamicSeoPages(),
  ]);

  const urls = [];

  // דף הבית
  urls.push(`  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <lastmod>${today}</lastmod>
  </url>`);

  // דפי מנות סטטיים (/recipe/{slug})
  for (const slug of staticDishes) {
    urls.push(`  <url>
    <loc>${SITE_URL}/recipe/${encodeURIComponent(slug)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  // דפי SEO דינמיים (/r/{slug})
  for (const slug of dynamicSlugs) {
    urls.push(`  <url>
    <loc>${SITE_URL}/r/${encodeURIComponent(slug)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
    body: sitemap,
  };
};
