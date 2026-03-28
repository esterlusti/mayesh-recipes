export function parseRecipe(text) {
  const lines = text.split('\n');
  let title = '', timePrep = '', timeCook = '', diff = '', tip = '', serving = '', seoBlurb = '';
  const ingredients = [];
  const steps = [];
  let section = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('TITLE:')) { title = trimmed.replace('TITLE:', '').trim(); continue; }
    if (trimmed.startsWith('TIME_PREP:')) { timePrep = trimmed.replace('TIME_PREP:', '').trim(); continue; }
    if (trimmed.startsWith('TIME_COOK:')) { timeCook = trimmed.replace('TIME_COOK:', '').trim(); continue; }
    if (trimmed.startsWith('DIFFICULTY:')) { diff = trimmed.replace('DIFFICULTY:', '').trim(); continue; }
    if (trimmed.startsWith('SERVING:')) { serving = trimmed.replace('SERVING:', '').trim(); continue; }
    if (trimmed.startsWith('TIP:')) { tip = trimmed.replace('TIP:', '').trim(); continue; }
    if (trimmed.startsWith('SEO_BLURB:')) { seoBlurb = trimmed.replace('SEO_BLURB:', '').trim(); continue; }
    if (trimmed === 'INGREDIENTS:') { section = 'ing'; continue; }
    if (trimmed === 'STEPS:') { section = 'steps'; continue; }
    if (section === 'ing' && trimmed) {
      ingredients.push(trimmed.replace(/^[-•*]\s*/, ''));
    }
    if (section === 'steps' && trimmed) {
      steps.push(trimmed.replace(/^\d+[.)]\s*/, ''));
    }
  }
  return { title, timePrep, timeCook, difficulty: diff, ingredients, steps, serving, tip, seoBlurb };
}
