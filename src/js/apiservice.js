import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29688696-be7a3ad549ffca9d5a732b68f';

async function fetchImages(query,page,perPage) {
  try {
    
    const response = await axios.get(BASE_URL, {
      params: {
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        q: query,
        page,
        perPage,
        key: KEY
      }
    });
    return response;
  } catch (error) {
    if(error.response.status === 400){
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    };
  };
};

export { fetchImages }