import uniqid from 'uniqid';
import { renderClearItems } from '../views/listView';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(), // This uses a node package to create a unique ID for each item in the shopping list.
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        this.persistData();
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id); // Find the index of the element passed in and see if it matches the ID of the item to be deleted.

        // [2, 4, 8] splice(1, 1) --> returns 4, original array is [2, 8]
        // [2, 4, 8] slice(1, 1) --> returns 4, original array is [2, 4, 8]
        // Pass in the index where the item sits and delete a single item from the array.
        this.items.splice(index, 1);
        this.persistData();
    }

    deleteAllItems() {
        this.items = [];
        this.persistData();
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount; // Find the item that was clicked and update the count.
    }

    // Used to store data locally on the global window object
    persistData() {
        localStorage.setItem('items', JSON.stringify(this.items)); // Convert 'items' array into a string as localStorage method needs to save as a string.
    }

    // Used to retreive data when the page is reloaded
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('items')); 

        // Restoring like from the localStorage
        if (storage) this.items = storage;
    }
};