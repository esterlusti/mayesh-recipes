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
    { id: 'eggs',            label: 'ביצים',             qtyType: 'count',  qtyStep: 1,  defaultQty: 3,   unit: '', pantry: true },
    { id: 'yellow-cheese',   label: 'גבינה צהובה',      qtyType: 'weight', qtyStep: 250, defaultQty: 250, unit: 'גרם' },
    { id: 'white-cheese',    label: 'גבינה לבנה',       qtyType: 'weight', qtyStep: 250, defaultQty: 250, unit: 'גרם' },
    { id: 'bulgarian-cheese',label: 'גבינה בולגרית',    qtyType: 'weight', qtyStep: 250, defaultQty: 250, unit: 'גרם' },
    { id: 'mozzarella',      label: 'גבינת מוצרלה',     qtyType: 'weight', qtyStep: 250, defaultQty: 250, unit: 'גרם' },
    { id: 'parmesan',        label: 'גבינת פרמזן',      qtyType: 'weight', qtyStep: 100, defaultQty: 100, unit: 'גרם' },
    { id: 'sour-cream',      label: 'שמנת חמוצה' },
    { id: 'butter',          label: 'חמאה',              qtyType: 'weight', qtyStep: 100, defaultQty: 100, unit: 'גרם' },
    { id: 'milk',            label: 'חלב',               pantry: true },
    { id: 'cooking-cream',   label: 'שמנת לבישול' },
    { id: 'yogurt',          label: 'יוגורט טבעי',      qtyType: 'weight', qtyStep: 250, defaultQty: 250, unit: 'גרם' },
  ],
  pareve: [
    { id: 'fresh-salmon',    label: 'סלמון טרי',        qtyType: 'weight', qtyStep: 200, defaultQty: 400, unit: 'גרם' },
    { id: 'smoked-salmon',   label: 'סלמון מעושן',      qtyType: 'weight', qtyStep: 100, defaultQty: 100, unit: 'גרם' },
    { id: 'tuna-oil',        label: 'טונה בשמן' },
    { id: 'tuna-water',      label: 'טונה במים' },
    { id: 'nile-fish',       label: 'דג נילוס',          qtyType: 'weight', qtyStep: 200, defaultQty: 400, unit: 'גרם' },
    { id: 'cod-fillet',      label: 'פילה בקלה',        qtyType: 'weight', qtyStep: 200, defaultQty: 400, unit: 'גרם' },
    { id: 'chickpeas',       label: 'גרגרי חומוס' },
    { id: 'red-lentils',     label: 'עדשים כתומות' },
    { id: 'black-lentils',   label: 'עדשים שחורות' },
    { id: 'white-beans',     label: 'שעועית לבנה' },
    { id: 'red-beans',       label: 'שעועית אדומה' },
    { id: 'tofu',            label: 'טופו',              qtyType: 'weight', qtyStep: 200, defaultQty: 200, unit: 'גרם' },
  ]
};

