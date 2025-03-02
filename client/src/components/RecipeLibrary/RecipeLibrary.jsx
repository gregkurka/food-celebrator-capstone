import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RecipeLibrary() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
        );
        const ingredientList = response.data.meals
          .map((meal) => meal.strIngredient)
          .sort((a, b) => a.localeCompare(b)); // Sort ingredients alphabetically

        setIngredients(ingredientList); // Keep "Vegetarian" at the top
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  useEffect(() => {
    if (selectedIngredient) {
      fetchRecipes();
    }
  }, [selectedIngredient]);

  const fetchRecipes = async () => {
    if (!selectedIngredient) return; // Prevent unnecessary API calls

    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${selectedIngredient}`
      );
      setRecipes(response.data.meals || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-font dark:text-darkfont">
        Recipe Library
      </h1>

      <label
        htmlFor="ingredient-select"
        className="text-font dark:text-darkfont block mb-2"
      >
        Choose an ingredient:
      </label>
      <select
        id="ingredient-select"
        value={selectedIngredient}
        onChange={(e) => setSelectedIngredient(e.target.value)}
        className="p-2 border rounded mb-4 border-font dark:border-darkfont text-font dark:text-darkfont"
      >
        <option className="text-font dark:text-font" value="">
          Select an Ingredient
        </option>
        {ingredients.map((ingredient, index) => (
          <option
            className="text-font dark:text-font"
            key={index}
            value={ingredient}
          >
            {ingredient}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="text-font dark:text-darkfont">Loading recipes...</p>
      ) : recipes.length === 0 && selectedIngredient ? (
        <p className="text-font dark:text-darkfont">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.idMeal}
              className="border border-font dark:border-darkfont p-2 rounded"
            >
              <Link to={`/recipe/${recipe.idMeal}`}>
                <img
                  src={recipe.strMealThumb}
                  alt={`Recipe: ${recipe.strMeal}`}
                  className="w-full rounded cursor-pointer"
                />
                <p className="text-center mt-2 text-font dark:text-darkfont">
                  {recipe.strMeal}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
