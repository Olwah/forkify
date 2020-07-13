import axios from 'axios';
import uniqid from 'uniqid';
import { errorHandler, clearLoader } from '../views/base';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            // Create new properties from the object returned by the API
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;   
        } catch (error) {
            // Display error in UI and clear load icon
            clearLoader();
            errorHandler(error);
        }
    }

    calcTime() {
        // Assuming that we need 15min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']; // Note: Add plurals first or the 's' can be left out when replacing.
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']; // Use destructuring to create a new array by adding values to a pre-existing array.

        const newIngredients = this.ingredients.map(el => {

            // 1. Uniform units
            // Loop over the ingredients array and create a new array with all uniform units from 'unitsShort'
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]); 
            });

            // 2. Remove parentheses
            // See 'Regular Expressions' in MDN docs for how to create expressions but the below searches for text within parentheses and replaces it with nothing.
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. Parse ingredients into count, unit & ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // E.g. 4 1/2 cups. arrCount will be ['4', '1/2'] --> eval('4+1/2') --> 4.5
                // E.g. 4 cups. arrCount will be ['4']
                const arrCount = arrIng.slice(0, unitIndex); 

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+')); // See e.g. above for how 'eval' works.
                }

                objIng = {
                    id: uniqid(),
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

                // Test if the first element in the 'arrIng' array can be parsed into a number and use coercion to return a true or false value.
            } else if (parseInt(arrIng[0], 10)) { 
                // There is NO unit but first element is a number
                objIng = {
                    id: uniqid(),
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') // Return the remainder of the 'arrIng' without the first element which in this case would be the number. Use 'join' method to put all individual words back into a string.
                }
            } else if (unitIndex === -1) {
                // There is NO unit & NO number in first position
                objIng = {
                    id: uniqid(),
                    count: 1,
                    unit: '',
                    ingredient // This is the same as writing: ingredient: ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });
        
        this.servings = newServings;
    }
};