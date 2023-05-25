import { getServerData } from './fetch-module.js';
import { doStrFirstCapitalize, doStrCutLastSymbol } from './function-module.js';

const navElement = document.querySelector('#menu');
const linkBackElement = document.createElement('a');
const containerElement = document.querySelector('.container');

async function getSearchQuery() {
  const searchQuery = new URLSearchParams(location.search);
  const query = searchQuery.get('query');
  const searchBy = searchQuery.get('search');

  await searchFn(query, searchBy);
}

async function searchFn(query, searchBy) {
  const dataForm = `${searchBy}?q=${query}`;
  const apiData = await getServerData(dataForm);
  searchNav(searchBy);
  doViewPort(apiData, searchBy);
}

function searchNav(searchBy) {
  linkBackElement.href = `./${searchBy}.html`;
  linkBackElement.textContent = `Back to ${doStrFirstCapitalize(searchBy)}`;
  linkBackElement.classList.add('back-link');
  navElement.prepend(linkBackElement);
}

function localSearch() {
  const searchFormElement = document.querySelector('#search-form');
  searchFormElement.addEventListener('submit', event => {
    event.preventDefault();
    const query = event.target.query.value;
    const searchBy = new URLSearchParams(location.search).get('search');
    searchFn(query, searchBy);
  });
}

function doViewPort(apiData, searchBy) {
  containerElement.innerHTML = '';
  const ulElement = document.createElement('ul');
  ulElement.classList.add('list');
  containerElement.append(ulElement);
  const pathElement = doStrCutLastSymbol(searchBy);

  if (apiData.length > 0) {
    apiData.forEach(element => {
      const linkElement = document.createElement('a');
      const liElement = document.createElement('li');
      linkElement.href = `./${pathElement}.html?${pathElement}_id=${element.id}`;
      linkElement.textContent = element.title || element.name;
      liElement.append(linkElement);
      ulElement.append(liElement);
    });
  } else {
    const noSearchResultElement = document.createElement('h2');
    noSearchResultElement.textContent = 'No Search Result...';
    containerElement.append(noSearchResultElement);
  }
}

async function main() {
  await getSearchQuery();
  localSearch();
}

main();
