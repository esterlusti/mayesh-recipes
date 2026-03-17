// Ingredient objects.
// qtyType: 'count' | 'weight' — if present, shows a quantity selector when selected.
// qtyStep: increment amount, defaultQty: starting value, unit: label (גרם / ק"ג / '')
// pantry: true — pre-selected as a pantry staple by default.
// group: sub-category header label (only for proteins.meat)

export const PROTEINS = {
  meat: [
    // עוף
    { id: 'chicken-breast',   label: 'חזה עוף',          group: 'עוף', qtyType: 'weight', qtyStep: 200, defaultQty: 400, unit: 'גרם' },
    { id: 'chicken-legs',     label: 'כרעיים',           group: 'עוף', qtyType: 'count',  qtyStep: 2,  defaultQty: 4,   unit: '' },
    { id: 'chicken-thighs',   label: 'ירכיים',           group: 'עוף', qtyType: 'count',  qtyStep: 2,  defaultQty: 4,   unit: '' },
    { id: 'chicken-schnitzel',label: 'שניצל עוף',        group: 'עוף', qtyType: 'count',  qtyStep: 1,  defaultQty: 4,   unit: '' },
    { id: 'ground-chicken',   label: 'עוף טחון',         group: 'עוף', qtyType: 'weight', qtyStep: 500, defaultQty: 500, unit: 'גרם' },
    // בשר
    { id: 'entrecote',        label: 'אנטריקוט',         group: 'בשר', qtyType: 'weight', qtyStep: 200, defaultQty: 400, unit: 'גרם' },
    { id: 'ground-beef',      label: 'בשר בקר טחון',    group: 'בשר', qtyType: 'weight', qtyStep: 500, defaultQty: 500, unit: 'גרם' },
    { id: 'beef-shoulder',    label: 'כתף בקר',          group: 'בשר', qtyType: 'weight', qtyStep: 500, defaultQty: 500, unit: 'גרם' },
    { id: 'ground-lamb',      label: 'כבש טחון',         group: 'בשר', qtyType: 'weight', qtyStep: 500, defaultQty: 500, unit: 'גרם' },
    // אחר
    { id: 'sausages',         label: 'נקניקיות',          group: 'אחר', qtyType: 'count',  qtyStep: 2,  defaultQty: 4,   unit: '' },
    { id: 'meatballs-ready',  label: 'קציצות מוכנות',   group: 'אחר', qtyType: 'count',  qtyStep: 4,  defaultQty: 8,   unit: '' },
    { id: 'turkey-breast',    label: 'חזה הודו',         group: 'אחר', qtyType: 'weight', qtyStep: 500, defaultQty: 500, unit: 'גרם' },
  ],
  dairy: [
    // גבינות
    { id: 'yellow-cheese',   label: 'גבינה צהובה',      group: 'גבינות', qtyType: 'weight', qtyStep: 250, defaultQty: 250, unit: 'גרם' },
    { id: 'white-cheese',    label: 'גבינה לבנה',       group: 'גבינות', qtyType: 'weight', qtyStep: 250, defaultQty: 250, unit: 'גרם' },
    { id: 'bulgarian-cheese',label: 'גבינה בולגרית',    group: 'גבינות', qtyType: 'weight', qtyStep: 250, defaultQty: 250, unit: 'גרם' },
    { id: 'mozzarella',      label: 'גבינת מוצרלה',     group: 'גבינות', qtyType: 'weight', qtyStep: 250, defaultQty: 250, unit: 'גרם' },
    { id: 'parmesan',        label: 'גבינת פרמזן',      group: 'גבינות', qtyType: 'weight', qtyStep: 100, defaultQty: 100, unit: 'גרם' },
    // חלב ושמנת
    { id: 'eggs',            label: 'ביצים',             group: 'ביצים וחלב', qtyType: 'count',  qtyStep: 1,  defaultQty: 3,   unit: '', pantry: true },
    { id: 'milk',            label: 'חלב',               group: 'ביצים וחלב', pantry: true },
    { id: 'sour-cream',      label: 'שמנת חמוצה',       group: 'ביצים וחלב' },
    { id: 'cooking-cream',   label: 'שמנת לבישול',      group: 'ביצים וחלב' },
    { id: 'butter',          label: 'חמאה',              group: 'ביצים וחלב', qtyType: 'weight', qtyStep: 100, defaultQty: 100, unit: 'גרם' },
    { id: 'yogurt',          label: 'יוגורט טבעי',      group: 'ביצים וחלב', qtyType: 'weight', qtyStep: 250, defaultQty: 250, unit: 'גרם' },
  ],
  pareve: [
    // דגים
    { id: 'fresh-salmon',    label: 'סלמון טרי',        group: 'דגים', qtyType: 'weight', qtyStep: 200, defaultQty: 400, unit: 'גרם' },
    { id: 'smoked-salmon',   label: 'סלמון מעושן',      group: 'דגים', qtyType: 'weight', qtyStep: 100, defaultQty: 100, unit: 'גרם' },
    { id: 'tuna-oil',        label: 'טונה בשמן',        group: 'דגים' },
    { id: 'tuna-water',      label: 'טונה במים',        group: 'דגים' },
    { id: 'nile-fish',       label: 'דג נילוס',          group: 'דגים', qtyType: 'weight', qtyStep: 200, defaultQty: 400, unit: 'גרם' },
    { id: 'cod-fillet',      label: 'פילה בקלה',        group: 'דגים', qtyType: 'weight', qtyStep: 200, defaultQty: 400, unit: 'גרם' },
    // קטניות
    { id: 'chickpeas',       label: 'גרגרי חומוס',      group: 'קטניות' },
    { id: 'red-lentils',     label: 'עדשים כתומות',     group: 'קטניות' },
    { id: 'black-lentils',   label: 'עדשים שחורות',     group: 'קטניות' },
    { id: 'white-beans',     label: 'שעועית לבנה',      group: 'קטניות' },
    { id: 'red-beans',       label: 'שעועית אדומה',     group: 'קטניות' },
    { id: 'tofu',            label: 'טופו',              group: 'קטניות', qtyType: 'weight', qtyStep: 200, defaultQty: 200, unit: 'גרם' },
  ]
};