export const VEGETABLES = [
  // בצל, שום ועגבניות
  { id: 'onion',          label: 'בצל',                   group: 'בצל ועגבניות', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '', pantry: true },
  { id: 'garlic',         label: 'שום',                   group: 'בצל ועגבניות', pantry: true },
  { id: 'tomato',         label: 'עגבנייה',               group: 'בצל ועגבניות', qtyType: 'count', qtyStep: 1, defaultQty: 2, unit: '', pantry: true },
  { id: 'cherry-tomatoes',label: 'עגבניות שרי',           group: 'בצל ועגבניות' },

  { id: 'spring-onion',   label: 'בצל ירוק',              group: 'בצל ועגבניות' },
  // שורש
  { id: 'potato',         label: 'תפוח אדמה',             group: 'ירקות שורש', qtyType: 'count', qtyStep: 1, defaultQty: 2, unit: '', pantry: true },
  { id: 'carrot',         label: 'גזר',                   group: 'ירקות שורש', qtyType: 'count', qtyStep: 1, defaultQty: 2, unit: '', pantry: true },
  { id: 'sweet-potato',   label: 'בטטה',                  group: 'ירקות שורש', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'celery',         label: 'סלרי',                  group: 'ירקות שורש' },
  { id: 'leek',           label: 'כרישה',                 group: 'ירקות שורש' },
  // פלפלים וקישואים
  { id: 'red-pepper',     label: 'פלפל אדום',             group: 'פלפלים וקישואים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'yellow-pepper',  label: 'פלפל צהוב',             group: 'פלפלים וקישואים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'green-pepper',   label: 'פלפל ירוק',             group: 'פלפלים וקישואים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'zucchini',       label: 'קישוא',                 group: 'פלפלים וקישואים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'eggplant',       label: 'חציל',                  group: 'פלפלים וקישואים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'cucumber',       label: 'מלפפון',                group: 'פלפלים וקישואים', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  // ירוקים
  { id: 'cauliflower',    label: 'כרובית',                group: 'ירוקים וכרוב' },
  { id: 'broccoli',       label: 'ברוקולי',               group: 'ירוקים וכרוב' },
  { id: 'spinach',        label: 'תרד',                   group: 'ירוקים וכרוב' },
  { id: 'white-cabbage',  label: 'כרוב לבן',              group: 'ירוקים וכרוב' },
  { id: 'purple-cabbage', label: 'כרוב סגול',             group: 'ירוקים וכרוב' },
  { id: 'avocado',        label: 'אבוקדו',                group: 'ירוקים וכרוב', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '' },
  { id: 'lemon',          label: 'לימון',                 group: 'ירוקים וכרוב', qtyType: 'count', qtyStep: 1, defaultQty: 1, unit: '', pantry: true },
  // פטריות וקפואים
  { id: 'mushrooms',      label: 'פטריות שמפיניון',       group: 'פטריות וקפואים' },
  { id: 'portobello',     label: 'פטריות פורטובלו',       group: 'פטריות וקפואים' },
  { id: 'frozen-peas',    label: 'אפונה קפואה',           group: 'פטריות וקפואים' },
  { id: 'frozen-corn',    label: 'תירס קפוא',             group: 'פטריות וקפואים' },
  { id: 'green-beans',    label: 'שעועית ירוקה',          group: 'פטריות וקפואים' },
  // עשבי תיבול
  { id: 'fresh-parsley',  label: 'פטרוזיליה טרייה',       group: 'עשבי תיבול' },
  { id: 'fresh-coriander',label: 'כוסברה טרייה',          group: 'עשבי תיבול' },
];

export const CARBS = [
  { id: 'rice',           label: 'אורז',                  pantry: true },
  { id: 'pasta',          label: 'פסטה',                  pantry: true },
  { id: 'couscous',       label: 'קוסקוס',                pantry: true },
  { id: 'bulgur',         label: 'בורגול' },
  { id: 'ptitim',         label: 'פתיתים' },
  { id: 'quinoa',         label: 'קינואה' },
  { id: 'rice-noodles',   label: 'אטריות אורז',           qtyType: 'weight', qtyStep: 200, defaultQty: 200, unit: 'גרם' },
  { id: 'bread',          label: 'לחם',                   pantry: true },
  { id: 'breadcrumbs',    label: 'פירורי לחם',            pantry: true },
  { id: 'pita',           label: 'פיתות' },
  { id: 'tortilla',       label: 'טורטיות' },
  { id: 'egg-noodles',    label: 'אטריות ביצים' },
  { id: 'lasagna-sheets', label: 'יריעות לזניה' },
  { id: 'polenta',        label: 'פולנטה' },
  { id: 'oats',           label: 'שיבולת שועל',          pantry: true },
];

export const SPICES = [
  { id: 'salt-pepper',    label: 'מלח ופלפל שחור',      pantry: true },
  { id: 'cumin',          label: 'כמון',                  pantry: true },
  { id: 'sweet-paprika',  label: 'פפריקה מתוקה',          pantry: true },
  { id: 'hot-paprika',    label: 'פפריקה חריפה' },
  { id: 'turmeric',       label: 'כורכום',                pantry: true },
  { id: 'cinnamon',       label: 'קינמון',                pantry: true },
  { id: 'oregano',        label: 'אורגנו',                pantry: true },
  { id: 'dried-basil',    label: 'בזיליקום יבש' },
  { id: 'chili-flakes',   label: "צ'ילי פתיתים" },
  { id: 'zaatar',         label: 'זעתר',                  pantry: true },
  { id: 'baharat',        label: 'בהרט' },
  { id: 'rosemary',       label: 'רוזמרין' },
  { id: 'thyme',          label: 'תימין' },
  { id: 'dried-coriander',label: 'כוסברה יבשה' },
  { id: 'white-pepper',   label: 'פלפל לבן' },
  { id: 'cardamom',       label: 'הל' },
  { id: 'ginger-dry',     label: 'זנגביל יבש' },
  { id: 'garlic-powder',  label: 'אבקת שום',              pantry: true },
  { id: 'onion-powder',   label: 'אבקת בצל' },
  { id: 'smoked-paprika', label: 'פפריקה מעושנת' },
  { id: 'nigella',        label: 'קצח (ניגלה)' },
  { id: 'sumac',          label: 'סומאק' },
  { id: 'sugar',          label: 'סוכר',                  pantry: true },
  { id: 'vanilla',        label: 'תמצית וניל',            pantry: true },
  { id: 'baking-powder',  label: 'אבקת אפייה',            pantry: true },
  { id: 'flour',          label: 'קמח',                   pantry: true },
];
