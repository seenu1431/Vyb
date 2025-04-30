const fs = require('fs');

// Sample Nutrition Database
const nutritionDb = {
    "Paneer": { "calories": 265, "protein": 18, "carbs": 1.2, "fat": 20 },
    "Butter": { "calories": 717, "protein": 0.9, "carbs": 0.1, "fat": 81 },
    "Tomato": { "calories": 18, "protein": 0.9, "carbs": 3.9, "fat": 0.2 },
    "Onion": { "calories": 40, "protein": 1.1, "carbs": 9.3, "fat": 0.1 },
    "Cream": { "calories": 340, "protein": 2.1, "carbs": 3.0, "fat": 36 }
};

// Function to fetch ingredients (mocked)
const fetchRecipe = (dishName) => {
    const recipes = {
        "Paneer Butter Masala": [
            { "ingredient": "Paneer", "quantity": "0.75 cup" },
            { "ingredient": "Butter", "quantity": "2 tsp" },
            { "ingredient": "Tomato", "quantity": "0.5 cup" },
            { "ingredient": "Onion", "quantity": "0.5 cup" },
            { "ingredient": "Cream", "quantity": "1 tbsp" }
        ]
    };
    return recipes[dishName] || [];
};

// Convert household measurements to grams
const convertToGrams = (quantity) => {
    const conversions = {
        "cup": 240, // Approximate weight in grams for liquid
        "tsp": 5, // Approximate weight in grams for dry ingredients
        "tbsp": 15, // Approximate weight in grams for dry ingredients
        "ml": 1, // Milliliters to grams (1:1 for water-like substances)
    };

    const match = quantity.match(/(\d*\.?\d+)\s*(\w+)/);
    if (match) {
        const amount = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        return amount * (conversions[unit] || 1); // Default to 1 if unit not found
    }
    return 0; // Return 0 if conversion fails
};

// Function to calculate nutrition
const calculateNutrition = (ingredients) => {
    const totalNutrition = { "calories": 0, "protein": 0, "carbs": 0, "fat": 0 };
    ingredients.forEach(item => {
        const ingredient = item.ingredient;
        const quantityInGrams = convertToGrams(item.quantity);
        if (nutritionDb[ingredient]) {
            Object.keys(totalNutrition).forEach(nutrient => {
                totalNutrition[nutrient] += (quantityInGrams * nutritionDb[ingredient][nutrient]) / 100;
            });
        } else {
            console.warn(`Ingredient not found in database: ${ingredient}`);
        }
    });
    return totalNutrition;
};

// Main function
const main = (dishName) => {
    const ingredients = fetchRecipe(dishName);
    const nutrition = calculateNutrition(ingredients);
    
    // Assuming standard serving size calculation
    const standardServingSize = 180; // grams
    const totalWeight = ingredients.reduce((sum, item) => sum + convertToGrams(item.quantity), 0);
    
    const standardServingNutrition = {};
    Object.keys(nutrition).forEach(nutrient => {
        standardServingNutrition[nutrient] = (nutrition[nutrient] * (standardServingSize / totalWeight)).toFixed(2);
    });

    return {
        estimated_nutrition_per_200ml_katori: standardServingNutrition,
        dish_type: "Wet Sabzi",
        ingredients_used: ingredients
    };
};

// Example Usage
const dishName = "Paneer Butter Masala";
const output = main(dishName);
console.log(JSON.stringify(output, null, 2));
