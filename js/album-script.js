import { getServerData } from './fetch-module.js';
import { doStrFirstCapitalize } from './function-module.js';

async function getAlbumWithPhotosAndUser() {
  const albumId = new URLSearchParams(location.search).get('album_id');
  const dataForm = `albums/${albumId}?_expand=user&_embed=photos`;
  const album = await getServerData(dataForm);
  renderView(album);
}

function renderView(album) {
  const containerElement = document.querySelector('.container');
  const contentElement = document.createElement('div');
  contentElement.classList.add('album-container');

  const titleElement = document.createElement('h2');
  titleElement.textContent = doStrFirstCapitalize(album.title);

  const userElement = document.createElement('h3');
  userElement.textContent = album.user.name;

  contentElement.append(titleElement, userElement);
  containerElement.appendChild(contentElement);

  const galleryElement = document.querySelector('#gallery');
  galleryElement.classList.add('pswp-gallery');

  album.photos.forEach(photo => {
    const linkPhotoElement = document.createElement('a');
    linkPhotoElement.classList.add('photo-link');
    linkPhotoElement.href = photo.url;
    linkPhotoElement.target = '_blank';

    const imgPhotoElement = document.createElement('img');
    imgPhotoElement.classList.add('photo-thumbnail');
    imgPhotoElement.src = photo.thumbnailUrl;
    imgPhotoElement.alt = photo.title;

    linkPhotoElement.appendChild(imgPhotoElement);
    galleryElement.appendChild(linkPhotoElement);
  });
}

getAlbumWithPhotosAndUser();
