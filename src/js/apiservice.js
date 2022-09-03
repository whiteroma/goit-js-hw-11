import axios from "axios";
import Notiflix from 'notiflix';
const URL = 'https://pixabay.com/api/';
const KEY = '29688696-be7a3ad549ffca9d5a732b68f';

export default class ApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.perPage = 40;
        this.totalHits = 0;
    };

    async fetchArticles() {
        const params = {
            key: KEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: this.perPage,
            page: this.page,
        }
        try {
            const response = await axios.get(URL, { params });
            const totalHits = response.data.totalHits;
            this.totalHits = totalHits;
            this.page += 1;
            
            return response.data;
        } catch (error) {
            Notiflix.Notify.failure(`An error occured. Please try again.`);
            console.error(error.response);
        
        }     
    }

    resetPage() {
    this.page = 1;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}