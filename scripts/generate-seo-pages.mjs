/**
 * SEO Landing Page Generator
 * Runs after `vite build` to create static HTML pages for each dish type.
 * Pages are placed in dist/recipe/{slug}/index.html so Netlify serves them
 * before the SPA fallback.
 *
 * Zero runtime cost — everything is static HTML generated at build time.
 *
 * Safety: MAX_PAGES caps the number of generated pages to prevent abuse
 * or accidental bloat. The build will fail if the limit is exceeded.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Safety limit — if categories.js grows beyond this, the build fails
// instead of silently generating hundreds of thin pages.
const MAX_PAGES = 100;
const DIST = join(ROOT, 'dist');
const SITE_URL = 'https://mayeshrecipes.com';

// ---------------------------------------------------------------------------
// 1. Parse data files (ESM exports → plain JS objects)
// ---------------------------------------------------------------------------

function parseExport(filePath, varName) {
  let text = readFileSync(join(ROOT, filePath), 'utf8');
  // Strip ESM export keywords so code is valid inside a Function body
  text = text.replace(/export\s+const\s+/g, 'const ');
  const fn = new Function(`${text}\nreturn ${varName};`);
  return fn();
}

const CATEGORIES = parseExport('src/data/categories.js', 'CATEGORIES');
const PROTEINS   = parseExport('src/data/ingredients.js', 'PROTEINS');
const VEGETABLES = parseExport('src/data/ingredients.js', 'VEGETABLES');

// ---------------------------------------------------------------------------
// 2. Collect unique dishes
// ---------------------------------------------------------------------------

const kosherLabels = { meat: 'בשרי', dairy: 'חלבי', pareve: 'פרווה' };
const dishes = new Map();

for (const [kosherType, categories] of Object.entries(CATEGORIES)) {
  for (const cat of categories) {
    for (const dishName of cat.dishes) {
      const slug = dishName.replace(/\s+/g, '-');
      if (!dishes.has(slug)) {
        dishes.set(slug, {
          name: dishName,
          slug,
          kosherType,
          kosherLabel: kosherLabels[kosherType],
          categoryName: cat.name,
        });
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Related ingredients per kosher type (pick up to 8)
// ---------------------------------------------------------------------------

function getRelatedIngredients(kosherType) {
  const proteins = (PROTEINS[kosherType] || []).slice(0, 4).map(p => p.label);
  const vegs = VEGETABLES.slice(0, 4).map(v => v.label);
  return [...proteins, ...vegs];
}

// ---------------------------------------------------------------------------
// 4. HTML template
// ---------------------------------------------------------------------------

const kosherColors = {
  meat:   { bg: 'rgba(204,51,51,0.12)', color: '#cc3333' },
  dairy:  { bg: 'rgba(74,144,196,0.12)', color: '#4a90c4' },
  pareve: { bg: 'rgba(42,171,134,0.12)', color: '#2aab86' },
};

function generatePage(dish) {
  const related = getRelatedIngredients(dish.kosherType);
  const tags = related.map(t => `<span class="tag">${t}</span>`).join('\n            ');
  const kc = kosherColors[dish.kosherType];
  const url = `${SITE_URL}/recipe/${encodeURIComponent(dish.slug)}`;

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>מתכון ${dish.name} — מה יש לך בבית</title>
  <meta name="description" content="רוצים להכין ${dish.name}? בחרו את המצרכים שיש לכם במטבח וקבלו מתכון ${dish.name} מותאם אישית. מחולל מתכונים חכם בחינם!">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="מתכון ${dish.name} — מה יש לך בבית">
  <meta property="og:description" content="הכינו ${dish.name} מהמצרכים שיש לכם בבית. מחולל מתכונים חכם!">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="he_IL">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="מה יש לך בבית">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="מתכון ${dish.name} — מה יש לך בבית">
  <meta name="twitter:description" content="הכינו ${dish.name} מהמצרכים שיש לכם בבית. מחולל מתכונים חכם!">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700&family=Rubik:wght@700&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "מתכון ${dish.name}",
    "description": "מחולל מתכונים חכם ליצירת מתכון ${dish.name} מותאם אישית",
    "url": "${url}",
    "inLanguage": "he",
    "isPartOf": {
      "@type": "WebApplication",
      "name": "מה יש לך בבית",
      "url": "${SITE_URL}",
      "applicationCategory": "FoodApplication"
    }
  }
  </script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Heebo',sans-serif;background:#f2f0eb;color:#111;direction:rtl;min-height:100vh}
    .c{max-width:600px;margin:0 auto;padding:2rem 1.5rem}
    .logo{text-align:center;margin-bottom:1.5rem}
    .logo a{text-decoration:none;color:inherit;display:inline-flex;flex-direction:column;align-items:center;gap:.3rem}
    .logo img{height:60px;width:auto}
    .logo span{display:none}
    .bc{font-size:.85rem;color:#707070;margin-bottom:1rem;text-align:center}
    .bc a{color:#e85d04;text-decoration:none}
    .badge{display:inline-block;padding:.3rem .8rem;font-size:.85rem;font-weight:600;border:2px solid #111;margin-bottom:1rem;text-align:center;background:${kc.bg};color:${kc.color}}
    h1{font-family:'Rubik',sans-serif;font-size:1.8rem;text-align:center;border:3px solid #111;background:#fff;padding:1rem;margin-bottom:1.5rem}
    .desc{font-size:1.05rem;line-height:1.7;color:#555;text-align:center;margin-bottom:2rem}
    .cta{display:block;width:100%;padding:1rem;font-size:1.2rem;font-weight:700;background:#e85d04;color:#fff;border:3px solid #111;cursor:pointer;text-decoration:none;text-align:center;font-family:'Heebo',sans-serif;transition:transform .1s}
    .cta:hover{transform:translateY(-2px);background:#cc4f00}
    .tags-title{font-size:1rem;font-weight:600;text-align:center;margin:2rem 0 .8rem}
    .tags{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-bottom:2rem}
    .tag{padding:.3rem .8rem;border:2px solid #111;background:#fff;font-size:.9rem}
    .footer{text-align:center;margin-top:2rem;padding-top:1.5rem;border-top:2px solid rgba(17,17,17,.15);color:#707070;font-size:.85rem}
    .footer a{color:#e85d04;text-decoration:none}
  </style>
</head>
<body>
  <div class="c">
    <div class="logo">
      <a href="/">
        <img src="/logo.png" alt="מה יש לך בבית">
        <span>מה יש לך בבית</span>
      </a>
    </div>
    <nav class="bc"><a href="/">דף הבית</a> &larr; מתכון ${dish.name}</nav>
    <div style="text-align:center"><span class="badge">${dish.kosherLabel} · ${dish.categoryName}</span></div>
    <h1>מתכון ${dish.name}</h1>
    <p class="desc">רוצים להכין ${dish.name}? ספרו לנו אילו מצרכים יש לכם במטבח ונייצר לכם מתכון ${dish.name} מותאם אישית — מהיר, טעים ובדיוק מה שיש לכם בבית.</p>
    <a class="cta" href="/">בואו נבשל ${dish.name}!</a>
    <div class="tags-title">מצרכים שאפשר להשתמש</div>
    <div class="tags">
            ${tags}
    </div>
    <footer class="footer">
      <p><a href="/">מה יש לך בבית</a> — מחולל מתכונים חכם שעובד עם מה שיש לכם במטבח</p>
    </footer>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// 5. Safety check + Generate all pages
// ---------------------------------------------------------------------------

if (dishes.size > MAX_PAGES) {
  console.error(`SEO ERROR: ${dishes.size} dishes found, but MAX_PAGES is ${MAX_PAGES}.`);
  console.error('Increase MAX_PAGES in generate-seo-pages.mjs if this is intentional.');
  process.exit(1);
}

console.log(`SEO: Found ${dishes.size} unique dishes (limit: ${MAX_PAGES})`);

for (const dish of dishes.values()) {
  const dir = join(DIST, 'recipe', dish.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), generatePage(dish), 'utf8');
}

// ---------------------------------------------------------------------------
// 6. Generate sitemap.xml
// ---------------------------------------------------------------------------

const today = new Date().toISOString().split('T')[0];
const urls = [
  `  <url>\n    <loc>${SITE_URL}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n    <lastmod>${today}</lastmod>\n  </url>`,
  ...Array.from(dishes.values()).map(d =>
    `  <url>\n    <loc>${SITE_URL}/recipe/${encodeURIComponent(d.slug)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  ),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

console.log(`SEO: Generated ${dishes.size} landing pages + sitemap.xml`);
