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