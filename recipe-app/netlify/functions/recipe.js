exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { category, kosherType, proteins, sauces, vegetables, spices, equipment, servings, dishType } = body;

  const kosherRule = kosherType === 'meat'
    ? 'המנה חייבת להיות כשרה לחלוטין — בשרית בלבד. אסור בהחלט לכלול כל מוצר חלבי: גבינה, חמאה, חלב, שמנת, יוגורט וכו\'. זהו כלל הלכתי מחייב.'
    : kosherType === 'dairy'
    ? 'המנה חייבת להיות כשרה לחלוטין — חלבית בלבד. אסור בהחלט לכלול כל מוצר בשרי: עוף, בשר בקר, כבש וכו\'. זהו כלל הלכתי מחייב.'
    : 'המנה צריכה להיות כשרה — פרווה (ללא בשר וללא חלב).';

  const prompt = `אתה שף ישראלי מוכשר ומומחה למטבח כשר. צור מתכון מפורט ומזמין.

קטגוריה: ${category}
${dishType ? `סוג מנה ספציפי: ${dishType}` : ''}
מספר מנות: ${servings}

חומרים זמינים:
- חלבון/בסיס: ${proteins?.join(', ') || 'לא נבחר'}
- רטבים ובסיסים: ${sauces?.join(', ') || 'לא נבחר'}
- ירקות: ${vegetables?.join(', ') || 'לא נבחר'}
- תבלינים: ${spices?.join(', ') || 'בסיסיים'}

כלי בישול זמינים: ${equipment?.join(', ') || 'מחבת וסיר'}

כשרות — חובה קדושה: ${kosherRule}

כתוב את המתכון בפורמט הבא בדיוק:

TITLE: [שם מנה יצירתי ומפתה בעברית]
TIME_PREP: [X דקות]
TIME_COOK: [Y דקות]
DIFFICULTY: [קל / בינוני / מאתגר]

INGREDIENTS:
[רשימת חומרים עם כמויות מדויקות ל-${servings} מנות, כל פריט בשורה חדשה עם • בהתחלה]

STEPS:
[שלבי הכנה ממוספרים, כל שלב ברור ומפורט, כל שלב בשורה חדשה]

TIP: [טיפ אחד של שף שמרים את המנה]

חשוב: השתמש רק בחומרים מהרשימה (תבלינים בסיסיים כמו מלח/פלפל/שמן מותרים תמיד). אל תמציא חומרים שלא נבחרו.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: err }) };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipe: text })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
