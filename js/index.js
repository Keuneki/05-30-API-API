import { mainNavMenu } from './nav-module.js';
import { getServerData } from './fetch-module.js';
import { doStrFirstCapitalize } from './function-module.js';

mainNavMenu();

async function populateHomePage() {
  const postsContainer = document.querySelector('#posts-container');
  const albumsContainer = document.querySelector('#albums-container');
  const usersContainer = document.querySelector('#users-container');

  const postsData = await fetchPostsData();
  const albumsData = await fetchAlbumsData();
  const usersData = await fetchUsersData();

  const last5Posts = createPostsData(postsData.slice(-5));
  const last5Albums = createAlbumsData(albumsData.slice(-5));
  const last5Users = createUsersData(usersData.slice(-5));

  appendElements(postsContainer, last5Posts);
  appendElements(albumsContainer, last5Albums);
  appendElements(usersContainer, last5Users);
}

async function fetchPostsData() {
  const dataForm = 'posts?_expand=user&_embed=comments';
  const posts = await getServerData(dataForm);
  return posts;
}

function createPostsData(posts) {
  const postElements = [];
  posts.forEach(post => {
    const liElement = document.createElement('li');
    const postLinkElement = document.createElement('a');
    const authorLinkElement = document.createElement('a');

    postLinkElement.textContent = `${doStrFirstCapitalize(post.title)} (${post.comments.length})`;
    postLinkElement.href = `./post.html?post_id=${post.id}`;

    authorLinkElement.textContent = post.user.name;
    authorLinkElement.href = `./user.html?user_id=${post.user.id}`;

    liElement.append(postLinkElement, ' ', authorLinkElement);
    postElements.push(liElement);
  });

  return postElements;
}

async function fetchAlbumsData() {
  const dataForm = 'albums?_expand=user&_embed=photos';
  const albums = await getServerData(dataForm);
  return albums;
}

function createAlbumsData(albums) {
  const albumElements = [];
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
    albumElements.push(liElement);
  });

  return albumElements;
}

async function fetchUsersData() {
  const dataForm = 'users?_embed=posts';
  const users = await getServerData(dataForm);
  return users;
}

function createUsersData(users) {
  const userElements = [];
  users.forEach(user => {
    const liElement = document.createElement('li');
    const aElement = document.createElement('a');
    const postCount = user.posts.length;
    const postText = postCount === 1 ? 'post' : 'posts';

    aElement.textContent = `${user.name} (${postCount} ${postText})`;
    aElement.href = `./user.html?user_id=${user.id}`;

    liElement.appendChild(aElement);
    userElements.push(liElement);
  });

  return userElements;
}

function appendElements(container, elements) {
  elements.forEach(element => {
    container.appendChild(element);
  });
}

populateHomePage();
