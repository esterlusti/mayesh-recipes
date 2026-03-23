# מה יש לך בבית — מחולל מתכונים חכם

אפליקציית ווב שמייצרת מתכונים מותאמים אישית לפי המצרכים שיש לך במטבח.

**[mayeshrecipes.com](https://mayeshrecipes.com)**

## מבנה הפרויקט
```
recipe-app/
├── index.html                 ← דף ראשי + Firebase Auth
├── netlify.toml               ← הגדרות Netlify + headers
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx                ← קומפוננטת אב
│   ├── main.jsx               ← entry point
│   ├── firebase.js            ← הגדרות Firebase
│   ├── components/            ← קומפוננטות UI
│   ├── steps/                 ← שלבי יצירת מתכון (1-7)
│   ├── hooks/                 ← React hooks מותאמים
│   ├── data/                  ← מצרכים, קטגוריות, ציוד
│   └── styles/                ← CSS
├── netlify/functions/
│   └── recipe.js              ← Serverless function (OpenAI / Gemini)
├── scripts/
│   └── generate-seo-pages.mjs ← מייצר דפי SEO סטטיים בזמן build
└── public/
    ├── favicon.svg
    ├── robots.txt
    ├── sitemap.xml
    └── manifest.json
```

## פיצ'רים עיקריים
- בחירת מצרכים מהמטבח → מתכון מותאם אישית
- תמיכה בכשרות (בשרי / חלבי / פרווה)
- בחירת רמת קושי, זמן, סגנון
- הורדת מתכון כ-PDF
- כניסה עם Google / אורח
- פאנל מנהל
- דפי SEO סטטיים לכל מנה (~75 דפים)

## פיתוח מקומי

```bash
npm install
npm run dev
```

מריץ Vite dev server + Netlify functions server מקומי.

## Build

```bash
npm run build
```

1. `vite build` — בונה את האפליקציה ל-`dist/`
2. `generate-seo-pages.mjs` — מייצר דפי נחיתה סטטיים ב-`dist/recipe/` + sitemap.xml

## דיפלוי
- Netlify מחובר ל-GitHub — push ל-`main` גורר דיפלוי אוטומטי
- Environment variables נדרשים: `OPENAI_API_KEY` (ואופציונלית `GEMINI_API_KEY`)
- Firebase: הדומיין חייב להיות רשום ב-Authentication → Authorized domains

## SEO
- `robots.txt` + `sitemap.xml` — מאפשרים לגוגל לסרוק את האתר
- דפי נחיתה סטטיים לכל מנה (שניצל, חומוס ביתי, שקשוקה...)
- JSON-LD structured data
- Meta tags מלאים (OG, Twitter Cards, canonical)
- Cache headers + Security headers ב-Netlify
