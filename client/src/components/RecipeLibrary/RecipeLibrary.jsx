import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RecipeLibrary() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch all available ingredients
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
        );
        const ingredientList = response.data.meals.map(
          (meal) => meal.strIngredient
        );
        setIngredients(["Vegetarian", ...ingredientList]); // Add Vegetarian option
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  const fetchRecipes = async () => {
    try {
      let response;
      if (selectedIngredient === "Vegetarian") {
        response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian`
        );
      } else {
        response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${selectedIngredient}`
        );
      }
      setRecipes(response.data.meals || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recipe Library</h1>
      <select
        value={selectedIngredient}
        onChange={(e) => setSelectedIngredient(e.target.value)}
        className="p-2 border rounded mb-4"
      >
        <option value="">Select an Ingredient</option>
        {ingredients.map((ingredient, index) => (
          <option key={index} value={ingredient}>
            {ingredient}
          </option>
        ))}
      </select>
      <button
        onClick={fetchRecipes}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {recipes.map((recipe) => (
          <div key={recipe.idMeal} className="border p-2 rounded">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full rounded"
            />
            <p className="text-center mt-2">{recipe.strMeal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
