import './sass/index.scss';
import { fetchImages } from './js/apiservice.js';
import './js/scrollBtn.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import galleryCard from './templates/galleryCard.hbs';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more');
const searchBtn = document.querySelector('.btn-search');

let query = null;
let page = 1;
let simpleLightBox;
let perPage = 40;

searchForm.addEventListener('submit', onSearchForm);
searchForm.addEventListener('keydown', () => {
  searchBtn.removeAttribute('disabled');
});
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
  searchBtn.setAttribute('disabled', 'disabled');

  if (query === e.currentTarget.searchQuery.value) {
    alertSameQuery();
  }

  query = e.currentTarget.searchQuery.value.trim();

  if (query === '') {
    alertNoEmptySearch();
    return;
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound();
        return;
      }
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      alertImagesFound(data);
    })
    .catch(error => Notiflix.Notify.failure(error))
    .finally(e.target.reset());
}

function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      loading.classList.remove('show');
      const totalPages = Math.ceil(data.totalHits / perPage);
      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        alertEndOfSearch();
      }
    })
    .catch(error => Notiflix.Notify.failure(error));
}

function renderGallery(images) {
  const markup = images.map(galleryCard).join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function alertImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure('Please enter your search query.');
}

function alertNoImagesFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notiflix.Notify.failure(
    'We are sorry, but you have reached the end of search results.'
  );
}

function alertSameQuery() {
  Notiflix.Notify.warning('Please, change your search query');
}
