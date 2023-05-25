import { getServerData } from './fetch-module.js';
import { mainNavMenu } from './nav-module.js';
import { doStrFirstCapitalize } from './function-module.js';

async function getAlbumsWithPhotosAndUser() {
  const dataForm = 'albums?_expand=user&_embed=photos';
  const albums = await getServerData(dataForm);
  renderView(albums);
}

function renderView(albums) {
  const containerElement = document.querySelector('.container');
  const ulElement = document.createElement('ul');
  ulElement.classList.add('list', 'album-list');
  containerElement.appendChild(ulElement);

  albums.forEach(album => {
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
  });
}

getAlbumsWithPhotosAndUser();
mainNavMenu();
