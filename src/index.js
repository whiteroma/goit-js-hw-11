import Notiflix from 'notiflix';
import ApiService from "./js/apiservice.js"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import galleryCard from './templates/galleryCard.hbs'

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.addEventListener('click', onLoadMoreBtn);
form.addEventListener('submit', onSubmit);

const apiservice = new ApiService();
let simpleLightBox = null;
loadMoreBtn.classList.add('visually-hidden');


function onSubmit(e) {
    e.preventDefault();
    

    loadMoreBtn.classList.remove('visually-hidden');

    clearArticlesContainer();
    apiservice.query = e.currentTarget.elements.searchQuery.value;
    apiservice.resetPage();
    apiservice.fetchArticles().then(articles => {
        if (articles.hits.length === 0) {
            return  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }

        Notiflix.Notify.success(`Hooray! We found ${articles.totalHits} images.`);
        renderMarkupCards(articles);
        simpleLightBox.refresh();
    })   
}

function renderMarkupCards(obj) {
    const markup = obj.hits.map(galleryCard).join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
}

function clearArticlesContainer() {
    gallery.innerHTML = '';  
}


function onLoadMoreBtn() {
  apiservice.page += 1;
  simpleLightBox.refresh()

  apiservice.fetchArticles().then(array => {
      renderMarkupCards(array);

      apiservice.perPage += array.length;

      simpleLightBox.refresh();

      if (apiservice.page > apiservice.totalHits) {
        loadMoreBtn.classList.add('visually-hidden');
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      }
    })
    .catch(error => console.log(error));
}