export const VEGETABLES = [
  // בסיסיים
  { id: 'onion',          label: 'בצל',                   group: 'בסיסיים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '', pantry: true },
  { id: 'garlic',         label: 'שום',                   group: 'בסיסיים', pantry: true },
  { id: 'tomato',         label: 'עגבנייה',               group: 'בסיסיים', qtyType: 'count', qtyStep: 1, defaultQty: 2, unit: '', pantry: true },
  { id: 'cucumber',       label: 'מלפפון',                group: 'בסיסיים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'potato',         label: 'תפוח אדמה',             group: 'בסיסיים', qtyType: 'count', qtyStep: 1, defaultQty: 2, unit: '', pantry: true },
  { id: 'carrot',         label: 'גזר',                   group: 'בסיסיים', qtyType: 'count', qtyStep: 1, defaultQty: 2, unit: '', pantry: true },
  { id: 'lemon',          label: 'לימון',                  group: 'בסיסיים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '', pantry: true },
  // פלפלים וירוקים
  { id: 'red-pepper',     label: 'פלפל אדום',             group: 'ירוקים ופלפלים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'yellow-pepper',  label: 'פלפל צהוב',             group: 'ירוקים ופלפלים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'green-pepper',   label: 'פלפל ירוק',             group: 'ירוקים ופלפלים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'zucchini',       label: 'קישוא',                  group: 'ירוקים ופלפלים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'eggplant',       label: 'חציל',                   group: 'ירוקים ופלפלים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'sweet-potato',   label: 'בטטה',                   group: 'ירוקים ופלפלים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  // עלים וירוקים
  { id: 'spinach',        label: 'תרד',                    group: 'עלים וירוקים' },
  { id: 'spring-onion',   label: 'בצל ירוק',              group: 'עלים וירוקים' },
  { id: 'celery',         label: 'סלרי',                   group: 'עלים וירוקים' },
  { id: 'leek',           label: 'כרישה',                  group: 'עלים וירוקים' },
  { id: 'fresh-parsley',  label: 'פטרוזיליה טרייה',       group: 'עלים וירוקים' },
  { id: 'fresh-coriander',label: 'כוסברה טרייה',          group: 'עלים וירוקים' },
  // כרוביות ופטריות
  { id: 'cauliflower',    label: 'כרובית',                 group: 'כרוביות ופטריות' },
  { id: 'broccoli',       label: 'ברוקולי',                group: 'כרוביות ופטריות' },
  { id: 'white-cabbage',  label: 'כרוב לבן',              group: 'כרוביות ופטריות' },
  { id: 'purple-cabbage', label: 'כרוב סגול',             group: 'כרוביות ופטריות' },
  { id: 'mushrooms',      label: 'פטריות שמפיניון',       group: 'כרוביות ופטריות' },
  { id: 'portobello',     label: 'פטריות פורטובלו',       group: 'כרוביות ופטריות' },
  // שאר
  { id: 'avocado',        label: 'אבוקדו',                 group: 'שאר', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'cherry-tomatoes',label: 'עגבניות שרי',            group: 'שאר' },
  { id: 'green-beans',    label: 'שעועית ירוקה',           group: 'שאר' },
  // מהמקפיא ומשומרים
  { id: 'frozen-peas',    label: 'אפונה קפואה',            group: 'קפואים ומשומרים' },
  { id: 'frozen-corn',    label: 'תירס קפוא',              group: 'קפואים ומשומרים' },
  { id: 'canned-tomatoes',label: 'עגבניות מרוסקות בקופסה', group: 'קפואים ומשומרים', pantry: true },
];

export const CARBS = [
  // דגנים
  { id: 'rice',           label: 'אורז',                  group: 'דגנים', pantry: true },
  { id: 'couscous',       label: 'קוסקוס',                group: 'דגנים', pantry: true },
  { id: 'bulgur',         label: 'בורגול',                 group: 'דגנים' },
  { id: 'quinoa',         label: 'קינואה',                 group: 'דגנים' },
  { id: 'ptitim',         label: 'פתיתים',                 group: 'דגנים' },
  { id: 'polenta',        label: 'פולנטה',                 group: 'דגנים' },
  { id: 'oats',           label: 'שיבולת שועל',           group: 'דגנים', pantry: true },
  // פסטה ואטריות
  { id: 'pasta',          label: 'פסטה',                  group: 'פסטה ואטריות', pantry: true },
  { id: 'rice-noodles',   label: 'אטריות אורז',           group: 'פסטה ואטריות', qtyType: 'weight', qtyStep: 200, defaultQty: 200, unit: 'גרם' },
  { id: 'egg-noodles',    label: 'אטריות ביצים',          group: 'פסטה ואטריות' },
  { id: 'lasagna-sheets', label: 'יריעות לזניה',          group: 'פסטה ואטריות' },
  // לחמים
  { id: 'bread',          label: 'לחם',                   group: 'לחמים', pantry: true },
  { id: 'breadcrumbs',    label: 'פירורי לחם',            group: 'לחמים', pantry: true },
  { id: 'pita',           label: 'פיתות',                  group: 'לחמים' },
  { id: 'tortilla',       label: 'טורטיות',                group: 'לחמים' },
];

export const SPICES = [
  // בסיסיים
  { id: 'salt-pepper',    label: 'מלח ופלפל שחור',      group: 'בסיסיים', pantry: true },
  { id: 'cumin',          label: 'כמון',                  group: 'בסיסיים', pantry: true },
  { id: 'sweet-paprika',  label: 'פפריקה מתוקה',          group: 'בסיסיים', pantry: true },
  { id: 'hot-paprika',    label: 'פפריקה חריפה',          group: 'בסיסיים' },
  { id: 'turmeric',       label: 'כורכום',                group: 'בסיסיים', pantry: true },
  { id: 'garlic-powder',  label: 'אבקת שום',              group: 'בסיסיים', pantry: true },
  { id: 'onion-powder',   label: 'אבקת בצל',              group: 'בסיסיים' },
  // עשבי תיבול
  { id: 'oregano',        label: 'אורגנו',                group: 'עשבי תיבול', pantry: true },
  { id: 'dried-basil',    label: 'בזיליקום יבש',          group: 'עשבי תיבול' },
  { id: 'zaatar',         label: 'זעתר',                  group: 'עשבי תיבול', pantry: true },
  { id: 'rosemary',       label: 'רוזמרין',                group: 'עשבי תיבול' },
  { id: 'thyme',          label: 'תימין',                  group: 'עשבי תיבול' },
  { id: 'dried-coriander',label: 'כוסברה יבשה',           group: 'עשבי תיבול' },
  // תבלינים חריפים
  { id: 'chili-flakes',   label: "צ'ילי פתיתים",          group: 'חריפים ומיוחדים' },
  { id: 'white-pepper',   label: 'פלפל לבן',              group: 'חריפים ומיוחדים' },
  { id: 'smoked-paprika', label: 'פפריקה מעושנת',         group: 'חריפים ומיוחדים' },
  // תערובות ומיוחדים
  { id: 'baharat',        label: 'בהרט',                   group: 'תערובות' },
  { id: 'cinnamon',       label: 'קינמון',                group: 'תערובות', pantry: true },
  { id: 'cardamom',       label: 'הל',                     group: 'תערובות' },
  { id: 'ginger-dry',     label: 'זנגביל יבש',            group: 'תערובות' },
  { id: 'nigella',        label: 'קצח (ניגלה)',            group: 'תערובות' },
  { id: 'sumac',          label: 'סומאק',                  group: 'תערובות' },
  // אפייה ובסיס
  { id: 'sugar',          label: 'סוכר',                  group: 'אפייה ובסיס', pantry: true },
  { id: 'flour',          label: 'קמח',                   group: 'אפייה ובסיס', pantry: true },
  { id: 'vanilla',        label: 'תמצית וניל',            group: 'אפייה ובסיס', pantry: true },
  { id: 'baking-powder',  label: 'אבקת אפייה',            group: 'אפייה ובסיס', pantry: true },
];
