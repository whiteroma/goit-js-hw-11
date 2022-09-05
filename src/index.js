import './sass/index.scss';
import { fetchImages } from './js/apiservice.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import galleryCard from './templates/galleryCard.hbs';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more');
const searchBtn = document.querySelector('.btn-search');
const toBtnTop = document.querySelector('.btn-to-top');
const loading = document.querySelector('.loading');

let query = null;
let page = 1;
let simpleLightBox;
let perPage = 40;

searchForm.addEventListener('submit', onSearchForm);
searchForm.addEventListener('keydown', () => {
  searchBtn.removeAttribute('disabled');
});
loadMoreBtn.addEventListener('click', onLoadMoreBtn);
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (clientHeight + scrollTop >= scrollHeight - 5) {
        showLoading();
    }
});
window.addEventListener('scroll', onScroll);
toBtnTop.addEventListener('click', onToTopBtn);


onScroll();
onToTopBtn();

function onSearchForm(e) {
  e.preventDefault();
  

  if (query === e.currentTarget.searchQuery.value) {
    alertSameQuery();
  }

  if (query === '') {
    alertNoEmptySearch();
    return;
  }
  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
  searchBtn.setAttribute('disabled', 'disabled');
  query = e.currentTarget.searchQuery.value.trim();
 
  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound();
        return;
      } 
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      alertImagesFound(data);
      loadMoreBtn.classList.remove('is-hidden')
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

function onScroll() {
  const scrolled = window.pageYOffset
  const coords = document.documentElement.clientHeight

  if (scrolled > coords) {
    toBtnTop.classList.add('btn-to-top--visible')
  }
  if (scrolled < coords) {
    toBtnTop.classList.remove('btn-to-top--visible')
  }
}

function onToTopBtn() {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function showLoading() {
    loading.classList.add('show');
	setTimeout (onLoadMoreBtn, 3000)
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

