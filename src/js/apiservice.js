const axios = require('axios');
export default class ApiService {
  constructor() {
    this.searchValue = '';
    this.page = 1;
    this.totalHits = 0;
  }


  async fetchCards() {
    const url = `https://pixabay.com/api/?key=25003680-e74f6748a2c57625989dee070&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    try {
      const response = await axios.get(url);
      const arrayOfObjects = response.data.hits;
      const totalHits = response.data.totalHits;
      this.incrementPage();
      this.totalHits = totalHits;

      // console.log(arrayOfObjects);

      return arrayOfObjects;
    } catch (error) {
      console.log('ERROR: ', console.log(error));
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get data() {
    return this.searchValue;
  }

  set data(newData) {
    this.searchValue = newData;
  }
}