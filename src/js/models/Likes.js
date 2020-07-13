export default class Likes {
    constructor() {
        this.likes = []
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Persist data in local storage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id); // Find the index of the element passed in and see if it matches the ID of the item to be deleted.
        this.likes.splice(index, 1);

        // Persist data in local storage
        this.persistData();

    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1; // Returns a 'true' or 'false' value by checking if the ID passed in matches the ID of the element.
    }

    getNumLikes() {
        return this.likes.length;
    }

    // Used to store data locally on the global window object
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes)); // Convert 'likes' array into a string as localStorage method needs to save as a string.
    }

    // Used to retreive data when the page is reloaded
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes')); 

        // Restoring like from the localStorage
        if (storage) this.likes = storage;
    }
};