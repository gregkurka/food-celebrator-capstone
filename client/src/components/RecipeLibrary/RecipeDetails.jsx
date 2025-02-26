import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function RecipeDetails() {
  const { id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        setRecipe(response.data.meals ? response.data.meals[0] : null);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (!recipe) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/recipes" className="text-blue-500">
        ← Back to Library
      </Link>
      <h1 className="text-3xl font-bold my-4">{recipe.strMeal}</h1>
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full rounded-lg"
      />
      <h2 className="text-xl font-semibold mt-4">Ingredients:</h2>
      <ul className="list-disc pl-5">
        {Array.from({ length: 20 }, (_, i) => i + 1)
          .map((i) => ({
            ingredient: recipe[`strIngredient${i}`],
            measure: recipe[`strMeasure${i}`],
          }))
          .filter((item) => item.ingredient)
          .map((item, index) => (
            <li key={index}>
              {item.measure} {item.ingredient}
            </li>
          ))}
      </ul>
      <h2 className="text-xl font-semibold mt-4">Instructions:</h2>
      <p className="whitespace-pre-line">{recipe.strInstructions}</p>
    </div>
  );
}
