import './sass/index.scss';
import Notiflix from 'notiflix';
import ApiService from './js/ApiService.js';
import debounce from 'lodash.debounce';
import galleryCard from './templates/galleryCard.hbs'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const DEBOUNCE_DELAY = 300;
let startAmount = 40;

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  submitBtn: document.querySelector('[type="submit"]'),
};

const apiService = new ApiService();

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', debounce(onLoadMore, DEBOUNCE_DELAY));
refs.gallery.addEventListener('click', onPictureClick)
refs.loadMoreBtn.classList.add('visually-hidden');

function onFormSubmit(e) {
  e.preventDefault();

  clearRequestedInfo();

  refs.loadMoreBtn.classList.add('visually-hidden');

  apiService.data = e.currentTarget.elements.searchQuery.value.trim();
  if (apiService.data === '') {
    return Notiflix.Notify.failure('Please enter your search query.');
  }

  apiService.resetPage();
  apiService.fetchCards().then(array => {
    if (array.length === 0) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }

    renderGalleryCard(array);
    refs.loadMoreBtn.classList.remove('visually-hidden');

    if (apiService.page === 2) {
      Notiflix.Notify.success(`We found ${apiService.totalHits} images.`);
    }

    if (array.length < 40) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}

function onLoadMore() {
  apiService.fetchCards().then(array => {
    renderGalleryCard(array);

    startAmount += array.length;

    if (startAmount === apiService.totalHits) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}

function renderGalleryCard(arrayOfObjects) {
  const markup = arrayOfObjects
    .map(galleryCard)
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);  
}

function clearRequestedInfo() {
  refs.gallery.innerHTML = '';
}

function onPictureClick(e) {
    e.preventDefault();
  
    if (e.target.nodeName !== 'IMG') {
      return;
    }
  
    
let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionType: 'attr',
    captionPosition: 'Bottom',
    captionDelay: 250,

});
  
    lightbox.on('show.simplelightbox', function () {});
    lightbox.refresh();

    console.log(onPictureClick)
  }
