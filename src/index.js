import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const cardCountry = document.querySelector('.country-info');
const listCountry = document.querySelector('.country-list');

inputRef.addEventListener('input', debounce(writeCountry, DEBOUNCE_DELAY));

function writeCountry(ev) {
  const searchInput = ev.target.value.trim();
  if (searchInput === '') {
    return clearInput();
    // (cardCountry.innerHTML = '') & (listCountry.innerHTML = '');
  }
  fetchCountries(searchInput)
    .then(country => {
      // cardCountry.innerHTML = ''
      // listCountry.innerHTML = ''
      clearInput();
      console.log(country);
      if (country.length === 1) {
        cardCountry.insertAdjacentHTML('beforeend', markupCountry(country));
        listCountry.insertAdjacentHTML('beforeend', markupListSearch(country));
      } else if (country.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        listCountry.insertAdjacentHTML('beforeend', markupListSearch(country));
      }
    })
    .catch(errorNotify);
  // .finally(() => inputRef.reset());
}

function errorNotify() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearInput() {
  cardCountry.innerHTML = '';
  listCountry.innerHTML = '';
}
//===================== MARKUP ==================================
// add markup of coutry
function markupCountry(country) {
  return country
    .map(({ name, flags, capital, population, languages }) => {
      return `<h2 class="country">Country: ${name}</h2>
 <img class="flag" src="${flags.svg}" alt="Flag" width="100">
 <ul class="description">
   <li class="capital"><span class="list">Capital of ${name}:</span> ${capital}</li>
   <li class="population"><span class="list">Population:</span> ${population}</li>
   <li class="language"><span class="list">Languages are:</span> ${languages
     .map(x => x.name)
     .join(' ')}</li>
 </ul>`;
    })
    .join(' ');
}
// {Object.values(languages[1]).join(' ')
// array.map(x => x.same_field)
// ${languages[0].name}
// add markup search list
function markupListSearch(country) {
  return country
    .map(({ name, flags }) => {
      return `<div class="container-list">
          <img class="flag-list" src="${flags.svg}" width="40" alt="Flag">
          <h2 class="head-list">${name}</h2>
        </div>`;
    })
    .join(' ');
}
