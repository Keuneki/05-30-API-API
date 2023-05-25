import { getServerData } from './fetch-module.js';
import { mainNavMenu } from './nav-module.js';

async function getUsersWithPosts() {
  const dataForm = 'users?_embed=posts';
  const users = await getServerData(dataForm);
  renderUserList(users);
}

function renderUserList(users) {
  const containerElement = document.querySelector('.container');
  containerElement.classList.add('user-list-container');

  const ulElement = document.createElement('ul');
  ulElement.classList.add('user-list');
  containerElement.appendChild(ulElement);

  users.forEach(user => {
    const liElement = document.createElement('li');
    const aElement = document.createElement('a');
    const postCount = user.posts.length;
    const postText = postCount === 1 ? 'post' : 'posts';

    aElement.textContent = `${user.name} (${postCount} ${postText})`;
    aElement.href = `./user.html?user_id=${user.id}`;

    liElement.appendChild(aElement);
    ulElement.appendChild(liElement);
  });
}

async function init() {
  await getUsersWithPosts();
  mainNavMenu();
}

init();
