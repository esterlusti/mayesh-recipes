exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (useGemini && !geminiKey) return { statusCode: 500, body: JSON.stringify({ error: 'Gemini API key missing' }) };
  if (!useGemini && !openaiKey) return { statusCode: 500, body: JSON.stringify({ error: 'OpenAI API key missing' }) };

  const body = JSON.parse(event.body);
  const {
    category, kosherType, equipmentType,
    dishType, proteins, carbs, sauces, vegetables,
    spices, customProteins, customCarbs, customVegetables, customSauces, customSpices,
    equipment, servings, recipeIdea,
    difficulty, recipeStyle, maxMinutes, selectedOption, forceSingle,
    model
  } = body;

  const useGemini = model === 'gemini';

  const sanitize = (str) => str ? str.replace(/[<>{}]/g, '').slice(0, 100) : '';
  const sanitizeArr = (arr) => (arr || []).map(s => sanitize(s)).filter(Boolean);
  const safeIdea = sanitize(recipeIdea);

  const allIngredients = [
    ...(proteins || []),
    ...sanitizeArr(customProteins),
    ...(carbs || []),
    ...sanitizeArr(customCarbs),
    ...(sauces || []),
    ...sanitizeArr(customSauces),
    ...(vegetables || []),
    ...sanitizeArr(customVegetables),
    ...(spices || []),
    ...sanitizeArr(customSpices),
  ].filter(Boolean);

  const kosherRule = kosherType === 'meat'
    ? `⚠️ ABSOLUTE KOSHER LAW — MEAT (בשרי):
       This recipe is 100% meat-based.
       STRICTLY FORBIDDEN: ANY dairy product — cheese, butter, milk, cream,
       yogurt, sour cream, whey, lactose. NO exceptions. NO substitutions.
       This is an inviolable halachic requirement.`
    : kosherType === 'dairy'
    ? `⚠️ ABSOLUTE KOSHER LAW — DAIRY (חלבי):
       This recipe is 100% dairy-based.
       STRICTLY FORBIDDEN: ANY meat product — chicken, beef, lamb, veal,
       meat stock, gelatin from meat. NO exceptions.
       This is an inviolable halachic requirement.`
    : `⚠️ KOSHER LAW — PAREVE (פרווה):
       No meat AND no dairy ingredients.
       Equipment used: ${equipmentType === 'meat' ? 'meat utensils' : 'dairy utensils'} —
       this affects which ingredients are appropriate.`;

  const difficultyGuide = difficulty === 'easy'
    ? 'DIFFICULTY: Easy — max 30 minutes total, minimal equipment, beginner-friendly. Simple techniques only.'
    : difficulty === 'hard'
    ? 'DIFFICULTY: Advanced — complex techniques allowed, no time restriction.'
    : 'DIFFICULTY: Medium — up to 1 hour, standard home cooking techniques.';

  const timeConstraint = maxMinutes
    ? `⏱️ HARD TIME LIMIT: Total cooking + prep time MUST NOT exceed ${maxMinutes} minutes. Design the recipe accordingly.`
    : '';

  const optionGuide = selectedOption === 'A'
    ? `IMPORTANT — USER ALREADY SELECTED OPTION A:
       Create a recipe using ONLY the available ingredients listed below.
       Do NOT suggest buying anything. Do NOT use DUAL format. Do NOT offer options.
       You MUST respond with OPTION: SINGLE format only. One complete recipe.`
    : selectedOption === 'B'
    ? `IMPORTANT — USER ALREADY SELECTED OPTION B:
       Create the exact recipe the user originally requested (${dishType || category}).
       Use available ingredients where possible, and mark any ingredient NOT in the available list with 🛒 at the start.
       Do NOT use DUAL format. Do NOT offer options.
       You MUST respond with OPTION: SINGLE format only. One complete recipe.`
    : '';

  const styleGuide = recipeStyle === 'special'
    ? `RECIPE STYLE: Creative/Special (מיוחד) — You may use creative flavor combinations, modern techniques, and unexpected twists. Make it interesting and memorable.`
    : `RECIPE STYLE: Classic/Home cooking (קלאסי) — IMPORTANT: Prefer well-known, classic Israeli home-cooking recipes. Think simple, comforting, familiar dishes that Israeli families make regularly. Avoid overly exotic, fusion, or complicated recipes. A 10-year-old should recognize the dish name.`;

  const ideaGuide = safeIdea
    ? `USER SUGGESTION: "${safeIdea}"
       Instructions: Use this as creative inspiration ONLY IF it:
       (a) complies with the kosher rules above
       (b) makes culinary sense with the available ingredients
       (c) is a reasonable, real food concept
       If the suggestion is nonsensical, impossible, offensive, or non-kosher —
       SILENTLY IGNORE IT and create the best recipe from available ingredients.
       Never mention that you ignored or modified the suggestion.`
    : '';

  const prompt = `You are a master Israeli kosher home chef with 30 years of experience cooking for families.

YOUR TASK: Create a delicious, realistic, home-friendly recipe in Hebrew.
GOLDEN RULE: Write recipes that real Israeli families actually cook at home. No restaurant techniques, no obscure ingredients unless specifically requested. The recipe must be practical and achievable in a home kitchen.

${kosherRule}

RECIPE PARAMETERS:
- Category: ${category}
${dishType ? `- Specific dish requested: ${dishType}` : ''}
- Servings: ${servings}
- ${difficultyGuide}
${styleGuide}
${timeConstraint}
${ideaGuide}
${optionGuide}

AVAILABLE INGREDIENTS (what the user has at home):
${allIngredients.length > 0 ? allIngredients.join(', ') : '(use basic pantry items)'}

AVAILABLE EQUIPMENT: ${(equipment || []).join(', ') || 'standard kitchen equipment'}

CRITICAL RULES FOR INGREDIENT USAGE:
1. Do NOT force all listed ingredients into the recipe. Use only what makes culinary sense for the dish.
2. A good recipe uses the RIGHT ingredients, not ALL ingredients.
3. Salt, black pepper, olive oil, and water are always assumed available.
4. If the user requested a specific dish (e.g. "כרעיים בתנור", "שניצל"):
   - Check if the KEY ingredient for that dish exists in the available list.
   - If the key ingredient is MISSING: you MUST provide TWO options (see format below).

${selectedOption ? '' : `FEASIBILITY CHECK:
Before writing the recipe, check: can the requested dish be made with the available ingredients?
- If YES (key ingredients available): write ONE recipe using "OPTION: SINGLE"
- If NO (key ingredient missing): write TWO options using "OPTION: DUAL"
  Option A = an alternative recipe that CAN be made with available ingredients
  Option B = the exact requested recipe, marking missing ingredients with 🛒`}

RESPONSE FORMAT for SINGLE recipe (key ingredients available):

OPTION: SINGLE
TITLE: [creative appetizing Hebrew name]
TIME_PREP: [X דקות]
TIME_COOK: [Y דקות]
DIFFICULTY: [קל / בינוני / מאתגר]

INGREDIENTS:
- [ingredient — exact quantity for ${servings} servings]
- [continue... only ingredients that make sense for this dish]

STEPS:
1. [detailed step]
2. [continue...]
(minimum 5 steps, maximum 10)

TIP: [one professional tip that genuinely elevates the dish]

RESPONSE FORMAT for DUAL recipe (key ingredient missing):

OPTION: DUAL

OPTION_A_TITLE: [name — recipe that works with available ingredients]
OPTION_A_DESC: [one sentence explaining this is an alternative with what you have]

OPTION_B_TITLE: [name — the exact dish the user requested]
OPTION_B_DESC: [one sentence explaining what needs to be bought]
OPTION_B_SHOPPING:
- 🛒 [missing ingredient 1]
- 🛒 [missing ingredient 2]

SELECTED: NONE

When the user selects an option, provide the full recipe in the SINGLE format above.`;

  const systemInstruction = forceSingle
    ? 'CRITICAL: You MUST respond ONLY in OPTION: SINGLE format. Under no circumstances use OPTION: DUAL. Provide a single complete recipe immediately.'
    : selectedOption
    ? 'You MUST respond using OPTION: SINGLE format only. NEVER use OPTION: DUAL. The user has already made their choice. Provide one complete recipe, nothing else.'
    : null;

  const messages = systemInstruction
    ? [{ role: 'system', content: systemInstruction }, { role: 'user', content: prompt }]
    : [{ role: 'user', content: prompt }];

  try {
    let text = '';

    if (useGemini) {
      // Gemini API call
      const geminiBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.75, maxOutputTokens: 2000 }
      };
      if (systemInstruction) {
        geminiBody.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
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
      // OpenAI API call
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 2000,
          temperature: 0.75
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
