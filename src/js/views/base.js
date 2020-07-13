export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    servings: document.querySelector('.recipe__info-data--people'),
    shopContainer: document.querySelector('.shopping'),
    shoppingClrAll: document.querySelector('.shopping__clear-all'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader', // We don't add the '.' as we don't want to use it in the 'renderLoader' template string containing HTML so we have to add it manually if used in with a 'querySelector'.
    btnPages: 'btn-inline',
    resultActive: 'results__link--active',
    resultsLink: 'results__link',
    btnDecrease: 'btn-decrease',
    btnIncrease: 'btn-increase',
    btnServingIncrease: 'btn-increase-servings',
    recipeCount: 'recipe__count',
    recipeItem: 'recipe__item',
    servings: 'recipe__info-data--people',
    btnRecipeAdd: 'recipe__btn--add',
    shopContainer: 'shopping',
    shoppingClrAll: 'shopping__clear-all',
    shoppingDelAll: 'shopping__delete-all',
    shoppingItem: 'shopping__item',
    btnShoppingDelete: 'shopping__delete',
    shoppingCountValue: 'shopping__count-value',
    likeRecipe: 'recipe__love'
};

// Rotating arrow animation used while recipes load
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`); // Add in the '.' as 'elementStrings' contains only the class name.

    if (loader) loader.parentElement.removeChild(loader); // Remember you need to move up to the parent element and delete the child to remove a chunk of HTML.
};

export const errorHandler = async (error) => {
    console.log(error);

    // Add 'active' class to display the error in UI
    const errorMsg = document.querySelector('.error');
    errorMsg.classList.add('active');

    // Change text content to display tailored error message
    errorMsg.textContent = `There was an error: ${error}`;

    // Remove 'active' class after a few seconds
    (function() {
        setTimeout(() => {
            document.querySelector('.error').classList.remove('active')
        }, 5000);
    }());
};