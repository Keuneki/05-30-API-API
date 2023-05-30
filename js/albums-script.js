import { getServerData } from './fetch-module.js';
import { mainNavMenu } from './nav-module.js';
import { doStrFirstCapitalize } from './function-module.js';

const containerElement = document.querySelector('.container');
const pageLinksElement = document.createElement('div');
pageLinksElement.classList.add('page-links');

let currentPage = 1;
let totalAlbums = 0;
let totalPages = 0;
let albumsPerPage = 25;

async function getAlbumsWithPhotosAndUser() {
  const dataForm = 'albums?_expand=user&_embed=photos';
  const albums = await getServerData(dataForm);
  totalAlbums = albums.length;
  totalPages = Math.ceil(totalAlbums / albumsPerPage);

  renderView(albums);
  renderPageLinks();
}

function renderView(albums) {
  const ulElement = document.createElement('ul');
  ulElement.classList.add('list', 'album-list');
  containerElement.appendChild(ulElement);

  const startIndex = (currentPage - 1) * albumsPerPage;
  const endIndex = currentPage * albumsPerPage;

  for (let i = startIndex; i < endIndex && i < totalAlbums; i++) {
    const album = albums[i];
    const liElement = document.createElement('li');
    const divElement = document.createElement('div');
    divElement.classList.add('album-content');

    const aAlbumElement = document.createElement('a');
    const aAuthorElement = document.createElement('a');
    const aImgElement = document.createElement('a');
    const photoElement = document.createElement('img');

    const randomIndex = Math.floor(Math.random() * album.photos.length);
    const randomPhoto = album.photos[randomIndex];

    photoElement.src = randomPhoto.thumbnailUrl;
    photoElement.alt = randomPhoto.title;

    aAlbumElement.textContent = `${doStrFirstCapitalize(album.title)} (${album.photos.length})`;
    aAlbumElement.href = `./album.html?album_id=${album.id}`;

    aAuthorElement.textContent = album.user.name;
    aAuthorElement.href = `./user.html?user_id=${album.user.id}`;

    aImgElement.href = `./album.html?album_id=${album.id}`;
    aImgElement.appendChild(photoElement);

    divElement.appendChild(aImgElement);
    divElement.appendChild(aAlbumElement);
    divElement.appendChild(aAuthorElement);
    liElement.appendChild(divElement);
    ulElement.appendChild(liElement);
  }
}

function renderPageLinks() {
  pageLinksElement.innerHTML = '';

  const firstPageLink = createPageLink('First', 1);
  const previousPageLink = createPageLink('Previous', currentPage - 1);
  const nextPageLink = createPageLink('Next', currentPage + 1);
  const lastPageLink = createPageLink('Last', totalPages);

  pageLinksElement.appendChild(firstPageLink);
  pageLinksElement.appendChild(previousPageLink);

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = createPageLink(i, i);
    pageLinksElement.appendChild(pageLink);
  }

  pageLinksElement.appendChild(nextPageLink);
  pageLinksElement.appendChild(lastPageLink);

  containerElement.appendChild(pageLinksElement);
}

function createPageLink(text, page) {
  const buttonElement = document.createElement('button');
  buttonElement.textContent = text;

  if (page === currentPage) {
    buttonElement.classList.add('current-page');
    buttonElement.disabled = true;
  } else if (page >= 1 && page <= totalPages) {
    buttonElement.classList.add('page-link');
    buttonElement.addEventListener('click', () => {
      currentPage = page;
      containerElement.innerHTML = '';
      getAlbumsWithPhotosAndUser();
      renderPageLinks();
    });
  } else {
    buttonElement.classList.add('disabled');
    buttonElement.disabled = true;
  }

  return buttonElement;
}

function handleAlbumsPerPageChange(event) {
  albumsPerPage = parseInt(event.target.value);
  currentPage = 1;
  containerElement.innerHTML = '';
  getAlbumsWithPhotosAndUser();
}

const albumsPerPageSelect = document.createElement('select');
albumsPerPageSelect.addEventListener('change', handleAlbumsPerPageChange);
const options = [10, 25, 50, 100];
options.forEach(option => {
  const optionElement = document.createElement('option');
  optionElement.value = option;
  optionElement.textContent = option;
  if (option === albumsPerPage) {
    optionElement.selected = true;
  }
  albumsPerPageSelect.appendChild(optionElement);
});

const albumsPerPageLabel = document.createElement('label');
albumsPerPageLabel.textContent = 'Albums per page:';
albumsPerPageLabel.appendChild(albumsPerPageSelect);

const pageControlsElement = document.createElement('div');
pageControlsElement.classList.add('page-controls');
pageControlsElement.appendChild(albumsPerPageLabel);

containerElement.appendChild(pageControlsElement);

getAlbumsWithPhotosAndUser();
mainNavMenu();
