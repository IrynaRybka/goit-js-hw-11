import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

import {fetchImg} from './js/fetch-img';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
  searchQuery: document.querySelector('input[name="searchQuery"]'),
};

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);


let perPage = 40;
let page = 1;
let name = "";

isHiddenBtn();
//Submit on form

async function onSubmit(ev) {
  ev.preventDefault();
  refs.gallery.innerHTML = '';
  isHiddenBtn();

  page = 1;
  name = refs.searchQuery.value.trim();

  fetchImg(name, page, perPage).then(name => {
      let totalPages = name.totalHits / perPage;

      if (name.hits.length > 0) {
        Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
        renderGallery(name);
        new SimpleLightbox('.gallery a').refresh();

     

        if (page < totalPages) {
          refs.loadMoreBtn.style.display = 'block';
        } else {
            isHiddenBtn()
          infoEndOfSearch()
        }
      } else {
        errorSearch()
        refs.gallery.innerHTML = '';
      }
    })
    .catch(error => console.log('ERROR: ' + error));
}



// Gallery markup

function renderGallery(name) {
  const cards = name.hits
    .map(hit => {
      return `<div class="photo-card">
      <div class="img-container">
      <a class="gallery-item" href="${hit.largeImageURL}">
      <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
      </a>
      </div>
      <div class="info">
        <p class="info-item">👍
          <b>${hit.likes}</b>
        </p>
        <p class="info-item">👀
          <b>${hit.views}</b>
        </p>
        <p class="info-item">💬 
          <b>${hit.comments}</b>
        </p>
        <p class="info-item">⬇ 
          <b>${hit.downloads}</b>
        </p>
      </div>
    </div>`;
    })
    .join('');
 refs.gallery.insertAdjacentHTML('beforeend', cards);
}


// Load more button - function



function onLoadMore() {
    name = refs.searchQuery.value.trim();
    page += 1;

    fetchImg(name, page, perPage).then(name => {
      let totalPages = name.totalHits / perPage;
      renderGallery(name);
      new SimpleLightbox('.gallery a').refresh();
      if (page >= totalPages) {
        isHiddenBtn()
        infoEndOfSearch()
      }
    });
    true
  }

//   information for users
 
function infoEndOfSearch() {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

function errorSearch() {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

// hidden Button

function isHiddenBtn() {
    refs.loadMoreBtn.style.display = 'none';
};