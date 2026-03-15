import React from 'react';
import RecipeResult from '../components/RecipeResult';

export default function Step6Recipe({ recipe, loading, error, user, kosherType, category, servings, difficulty, onRestart, onSelectOption, onAnotherRecipe, useGenderText }) {
  const loadingText = useGenderText('מכין לך מתכון...', 'מכינה לך מתכון...');

  if (loading) {
    return (
      <div className="step-card loading-card">
        <div className="loading-animation">
          <div className="loading-pot">🍳</div>
          <h3 className="playfair loading-text">{loadingText}</h3>
          <div className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="step-card error-card">
        <h3 className="playfair">😕 אופס!</h3>
        <p>{error}</p>
        <button className="btn btn-restart" onClick={onRestart}>נסו שוב</button>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <RecipeResult
      recipe={recipe}
      user={user}
      kosherType={kosherType}
      category={category}
      servings={servings}
      difficulty={difficulty}
      onRestart={onRestart}
      onSelectOption={onSelectOption}
      onAnotherRecipe={onAnotherRecipe}
      useGenderText={useGenderText}
    />
  );
}
