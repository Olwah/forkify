import { elements, elementStrings } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = ''; // Clears the HTML from within the '.results__list' ul element.
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll(`.${elementStrings.resultsLink}`));
    resultsArr.forEach(el => {
        el.classList.remove(elementStrings.resultActive);
    });

    document.querySelector(`.${elementStrings.resultsLink}[href="#${id}"]`).classList.add(elementStrings.resultActive); // Select all 'a' links with href attribute of 'id' and add the active class.
};

/*
// limitRecipeTitle e.g. 'Pasta with tomato and spinach'
acc: 0 / acc + cur.length = 5 / 'newTitle' = ['Pasta']
acc: 5 / acc + cur.length = 9 / 'newTitle' = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / 'newTitle' = ['Pasta', 'with', 'tomato']
acc: 15 / acc + cur.length = 18 / 'newTitle' = ['Pasta', 'with', 'tomato']
acc: 18 / acc + cur.length = 25 / 'newTitle' = ['Pasta', 'with', 'tomato']
*/
// Note: This is used in the 'renderRecipe' function where HTML is injected.
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // Return the result
        return `${newTitle.join(' ')} ...`; // Use the 'join' method to add spaces back in between the words of the 'newTitle' array just created.
    } 
    return title;
};

// Note functions that do not need to be called outside of this file do not need to be exported.
const renderRecipe = recipe => {
    // Add the HTML as a template string and read the values from the returned 'recipe' object passed in from 'renderResults'.
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// Type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="${elementStrings.btnPages} results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        // Display button for NEXT page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Display button for PREVIOUS & NEXT page
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Display button for PREVIOUS page 
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Render results of current page
    const start = (page - 1) * resPerPage; // e.g. Page 1: (1 - 1) * 10 = 0 so it starts a point 0 in the array.
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe); // 'slice' cuts a portion of the array and then we loop through recipe results using 'forEach' and call 'renderRecipe' on each result.

    // Render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};