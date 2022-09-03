import axios from "axios";

const BASE_URL = axios.defaults.baseURL = 'https://pixabay.com/api/';

async function fetchImages(query,page,perPage) {
  try {
    const response = await axios.get(`${BASE_URL}/`,{
      params: {
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        q: query,
        page: page,
        per_page: perPage,
        key: '29688696-be7a3ad549ffca9d5a732b68f'
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