import axios from "axios";

axios.defaults.baseURL = 'https://pixabay.com/api/'

const KEY = '29688696-be7a3ad549ffca9d5a732b68f'

async function fetchImages(query, page, perPage) {
    const response = await axios.get(`?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`)

    return response
    
}

export { fetchImages }