# 🍳 מה יש בבית? — הוראות העלאה

## מבנה הפרויקט
```
recipe-app/
├── index.html              ← הפרונטאנד + Firebase Auth/Firestore
├── netlify.toml            ← הגדרות Netlify
├── netlify/functions/
│   └── recipe.js           ← backend (OpenAI API key מוגן)
└── README.md
```

---

## שלב א׳ — GitHub

```bash
cd recipe-app
git init
git add .
git commit -m "first commit"
```

גש ל-https://github.com/new → שם: `mayesh-recipes` → Create repository

```bash
git remote add origin https://github.com/YOUR_USERNAME/mayesh-recipes.git
git branch -M main
git push -u origin main
```

---

## שלב ב׳ — Netlify

1. גש ל-https://app.netlify.com
2. **"Add new site" → "Import an existing project" → GitHub**
3. בחרי את `mayesh-recipes`
4. הגדרות:
   - Build command: ריק
   - Publish directory: `.`
5. לחצי **Deploy**

---

## שלב ג׳ — הוסיפי את ה-OpenAI Key

**Site configuration → Environment variables → Add a variable:**
- Key: `OPENAI_API_KEY`
- Value: `sk-...`

לחצי **Save** ← **Deploys → Trigger deploy → Clear cache and deploy**

---

## שלב ד׳ — Firebase: הוסיפי את ה-Domain המורשה

כדי שה-Google Login יעבוד ב-Netlify:
1. גשי ל-https://console.firebase.google.com
2. **Authentication → Settings → Authorized domains**
3. לחצי **Add domain**
4. הכניסי את ה-domain של Netlify שלך (למשל `amazing-app-123.netlify.app`)

---

## עדכונים עתידיים
```bash
git add . && git commit -m "update" && git push
```
Netlify מעדכן אוטומטית תוך ~30 שניות ✅
