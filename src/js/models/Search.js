import axios from 'axios';  // Axios is used instead of 'fetch' keyword because it's supported in all browsers and also retturns the information as a JSON file.
import { clearLoader, errorHandler } from '../views/base';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch (error) {
            // Display error in UI and clear load icon
            clearLoader();
            errorHandler(error);
        }    
    }
};