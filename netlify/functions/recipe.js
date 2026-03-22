exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const {
    category, kosherType, equipmentType,
    dishType, proteins, carbs, sauces, vegetables,
    spices, customProteins, customCarbs, customVegetables, customSauces, customSpices,
    equipment, servings, recipeIdea,
    difficulty, recipeStyle, maxMinutes, selectedOption, forceSingle,
    model
  } = body;

  if (model && !['openai', 'gemini'].includes(model)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid model' }) };
  }
  if (servings != null && (typeof servings !== 'number' || servings < 1 || servings > 200)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid servings' }) };
  }

  const useGemini = model === 'gemini';
  const apiKey = useGemini ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY;
  if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'API key missing' }) };

  const sanitize = (str) => str ? str.replace(/[<>{}`\x00-\x1f]/g, '').slice(0, 100) : '';
  const sanitizeArr = (arr) => (arr || []).map(s => sanitize(s)).filter(Boolean);
  const safeIdea = sanitize(recipeIdea);

  const buildSection = (label, items, custom) => {
    const all = [...(items || []), ...sanitizeArr(custom)].filter(Boolean);
    return all.length > 0 ? `${label}: ${all.join(', ')}` : null;
  };

  const ingredientSections = [
    buildSection('חלבונים', proteins, customProteins),
    buildSection('פחמימות', carbs, customCarbs),
    buildSection('ירקות', vegetables, customVegetables),
    buildSection('רטבים', sauces, customSauces),
    buildSection('תבלינים', spices, customSpices),
  ].filter(Boolean);

  const ingredientsText = ingredientSections.length > 0
    ? ingredientSections.join('\n')
    : '(use basic pantry items)';

  const kosherRule = kosherType === 'meat'
    ? `KOSHER — MEAT (בשרי):
       This is a meat recipe. Do NOT include any dairy product whatsoever — no cheese, butter, milk, cream, yogurt, sour cream, whey, or lactose. This is a strict kosher requirement.`
    : kosherType === 'dairy'
    ? `KOSHER — DAIRY (חלבי):
       This is a dairy recipe. Do NOT include any meat product whatsoever — no chicken, beef, lamb, veal, meat stock, or meat-based gelatin. This is a strict kosher requirement.`
    : `KOSHER — PAREVE (פרווה):
       No meat and no dairy ingredients.
       Equipment: ${equipmentType === 'meat' ? 'meat utensils' : 'dairy utensils'} — choose ingredients accordingly.`;

  const difficultyGuide = difficulty === 'easy'
    ? 'DIFFICULTY: Easy — maximum 20 minutes total, very simple steps, suitable for beginners or kids. Think scrambled eggs, simple pasta with store-bought sauce, basic salad, or a quick sandwich. No complex techniques whatsoever.'
    : difficulty === 'hard'
    ? 'DIFFICULTY: Advanced — over 45 minutes allowed, use complex cooking techniques (braising, multi-step sauces, stuffed dishes), multiple components. Requires genuine cooking experience.'
    : 'DIFFICULTY: Medium — 30-45 minutes, standard home cooking, familiar techniques like sautéing, roasting, or basic sauces. Comfortable for an average home cook.';

  const timeConstraint = maxMinutes
    ? `⏱️ HARD TIME LIMIT: Total cooking + prep time MUST NOT exceed ${maxMinutes} minutes. Design the recipe accordingly.`
    : '';

  const optionGuide = selectedOption === 'A'
    ? `The user chose OPTION A: Create a recipe using only the available ingredients below. No shopping needed. Use OPTION: SINGLE format only.`
    : selectedOption === 'B'
    ? `The user chose OPTION B: Create the exact dish they requested (${dishType || category}). Use available ingredients where possible, and mark anything missing with 🛒. Use OPTION: SINGLE format only.`
    : '';

  const styleGuide = recipeStyle === 'special'
    ? `RECIPE STYLE: Creative/Special (מיוחד) — Feel free to use creative flavor combinations, modern techniques, and unexpected twists. Make it interesting and memorable.`
    : `RECIPE STYLE: Classic/Home cooking (קלאסי) — This is the most important instruction: think like an Israeli mom or grandma cooking for her family on a regular weekday. Choose well-known, comforting dishes — schnitzel, meatballs, rice with chicken, simple pasta, shakshuka, couscous, stuffed vegetables, basic salads. The dish name should be something every Israeli child would recognize. Avoid fusion cuisine, restaurant-style plating descriptions, exotic spice blends, or unnecessarily complex techniques. Simple is better.`;

  const ideaGuide = safeIdea
    ? `USER SUGGESTION: "${safeIdea}"
       Use this idea as inspiration, as long as it fits the kosher rules and makes sense with the available ingredients.
       If the suggestion doesn't work (nonsensical, non-kosher, or impossible) — simply ignore it and create the best recipe you can. Don't mention that you changed or ignored the suggestion.`
    : '';

  const prompt = `YOUR TASK: Write a recipe in Hebrew that feels like it came from a family kitchen, not a restaurant.

GUIDING PRINCIPLES:
- Keep it simple and familiar. Real home cooking doesn't need fancy techniques or unusual ingredients.
- Use normal quantities of oil and fat — don't drench everything in olive oil. Use canola oil, butter (in dairy dishes), or margarine where appropriate. Olive oil is great for salads and specific dishes, but it's not the default for everything.
- Write steps that are clear and practical. A home cook should be able to follow along without any professional training.
- Use home-friendly measurements: cups (כוסות), tablespoons (כפות), teaspoons (כפיות). Use grams only for meat, fish, or dough where precision matters.
- The recipe should feel warm and inviting — like someone is sharing their favorite family recipe with you.

${kosherRule}

RECIPE DETAILS:
- Category: ${category}
${dishType ? `- Requested dish: ${dishType}` : ''}
- Servings: ${servings}
- ${difficultyGuide}
${styleGuide}
${timeConstraint}
${ideaGuide}
${optionGuide}

AVAILABLE INGREDIENTS (what the user has at home):
${ingredientsText}

EQUIPMENT: ${(equipment || []).join(', ') || 'standard kitchen equipment'}

INGREDIENT GUIDELINES:
1. Use only the ingredients that make sense for the dish — don't try to use everything on the list.
2. A great recipe uses the right ingredients, not all of them.
3. You can assume salt, pepper, and water are always available. Everything else (including oils) should come from the ingredient list or be explicitly added.
4. Prefer common, everyday seasonings over exotic spice blends. Paprika, cumin, garlic, and onion go a long way.
5. Use realistic quantities for ${servings} servings — not too much, not too little.
6. If the user asked for a specific dish, identify its PRIMARY ingredient:
   - שניצל → chicken breast
   - קציצות → ground meat
   - שקשוקה → eggs
   - פסטה → pasta
   - כרעיים בתנור → chicken drumsticks
   If the primary ingredient is missing from the available list, provide two options (see DUAL format below).

${selectedOption ? '' : `FEASIBILITY CHECK:
Can the requested dish be made with the available ingredients?
- YES → write one recipe using "OPTION: SINGLE"
- NO (key ingredient missing) → write two options using "OPTION: DUAL"
  Option A = a good alternative that works with available ingredients
  Option B = the exact requested dish, with missing ingredients marked 🛒`}

RESPONSE FORMAT — SINGLE recipe:

OPTION: SINGLE
TITLE: [appetizing Hebrew name — keep it simple and recognizable]
TIME_PREP: [X דקות]
TIME_COOK: [Y דקות]
DIFFICULTY: [קל / בינוני / מאתגר]

INGREDIENTS:
- [ingredient — exact quantity for ${servings} servings]
- [continue...]

STEPS:
1. [clear, practical step]
2. [continue...]
(between 4 and 8 steps — as many as needed, no more)

SERVING: [one short suggestion — what to serve alongside this dish]
TIP: [one useful tip that makes a real difference]

RESPONSE FORMAT — DUAL recipe (key ingredient missing):

OPTION: DUAL

OPTION_A_TITLE: [recipe name — works with what you have]
OPTION_A_DESC: [one sentence about this alternative]

OPTION_B_TITLE: [the dish the user wanted]
OPTION_B_DESC: [one sentence about what needs to be bought]
OPTION_B_SHOPPING:
- 🛒 [missing ingredient 1]
- 🛒 [missing ingredient 2]

SELECTED: NONE

When the user picks an option, provide the full recipe in SINGLE format.

OUTPUT RULES:
- Follow the format exactly. Do not add text before or after it.
- Do not add greetings, explanations, or commentary.
- Write the recipe content in Hebrew. Keep field labels (TITLE, INGREDIENTS, STEPS, etc.) in English.
- The title should sound appetizing and natural in Hebrew.`;

  const baseSystemMsg = `You are an experienced Israeli home cook — the kind of person whose food everyone loves at family gatherings. You cook the way Israeli moms and grandmas do: simple, generous, delicious. Always respond in Hebrew.`;

  const formatOverride = forceSingle
    ? ' Respond in OPTION: SINGLE format only. Provide one complete recipe.'
    : selectedOption
    ? ' The user already chose an option. Respond in OPTION: SINGLE format only with one complete recipe.'
    : '';

  const messages = [
    { role: 'system', content: baseSystemMsg + formatOverride },
    { role: 'user', content: prompt }
  ];

  try {
    let text;

    if (useGemini) {
      const geminiBody = {
        contents: [{ parts: [{ text: baseSystemMsg + formatOverride + '\n\n' + prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 2000 }
      };
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiBody)
        }
      );
      if (!response.ok) {
        const err = await response.text();
        return { statusCode: response.status, body: JSON.stringify({ error: err }) };
      }
      const data = await response.json();
      text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages,
          max_tokens: 2000,
          temperature: 0.6
        })
      });

      if (!response.ok) {
        const err = await response.text();
        return { statusCode: response.status, body: JSON.stringify({ error: err }) };
      }

      const data = await response.json();
      text = data.choices?.[0]?.message?.content || '';
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipe: text })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
