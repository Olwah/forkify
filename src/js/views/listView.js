import { elements, elementStrings } from './base';

export const renderItem = item => {
    const markup = `
    <li class="shopping__item" data-itemid="${item.id}">
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" min="0" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>  
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) item.parentElement.removeChild(item); 
};

export const renderClearItems = () => {
    const markup = `
    <div class="shopping__clear-all">
        <p>Clear all</p>
        <button class="shopping__delete shopping__delete-all btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </div>
    `;
    const listTitle = document.getElementById('list-clear');
    listTitle.insertAdjacentHTML('afterbegin', markup);
};

export const clearItems = () => {
    // Remove 'Clear all' div
    const clearAll = document.querySelector(`.${elementStrings.shoppingClrAll}`);
    clearAll.parentElement.removeChild(clearAll);

    // Remove all list items
    elements.shopping.innerHTML = '';
};