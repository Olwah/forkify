import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, elementStrings, renderLoader, clearLoader, errorHandler } from './views/base';

/* 
Global state of the app  
    * Search object
    * Current recipe object
    * Shopping list object
    * Liked recipes
*/

const state = {};

// TESTING
window.state = state;

// SEARCH CONTROLLER
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput(); // The 'searchView' js file is imported as an object so we can access functions as if they were within an object.
    
    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);
        
        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes); // Pass in the 'parent' element as argument where we want to display the loader.

        try {
            // 4. Search for recipes
            await state.search.getResults(); // Retrieve and store the results of the search on the 'state' object. Use 'await' keyword to allow data to be returned.

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result); // Call the 'renderResults' function from searchView.js passing in the search results as the arguement.

        } catch (error) {
            // Display error in UI and clear load icon
            clearLoader();
            errorHandler(error);
        }
    }
};

// Retrieving saved querystrings from 'elements' variable in 'base.js'.
// Event listener for the search 'submit' button
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest(`.${elementStrings.btnPages}`); // 'closest' method used to select the closest parent element when clicking. In this case we want the 'button' element.
    
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // This selects the 'data-goto' attribute on the button element which contains our page numbers. The 10 is the base number.

        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }   
});

// RECIPE CONTROLLER
const controlRecipe = async () => {
    // Get ID from URL
    const id = window.location.hash.replace('#', ''); // This const will only store the id of the recipe and the 'replace' method allows us to remove the '#' symbol from the ID.

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected recipe
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (error) {
            // Display error in UI and clear load icon
            clearLoader();
            errorHandler(error);
        }
    }  
};

// Add event listener to the browser using the 'window' object that will be triggered when there is a change in the ID in the url when a recipe is clicked on. 
    // window.addEventListener('hashchange', controlRecipe);
// Add event listener that triggers when the page is loaded (if you were to bookmark a recipe and return to the page at a later date.)
    // window.addEventListener('load', controlRecipe);
// This can be condensed into a single line of code using a 'forEach' loop.
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// LIST CONTROLLER
const controlList = () => {
    // Create a new list if there is no list
    if (!state.list) {
        state.list = new List();
        // Add the 'clear all' button to UI
        listView.renderClearItems();
    } else if (state.list.items.length === 0) {
        listView.renderClearItems();
    }

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

const controlSingleIngredient = (id) => {
    // Create a new list if there is no list
    if (!state.list) {
        state.list = new List();
        // Add the 'clear all' button to UI
        listView.renderClearItems();
    } else if (state.list.items.length === 0) {
        listView.renderClearItems();
    }
    // Create an array with all the ingredient IDs
    const ingredientArr = state.recipe.ingredients;

    for (let i = 0; i < ingredientArr.length; i++) {
        //let ingredientID = ingredientArr[i].id;
        if (ingredientArr[i].id === id) {
            const item = state.list.addItem(ingredientArr[i].count, ingredientArr[i].unit, ingredientArr[i].ingredient);
            listView.renderItem(item);
        }
    }
};

// Restore shopping list items on page load
window.addEventListener('load', () => {
    // Load empty List object
    state.list = new List();

    // Restore list items from localStorage
    state.list.readStorage();
    
    // Display shopping list items
    if (state.list.items.length > 0) {
        listView.renderClearItems();
        state.list.items.forEach(el => {
            listView.renderItem(el);
        });
    }
});

// Handle, delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest(`.${elementStrings.shoppingItem}`).dataset.itemid;

    // Handle the delete button
    if (e.target.matches(`.${elementStrings.btnShoppingDelete}, .${elementStrings.btnShoppingDelete} *`)) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleteItem(id);
        
    // Handle the count update
    } else if (e.target.matches(`.${elementStrings.shoppingCountValue}`)) {
        const val = parseFloat(e.target.value, 10);
        if (val >= 0) state.list.updateCount(id, val);
    } 
});

// Handle clearing ALL shopping list items
elements.shopContainer.addEventListener('click', e => {
    if (e.target.matches(`.${elementStrings.shoppingDelAll}, .${elementStrings.shoppingDelAll} *`)) {
        // Delete all list items from state
        state.list.deleteAllItems();
        // Delete all list items from UI
        listView.clearItems();
    }
});

// LIKE CONTROLLER
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT liked the current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add recipe to the UI 'liked' list
        likesView.renderLike(newLike);

    // User HAS liked the current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove recipe from the UI 'liked' list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    // Load empty likes object
    state.likes = new Likes();

    // Restore likes from localStorage
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks. We need to do it in this way because these chunks of HTML are not on the DOM initially.
elements.recipe.addEventListener('click', e => {
    if (e.target.matches(`.${elementStrings.btnDecrease}, .${elementStrings.btnDecrease} *`)) { // Can use 'matches' method when you need to target a specific class name. Used when there are multiple buttons or clickable areas. The '*' selects any of the child elements of .${elementStrings.btnDecrease}
        // Decrease if button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches(`.${elementStrings.btnServingIncrease}, .${elementStrings.btnServingIncrease} *`)) { 
        // Increase if button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches(`.${elementStrings.btnRecipeAdd}, .${elementStrings.btnRecipeAdd} *`)) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches(`.${elementStrings.likeRecipe}, .${elementStrings.likeRecipe} *`)) {
        // Mark recipe as 'liked'
        controlLike();
    } else if (e.target.matches(`.${elementStrings.btnIncrease}, .${elementStrings.btnIncrease} *`)) {
        // Find id of clicked element
        const id = e.target.closest(`.${elementStrings.recipeItem}`).dataset.ing;
        // Add ingredient to list
        controlSingleIngredient(id);
    }
});