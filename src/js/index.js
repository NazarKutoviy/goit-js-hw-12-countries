import debounce from "lodash.debounce";
import fetchCountries from "./fetchCountries";
import { alert, notice } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

const input = document.querySelector("#search-box");
const countryList = document.querySelector("#country-list");
const countryInfo = document.querySelector("#country-info");

input.addEventListener("input", debounce(onInput, 500));

function onInput(e) {
  const searchQuery = e.target.value.trim();

  if (!searchQuery) {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then((data) => {
      clearMarkup();

      if (data.length > 10) {
        alert({
          text: "Too many matches found. Please enter a more specific query!",
        });
      } else if (data.length >= 2 && data.length <= 10) {
        renderCountryList(data);
      } else if (data.length === 1) {
        renderCountryInfo(data[0]);
      }
    })
    .catch(() => {
      clearMarkup();
      notice({
        text: "No countries found with that name.",
      });
    });
}

function renderCountryList(countries) {
  const markup = countries
    .map((country) => `<li class="country-item">${country.name}</li>`)
    .join("");
  countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const languages = country.languages.map((lang) => lang.name).join(", ");
  const markup = `
    <h2>${country.name}</h2>
    <p><strong>Capital:</strong> ${country.capital}</p>
    <p><strong>Population:</strong> ${country.population}</p>
    <p><strong>Languages:</strong> ${languages}</p>
    <img class="flag" src="${country.flag}" alt="Flag of ${country.name}" />
  `;
  countryInfo.innerHTML = markup;
}

function clearMarkup() {
  countryList.innerHTML = "";
  countryInfo.innerHTML = "";
}
