/* Note to SME: Axios included on the index.html using a CDN, instead of an NPM dependency */

'use strict';

window.addEventListener('load', () => {
  const searchForm = document.querySelector('.searchForm');
  const formInput = document.querySelector('.form-input');
  const messageOutput = document.querySelector('.message-output');
  const results = document.querySelector('.results');
  let message;

  // Search
  function searchResults(e) {
    e.preventDefault();
    const countryName = formInput.value;

    if (!countryName) {
      message = 'Geen invoer gedetecteerd';
      showMessage(message);
    } else {
      fetchWorldData(countryName);
    }
  }

  // Fetch 1 country from the server
  async function fetchWorldData(countryName) {
    try {
      const results = await axios.get(
        `https://restcountries.com/v3.1/name/${countryName}`
      ); // This version, v3.1, of the API seems to be stable now
      const country = results.data[0]; // Show only 1 result
      showResults(country);
    } catch (error) {
      message = 'Land niet gevonden';
      showMessage(message);
    }
  }

  // Show result on screen
  function showResults(country) {
    // API has changed, so we need to convert the object to an array:
    const currencyArray = Object.values(country.currencies); // https://stackoverflow.com/questions/69653710/restcountries-api-getting-names-of-currencies-dynamically-into-html-through-ja
    const languageArray = Object.values(country.languages);
    results.innerHTML = `
      <article class="result shadow">
        <img class="country-flag" src="${country.flags.svg}" alt="${
      country.name.common
    } flag" title="${country.name.common} flag" />
        <span class="country-name">${country.name.common}</span>
        <p class="names-population">${country.name.common} is situated in ${
      country.subregion
    }. It has a population of
        ${country.population} people.</p>
        <p class="capital-currencies">The capital is ${
          country.capital
        } and you can pay with ${displayCurrencies(currencyArray)}'s.</p>
        <p>${displayLanguages(languageArray)}.</p>
      </article>
      `;
    formInput.value = null; // Clean up search input field after query and showing results
  }

  // Show messages and delete them after 3 seconds
  function showMessage(message) {
    messageOutput.textContent = message;
    formInput.focus();
    formInput.value = null;
    setTimeout(() => {
      messageOutput.textContent = null;
    }, 3000);
  }

  // Display currencies
  // To test:
  // 1) Peru. 1 currency.
  // 2) Namibia. 2 currencies.
  function displayCurrencies(currencyArray) {
    if (currencyArray.length === 2) {
      return `${currencyArray[0].name} and ${currencyArray[1].name}`;
    }
    return currencyArray[0].name;
  }

  // Display languages
  // To test:
  // 1) Nederland: 1 language
  // 2) Hong Kong: 2 languages
  // 3) Peru: 3 languages
  // 4) Bolivia: 4 languages
  // 9) Namibia. 9 languages.
  // 15) Zimbabwe. 15 languages.
  function displayLanguages(languageArray) {
    let outputLanguage = 'They speak ';

    if (languageArray.length == 2){
        return `${outputLanguage}${languageArray[0]} and ${languageArray[1]}`;
    }
    
    return `${outputLanguage}${languageArray.slice(0, -1).join(", ")} and ${languageArray[languageArray.length -1]}`;
  }

  // Event listeners
  searchForm.addEventListener('submit', searchResults);
}); // End load event listener
