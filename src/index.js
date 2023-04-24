import './css/styles.css';
import Notiflix from "notiflix";
import "notiflix/dist/notiflix-3.2.6.min.css";
import debounce from "lodash.debounce";

// import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("input#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

const BASE_URL = "https://restcountries.com/v3.1";
const ENDPOINT = "/name/";

export function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}${ENDPOINT}${searchQuery}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Error fetching data');
    })
    .catch(error => console.error(error));
}

function createMarkup(arr){
      return arr
      .map(({ name: { common }, capital, population, languages, flags: {svg} }) => {
                  return `<div class="country-list-item">
            <img class="country-list-img" src="${svg}" alt="Прапор ${common}" />
            <h2 class="country-title">${common}</h2>
          </div>
          <ul class="info">
            <li class="info-text">
              <span class="info-title">Capitel: </span>${capital}
            </li>
            <li class="info-text">
              <span class="info-title">Population: </span>${population}
            </li>
            <li class="info-text">
              <span class="info-title">Languages: </span
              >${Object.values(languages).join(", ")}
            </li>
          </ul>`
}).join("");

}


function createShortListMarkup(arr) {
      return arr
        .map(({ name: {common}, flags: {svg}}) => {
      return `<li class="country-list-item">
      <img class="country-list-img" src="${svg}" alt="${common}" />
      <p class="country-list-text">${common}</p>
    </li>`}).join("");
}


function renderShortList(arr) {
      const markup = createShortListMarkup(arr);
      countryList.innerHTML = markup;
      countryInfo.innerHTML = "";
    }
    
function renderCountryInfo(arr) {
      const markup = createMarkup(arr);
      countryInfo.innerHTML = markup;
      countryList.innerHTML = "";
    }
    
    function handleSearch(evt) {
      evt.preventDefault();
      const searchQuery = searchBox.value.trim();
    
      if (searchQuery === "") {
        countryList.innerHTML = "";
        countryInfo.innerHTML = "";
        return;
      }
    
      fetchCountries(searchQuery)
        .then((data) => {
          if (data.length > 10) {
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            return;
          }
          if (data.length === 1) {
            renderCountryInfo(data);
            return;
          }
          renderShortList(data);
        })
        .catch((error) => {
          console.error(error);
          Notiflix.Notify.failure("Oops, there is no country with that name");
        });
    }
    
    searchBox.addEventListener("input", debounce(handleSearch, DEBOUNCE_DELAY));