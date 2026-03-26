/**
 * Dynamic SEO Landing Page Function
 * Serves SEO-friendly HTML landing pages for user-generated recipe titles.
 * Pages invite visitors to create their own recipe — no actual recipe content is shown.
 *
 * Route: /r/{slug} → this function (via netlify.toml redirect)
 * Data source: Firestore `seoPages` collection (read via REST API)
 */

const SITE_URL = 'https://mayeshrecipes.com';
const PROJECT_ID = 'mayeshrecipes';

const kosherLabels = { meat: 'בשרי', dairy: 'חלבי', pareve: 'פרווה' };
const kosherColors = {
  meat:   { bg: 'rgba(204,51,51,0.12)', color: '#cc3333' },
  dairy:  { bg: 'rgba(74,144,196,0.12)', color: '#4a90c4' },
  pareve: { bg: 'rgba(42,171,134,0.12)', color: '#2aab86' },
};

async function fetchSeoPage(slug) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/seoPages/${encodeURIComponent(slug)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const doc = await res.json();
  if (!doc.fields) return null;
  return {
    title: doc.fields.title?.stringValue || '',
    kosherType: doc.fields.kosherType?.stringValue || 'pareve',
    category: doc.fields.category?.stringValue || '',
  };
}

function generateHTML(data, slug) {
  const { title, kosherType, category } = data;
  const kc = kosherColors[kosherType] || kosherColors.pareve;
  const kosherLabel = kosherLabels[kosherType] || 'פרווה';
  const url = `${SITE_URL}/r/${encodeURIComponent(slug)}`;

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>מתכון ${title} — מה יש לך בבית</title>
  <meta name="description" content="רוצים להכין ${title}? בחרו את המצרכים שיש לכם במטבח וקבלו מתכון ${title} מותאם אישית. מחולל מתכונים חכם בחינם!">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="מתכון ${title} — מה יש לך בבית">
  <meta property="og:description" content="הכינו ${title} מהמצרכים שיש לכם בבית. מחולל מתכונים חכם!">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="he_IL">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="מה יש לך בבית">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="מתכון ${title} — מה יש לך בבית">
  <meta name="twitter:description" content="הכינו ${title} מהמצרכים שיש לכם בבית. מחולל מתכונים חכם!">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700&family=Rubik:wght@700&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "מתכון ${title}",
    "description": "מחולל מתכונים חכם ליצירת מתכון ${title} מותאם אישית",
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
    .logo img{width:48px;height:48px}
    .logo span{font-family:'Rubik',sans-serif;font-size:1.3rem}
    .bc{font-size:.85rem;color:#707070;margin-bottom:1rem;text-align:center}
    .bc a{color:#e85d04;text-decoration:none}
    .badge{display:inline-block;padding:.3rem .8rem;font-size:.85rem;font-weight:600;border:2px solid #111;margin-bottom:1rem;text-align:center;background:${kc.bg};color:${kc.color}}
    h1{font-family:'Rubik',sans-serif;font-size:1.8rem;text-align:center;border:3px solid #111;background:#fff;padding:1rem;margin-bottom:1.5rem}
    .desc{font-size:1.05rem;line-height:1.7;color:#555;text-align:center;margin-bottom:2rem}
    .cta{display:block;width:100%;padding:1rem;font-size:1.2rem;font-weight:700;background:#e85d04;color:#fff;border:3px solid #111;cursor:pointer;text-decoration:none;text-align:center;font-family:'Heebo',sans-serif;transition:transform .1s}
    .cta:hover{transform:translateY(-2px);background:#cc4f00}
    .footer{text-align:center;margin-top:2rem;padding-top:1.5rem;border-top:2px solid rgba(17,17,17,.15);color:#707070;font-size:.85rem}
    .footer a{color:#e85d04;text-decoration:none}
  </style>
</head>
<body>
  <div class="c">
    <div class="logo">
      <a href="/">
        <img src="/favicon.svg" alt="מה יש לך בבית" width="48" height="48">
        <span>מה יש לך בבית</span>
      </a>
    </div>
    <nav class="bc"><a href="/">דף הבית</a> &larr; מתכון ${title}</nav>
    <div style="text-align:center"><span class="badge">${kosherLabel}${category ? ` · ${category}` : ''}</span></div>
    <h1>מתכון ${title}</h1>
    <p class="desc">רוצים להכין ${title}? ספרו לנו אילו מצרכים יש לכם במטבח ונייצר לכם מתכון ${title} מותאם אישית — מהיר, טעים ובדיוק מה שיש לכם בבית.</p>
    <a class="cta" href="/">בואו נבשל ${title}!</a>
    <footer class="footer">
      <p><a href="/">מה יש לך בבית</a> — מחולל מתכונים חכם שעובד עם מה שיש לכם במטבח</p>
    </footer>
  </div>
</body>
</html>`;
}

function generate404() {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>מתכון לא נמצא — מה יש לך בבית</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700&family=Rubik:wght@700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Heebo',sans-serif;background:#f2f0eb;color:#111;direction:rtl;min-height:100vh;display:flex;align-items:center;justify-content:center}
    .c{max-width:500px;text-align:center;padding:2rem}
    h1{font-family:'Rubik',sans-serif;font-size:1.6rem;margin-bottom:1rem}
    p{color:#555;margin-bottom:1.5rem;line-height:1.6}
    .cta{display:inline-block;padding:.8rem 2rem;font-size:1.1rem;font-weight:700;background:#e85d04;color:#fff;border:3px solid #111;text-decoration:none;font-family:'Heebo',sans-serif;transition:transform .1s}
    .cta:hover{transform:translateY(-2px);background:#cc4f00}
  </style>
</head>
<body>
  <div class="c">
    <h1>המתכון לא נמצא</h1>
    <p>אולי הוא הוכן כבר? בואו ניצור מתכון חדש מהמצרכים שיש לכם בבית!</p>
    <a class="cta" href="/">ליצירת מתכון</a>
  </div>
</body>
</html>`;
}

exports.handler = async (event) => {
  // Extract slug from path: /r/{slug}
  const path = event.path || '';
  const match = path.match(/^\/r\/(.+)$/);
  const slug = match ? decodeURIComponent(match[1]) : null;

  if (!slug) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: generate404(),
    };
  }

  try {
    const data = await fetchSeoPage(slug);
    if (!data) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: generate404(),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
      body: generateHTML(data, slug),
    };
  } catch (err) {
    console.error('seo-recipe error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: generate404(),
    };
  }
};
